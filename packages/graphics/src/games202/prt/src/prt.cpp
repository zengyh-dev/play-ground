#include <Eigen/Core>
#include <filesystem/resolver.h>
#include <fstream>
#include <nori/integrator.h>
#include <nori/ray.h>
#include <nori/scene.h>
#include <random>
#include <sh/default_image.h>
#include <sh/spherical_harmonics.h>
#include <stb_image.h>

using namespace std;

NORI_NAMESPACE_BEGIN

namespace ProjEnv {
// vector是一个动态数组，可以在运行时根据需要动态调整大小
vector<unique_ptr<float[]>> LoadCubemapImages(
    const string& cubemapDir,
    int& width,
    int& height,
    int& channel)
{
    vector<string> cubemapNames {
        "negx.jpg",
        "posx.jpg",
        "posy.jpg",
        "negy.jpg",
        "posz.jpg",
        "negz.jpg"
    };
    // unique_ptr是一个智能指针类模板，用于管理动态分配的内存资源
    vector<unique_ptr<float[]>> images(6);
    for (int i = 0; i < 6; i++) {
        string filename = cubemapDir + "/" + cubemapNames[i];
        int w, h, c;
        // float*表示一个指向float类型数据的指针
        float* image = stbi_loadf(filename.c_str(), &w, &h, &c, 3);
        if (!image) {
            cout << "Failed to load image: " << filename << endl;
            exit(-1);
        }
        if (i == 0) {
            width = w;
            height = h;
            channel = c;
        } else if (w != width || h != height || c != channel) {
            // 对于后续加载的图像，检查其宽度、高度和通道数是否与第一个图像一致，如果不一致，则输出错误信息并退出程序
            cout << "Dismatch resolution for 6 images in cubemap" << endl;
            exit(-1);
        }

        // 创建了一个std::unique_ptr对象，该对象将image指针所指向的float类型数组作为其所管理的资源
        // 这意味着，当std::unique_ptr对象被销毁时，它会自动释放所管理的内存资源，避免了手动释放内存的麻烦和内存泄漏的风险
        images[i] = unique_ptr<float[]>(image);
        int index = (0 * 128 + 0) * channel;
        // cout << images[i][index + 0] << "\t" << images[i][index + 1] << "\t"
        //           << images[i][index + 2] << endl;
    }
    return images;
}

const Eigen::Vector3f cubemapFaceDirections[6][3] = {
    { { 0, 0, 1 }, { 0, -1, 0 }, { -1, 0, 0 } }, // negx
    { { 0, 0, 1 }, { 0, -1, 0 }, { 1, 0, 0 } }, // posx
    { { 1, 0, 0 }, { 0, 0, -1 }, { 0, -1, 0 } }, // negy
    { { 1, 0, 0 }, { 0, 0, 1 }, { 0, 1, 0 } }, // posy
    { { -1, 0, 0 }, { 0, -1, 0 }, { 0, 0, -1 } }, // negz
    { { 1, 0, 0 }, { 0, -1, 0 }, { 0, 0, 1 } }, // posz
};

// 引用类型的参数允许在函数内部修改传入的参数的值，并且不会创建参数的副本
// 通过使用引用类型的参数，可以避免在函数调用时进行大量的数据复制，提高程序的效率
float CalcPreArea(const float& x, const float& y)
{
    // 以弧度表示的角度值
    // 表示点(x * y, sqrt(x * x + y * y + 1.0))与原点之间的夹角
    return atan2(x * y, sqrt(x * x + y * y + 1.0));
}

// 计算 cubemap 上每个像 素所代表的矩形区域投影到单位球面的面积
float CalcArea(const float& u_, const float& v_, const int& width,
    const int& height)
{
    // transform from [0..res - 1] to [- (1 - 1 / res) .. (1 - 1 / res)]
    // ( 0.5 is for texel center addressing)
    // u和v是将输入的像素坐标转换为[-1..1]范围内的纹理坐标
    float u = (2.0 * (u_ + 0.5) / width) - 1.0;
    float v = (2.0 * (v_ + 0.5) / height) - 1.0;

    // shift from a demi texel, mean 1.0 / size  with u and v in [-1..1]
    // 每个像素的纹理坐标的偏移量
    float invResolutionW = 1.0 / width;
    float invResolutionH = 1.0 / height;

    // u and v are the -1..1 texture coordinate on the current face.
    // get projected area for this texel
    // 投影区域的四个顶点的纹理坐标
    float x0 = u - invResolutionW;
    float y0 = v - invResolutionH;
    float x1 = u + invResolutionW;
    float y1 = v + invResolutionH;
    // 计算得到的投影区域的面积
    float angle = CalcPreArea(x0, y0) + CalcPreArea(x1, y1) - CalcPreArea(x0, y1) - CalcPreArea(x1, y0);

    return angle;
}

// template <typename T> T ProjectSH() {}

template <size_t SHOrder> // 球谐函数阶数

vector<Eigen::Array3f> PrecomputeCubemapSH(const vector<unique_ptr<float[]>>& images,
    const int& width, const int& height,
    const int& channel)
{
    vector<Eigen::Vector3f> cubemapDirs;
    cubemapDirs.reserve(6 * width * height);
    for (int i = 0; i < 6; i++) {
        Eigen::Vector3f faceDirX = cubemapFaceDirections[i][0];
        Eigen::Vector3f faceDirY = cubemapFaceDirections[i][1];
        Eigen::Vector3f faceDirZ = cubemapFaceDirections[i][2];
        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width; x++) {
                float u = 2 * ((x + 0.5) / width) - 1;
                float v = 2 * ((y + 0.5) / height) - 1;
                Eigen::Vector3f dir = (faceDirX * u + faceDirY * v + faceDirZ).normalized();
                cubemapDirs.push_back(dir);
            }
        }
    }
    constexpr int SHNum = (SHOrder + 1) * (SHOrder + 1);
    vector<Eigen::Array3f> SHCoeffiecents(SHNum);
    for (int i = 0; i < SHNum; i++)
        SHCoeffiecents[i] = Eigen::Array3f(0);
    float sumWeight = 0;
    for (int i = 0; i < 6; i++) {
        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width; x++) {
                // TODO: here you need to compute light sh of each face of cubemap of each pixel
                // TODO: 此处你需要计算每个像素下cubemap某个面的球谐系数

                // 1. 获取每个像素到中心点方向
                // 天空盒我们认为是无限大, 所以场景物体都可以认为在天空盒中心
                Eigen::Vector3f dir = cubemapDirs[i * width * height + y * width + x];

                // 2. 获取当前像素rbg信息作为光照值
                int index = (y * width + x) * channel;
                Eigen::Array3f Le(images[i][index + 0], images[i][index + 1],
                    images[i][index + 2]);

                // double theta = acos(dir.z());
                // double phi = atan2(dir.y(), dir.x());
                // 3. 获取cubemap上这个像素对应的立体角的权重, 对于单位球体，立体角就是
                double delta_w = CalcArea(x, y, width, height);

                // 4.
                // 我们遍历所有基函数求出光照函数在基函数上的投影，并把结果累加起来即可
                // 生成球谐系数的过程，也称为投影
                // l代表当前阶数，m代表当前阶的第m个基函数
                for (int l = 0; l <= SHOrder; l++) {
                    for (int m = -l; m <= l; m++) {
                        auto sh = sh::EvalSH(l, m, Eigen::Vector3d(dir.x(), dir.y(), dir.z()).normalized());

                        SHCoeffiecents[l * (l + 1) + m] += Le * sh * delta_w;
                    }
                }
            }
        }
    }
    return SHCoeffiecents;
}
}

class PRTIntegrator : public Integrator {
public:
    static constexpr int SHOrder = 2; // 只使用前三阶(0, 1, 2)的球谐函数，也就是一共9个基函数
    static constexpr int SHCoeffLength = (SHOrder + 1) * (SHOrder + 1);

    enum class Type {
        Unshadowed = 0,
        Shadowed = 1,
        Interreflection = 2
    };

    PRTIntegrator(const PropertyList& props)
    {
        /* No parameters this time */
        m_SampleCount = props.getInteger("PRTSampleCount", 100);
        m_CubemapPath = props.getString("cubemap");
        auto type = props.getString("type", "unshadowed");
        if (type == "unshadowed") {
            m_Type = Type::Unshadowed;
        } else if (type == "shadowed") {
            m_Type = Type::Shadowed;
        } else if (type == "interreflection") {
            m_Type = Type::Interreflection;
            m_Bounce = props.getInteger("bounce", 1);
        } else {
            throw NoriException("Unsupported type: %s.", type);
        }
    }

    unique_ptr<vector<double>> computeInterreflectionSH(
        Eigen::MatrixXf* directTSHCoeffs, // 类型对象的指针，表示直接光照的球谐系数
        const Point3f& pos, // 表示点的位置的 Point3f 类型对象
        const Normal3f& normal, // 表示点的法线的 Normal3f 类型对象
        const Scene* scene, // 指向 Scene 类型对象的指针，表示场景
        int bounces // 整数类型，表示递归的反射次数
    )
    {
        // 创建了一个包含 SHCoeffLength 个元素的 vector 对象，并将其初始化为全零
        // coeffs 是一个指向 unique_ptr<vector<double>> 类型对象的指针
        unique_ptr<vector<double>> coeffs(new vector<double>());
        coeffs->assign(SHCoeffLength, 0.0);

        if (bounces > m_Bounce) {
            return coeffs;
        }
        // sample_side: 样本点的边长，即 sample_count 的平方根
        const int sample_side = static_cast<int>(floor(sqrt(m_SampleCount)));
        random_device rd;
        mt19937 gen(rd());
        uniform_real_distribution<> rng(0.0, 1.0);
        // 函数使用嵌套的循环来对采样点进行遍历，计算球坐标系中的角度 phi 和 theta
        // 遍历方式？奇怪
        for (int t = 0; t < sample_side; t++) {
            for (int p = 0; p < sample_side; p++) {
                double alpha = (t + rng(gen)) / sample_side;
                double beta = (p + rng(gen)) / sample_side;
                double phi = 2.0 * M_PI * beta;
                double theta = acos(2.0 * alpha - 1.0);

                Eigen::Array3d d = sh::ToVector(phi, theta);
                // 然后，根据 phi 和 theta 计算出对应的方向向量 wi
                const auto wi = Vector3f(d.x(), d.y(), d.z());

                // 计算 wi 与法线向量 normal 的半程向量 H
                double H = wi.normalized().dot(normal);
                Intersection its;

                const auto ray = Ray3f(pos, wi.normalized());
                // 如果 H 大于零，表示光线与表面相交且入射方向合理，进一步进行处理
                // 函数调用场景中的 rayIntersect 方法，使用从点 pos 沿着方向 wi 的光线与场景进行相交测试，获得相交点的信息。
                if (H > 0.0 && scene->rayIntersect(ray, its)) {

                    // 如果相交点存在，函数从相交点信息中获取顶点法线
                    MatrixXf normals = its.mesh->getVertexNormals();
                    // idx 是一个 Point3f 类型的对象，表示离交点最近的三个顶点的索引
                    Point3f idx = its.tri_index; // 当前交点三个三角形的序号
                    Point3f hitPos = its.p; // 点坐标的
                    Vector3f bary = its.bary; // 重心坐标

                    // 并根据顶点的索引和重心坐标进行线性插值，得到相交点处的法线 hitNormal
                    // 通过将每个顶点的法线向量乘以对应的重心坐标，并将结果相加，可以得到一个与三个顶点法线向量加权后的插值法线向量
                    // 这里使用的是加权平均的方式进行插值
                    auto interpolateNormalX = normals.col(idx.x()).normalized() * bary.x();
                    auto interpolateNormalY = normals.col(idx.y()).normalized() * bary.y();
                    auto interpolateNormalZ = normals.col(idx.z()).normalized() * bary.z();
                    Normal3f hitNormal = Normal3f(interpolateNormalX + interpolateNormalY + interpolateNormalZ).normalized();

                    // 递归调用
                    auto nextBouncesCoeffs = computeInterreflectionSH(
                        directTSHCoeffs, hitPos, hitNormal, scene, bounces + 1);

                    for (int i = 0; i < SHCoeffLength; i++) {
                        // 球谐系数也要经过重心坐标插值
                        auto interpolateSHX = directTSHCoeffs->col(idx.x()).coeffRef(i) * bary.x();
                        auto interpolateSHY = directTSHCoeffs->col(idx.y()).coeffRef(i) * bary.y();
                        auto interpolateSHZ = directTSHCoeffs->col(idx.z()).coeffRef(i) * bary.z();
                        auto interpolateSH = (interpolateSHX + interpolateSHY + interpolateSHZ);

                        // *coeffs 是解引用操作符，用于获取指针指向的对象
                        (*coeffs)[i] += (interpolateSH + (*nextBouncesCoeffs)[i]) * H;
                    }
                }
            }
        }

        for (unsigned int i = 0; i < coeffs->size(); i++) {
            (*coeffs)[i] /= sample_side * sample_side;
        }

        return coeffs;
    }

    virtual void preprocess(const Scene* scene) override
    {

        // Here only compute one mesh
        // auto 用于自动推导变量的类型。通过使用
        // auto，编译器可以根据变量的初始化表达式自动推断出变量的类型
        const auto mesh = scene->getMeshes()[0];
        // Projection environment
        auto cubePath = getFileResolver()->resolve(m_CubemapPath);

        auto lightPath = cubePath / "light.txt";
        auto transPath = cubePath / "transport.txt";
        ofstream lightFout(lightPath.str());
        ofstream fout(transPath.str());

        int width, height, channel;

        vector<unique_ptr<float[]>> images = ProjEnv::LoadCubemapImages(cubePath.str(), width, height, channel);
        auto envCoeffs = ProjEnv::PrecomputeCubemapSH<SHOrder>(images, width, height, channel);
        m_LightCoeffs.resize(3, SHCoeffLength);
        // 光照球谐系数写入文件
        for (int i = 0; i < envCoeffs.size(); i++) {
            lightFout << (envCoeffs)[i].x() << " " << (envCoeffs)[i].y() << " " << (envCoeffs)[i].z() << endl;
            m_LightCoeffs.col(i) = (envCoeffs)[i];
        }
        cout << "Computed light sh coeffs from: " << cubePath.str() << " to: " << lightPath.str() << endl;

        // Projection transport
        m_TransportSHCoeffs.resize(SHCoeffLength, mesh->getVertexCount());
        fout << mesh->getVertexCount() << endl;
        for (int i = 0; i < mesh->getVertexCount(); i++) {
            // 当前顶点位置
            const Point3f& vertexPosition = mesh->getVertexPositions().col(i);

            // 当前顶点法向量
            const Normal3f& n = mesh->getVertexNormals().col(i);

            // 球面函数
            auto shFunc = [&](double phi, double theta) -> double {
                Eigen::Array3d d = sh::ToVector(phi, theta);
                // 入射单位角
                const auto wi = Vector3f(d.x(), d.y(), d.z());
                // 半程向量
                double H = wi.normalized().dot(n.normalized());
                if (m_Type == Type::Unshadowed) {
                    // TODO: here you need to calculate unshadowed transport term of a given direction
                    // TODO: 此处你需要计算给定方向下的unshadowed传输项球谐函数值
                    return (H > 0.0) ? H : 0.0;
                } else {
                    // TODO: here you need to calculate shadowed transport term of a given direction
                    // TODO: 此处你需要计算给定方向下的shadowed传输项球谐函数值
                    const auto ray = Ray3f(vertexPosition, wi.normalized());
                    if (H > 0.0 && !scene->rayIntersect(ray)) {
                        return H;
                    }
                    return 0.0;
                }
            };

            auto shCoeff = sh::ProjectFunction(SHOrder, shFunc, m_SampleCount);
            for (int j = 0; j < shCoeff->size(); j++) {
                m_TransportSHCoeffs.col(i).coeffRef(j) = (*shCoeff)[j] / M_PI;
                // m_TransportSHCoeffs.col(i).coeffRef(j) = (*shCoeff)[j];
            }
        }
        if (m_Type == Type::Interreflection) {
            // TODO: leave for bonus
            for (int i = 0; i < mesh->getVertexCount(); i++) {
                const Point3f& v = mesh->getVertexPositions().col(i);
                const Normal3f& n = mesh->getVertexNormals().col(i).normalized();
                auto indirectCoeffs = computeInterreflectionSH(&m_TransportSHCoeffs, v, n, scene, 1);
                for (int j = 0; j < SHCoeffLength; j++) {
                    m_TransportSHCoeffs.col(i).coeffRef(j) += (*indirectCoeffs)[j];
                }
                cout
                    << "computing interreflection light sh coeffs, current vertex idx: "
                    << i << " total vertex idx: " << mesh->getVertexCount()
                    << endl;
            }
        }

        // Save in face format
        for (int f = 0; f < mesh->getTriangleCount(); f++) {
            const MatrixXu& F = mesh->getIndices();
            uint32_t idx0 = F(0, f), idx1 = F(1, f), idx2 = F(2, f);
            for (int j = 0; j < SHCoeffLength; j++) {
                fout << m_TransportSHCoeffs.col(idx0).coeff(j) << " ";
            }
            fout << endl;
            for (int j = 0; j < SHCoeffLength; j++) {
                fout << m_TransportSHCoeffs.col(idx1).coeff(j) << " ";
            }
            fout << endl;
            for (int j = 0; j < SHCoeffLength; j++) {
                fout << m_TransportSHCoeffs.col(idx2).coeff(j) << " ";
            }
            fout << endl;
        }
        cout << "Computed SH coeffs"
             << " to: " << transPath.str() << endl;
    }

    Color3f Li(const Scene* scene, Sampler* sampler, const Ray3f& ray) const
    {
        Intersection its;
        if (!scene->rayIntersect(ray, its))
            return Color3f(0.0f);

        const Eigen::Matrix<Vector3f::Scalar, SHCoeffLength, 1> sh0 = m_TransportSHCoeffs.col(its.tri_index.x()),
                                                                sh1 = m_TransportSHCoeffs.col(its.tri_index.y()),
                                                                sh2 = m_TransportSHCoeffs.col(its.tri_index.z());
        const Eigen::Matrix<Vector3f::Scalar, SHCoeffLength, 1> rL = m_LightCoeffs.row(0), gL = m_LightCoeffs.row(1), bL = m_LightCoeffs.row(2);

        Color3f c0 = Color3f(rL.dot(sh0), gL.dot(sh0), bL.dot(sh0)),
                c1 = Color3f(rL.dot(sh1), gL.dot(sh1), bL.dot(sh1)),
                c2 = Color3f(rL.dot(sh2), gL.dot(sh2), bL.dot(sh2));

        const Vector3f& bary = its.bary;
        Color3f c = bary.x() * c0 + bary.y() * c1 + bary.z() * c2;
        // TODO: you need to delete the following four line codes after finishing your calculation to SH,
        //       we use it to visualize the normals of model for debug.
        // TODO: 在完成了球谐系数计算后，你需要删除下列四行，这四行代码的作用是用来可视化模型法线
        // if (c.isZero()) {
        //     auto n_ = its.shFrame.n.cwiseAbs();
        //     return Color3f(n_.x(), n_.y(), n_.z());
        // }
        return c;
    }

    string toString() const
    {
        return "PRTIntegrator[]";
    }

private:
    Type m_Type;
    int m_Bounce = 1;
    int m_SampleCount = 100;
    string m_CubemapPath;
    Eigen::MatrixXf m_TransportSHCoeffs;
    Eigen::MatrixXf m_LightCoeffs;
};

NORI_REGISTER_CLASS(PRTIntegrator, "prt");
NORI_NAMESPACE_END