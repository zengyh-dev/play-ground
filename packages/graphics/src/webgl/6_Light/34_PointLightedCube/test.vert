attribute vec4 a_Position;
attribute vec4 a_Color; //表面基底色
attribute vec4 a_Normal; // 法向量
uniform mat4 u_MvpMatrix;
uniform mat4 u_ModelMatrix;  // 模拟矩阵
uniform mat4 u_NormalMatrix; // 用来变换法向量的矩阵
uniform vec3 u_LightColor; // 光线颜色
uniform vec3 u_LightPosition; // 光源位置（世界坐标系）
uniform vec3 u_AmbientLight; // 环境光颜色
varying vec4 v_Color;
void main() {
    gl_Position = u_MvpMatrix * a_Position;
    // 对法向量进行归一化
    vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));

    // 计算顶点的世界坐标
    vec4 vertexPosition = u_ModelMatrix * a_Position;

    // 计算光线方向并归一化
    vec3 lightDirection = normalize(u_LightPosition - vec3(vertexPosition));

    // 计算光线方向和法向量的点积，得到夹角余弦值
    float nDotL = max(dot(lightDirection, normal), 0.0);

    // 计算漫反射光的颜色
    vec3 diffuse = u_LightColor * vec3(a_Color) * nDotL;

    // 环境光
    vec3 ambient = u_AmbientLight * vec3(a_Color);

    // 总结计算颜色就是 漫反射光颜色 = 入射光颜色 × 表面基底颜色 × （光线方向 ·法线方向）

    v_Color = vec4(diffuse + ambient, a_Color.a);
}