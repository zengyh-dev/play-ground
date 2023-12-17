import Canvas from "../../../canvas";
import { WebGLRenderingContextExtend } from "../../../canvas/interface";
import { initShaders } from "../../../../lib/cuon-utils";

import FSHADER_SOURCE from "./multi.frag";
import VSHADER_SOURCE from "./multi.vert";

import sky from "../../resources/sky.jpg";
import circle from "../../resources/circle.gif";

function MultiTexture() {
    //设置顶点的纹理坐标
    const initVertexBuffers = (gl: WebGLRenderingContextExtend) => {
        // 顶点坐标和纹理坐标交叉存储在一个数组中
        // prettier-ignore
        const verticesTexCoords = new Float32Array(
            [
                -0.5, 0.5, 0.0, 1.0,
                -0.5, -0.5, 0.0, 0.0,
                0.5, 0.5, 1.0, 1.0,
                0.5, -0.5, 1.0, 0.0,
            ]
        );
        // 点的个数
        const n = 4;

        //
        // ----------------------- position and size buffer ------------------------------
        // 创建缓冲区对象
        const vertexTexCoordBuffer = gl.createBuffer();
        if (!vertexTexCoordBuffer) {
            console.log("Failed to create thie buffer object");
            return -1;
        }

        // 将缓冲区对象保存到目标上
        // 目标表示缓冲区对象的用途
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);

        // 向缓冲区对象写入数据
        // 第二个参数是数据：类型化的数组
        // 第三个参数是用途：表示程序将如何使用存储在缓冲区对象中的数据，
        //      当前是写入一次，绘制很多次
        gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

        const FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;

        // ----------------------- position data ------------------------------
        const a_Position = gl.getAttribLocation(gl.program as WebGLProgram, "a_Position");
        if (a_Position < 0) {
            console.log("Failed to get the storage location of a_Position");
            return -1;
        }
        // 将缓冲区对象的引用分配给一个attribute变量
        // 参数五 步幅stride: 相邻两个顶点间的字节数
        // 参数六 偏移offset: 偏移量，从哪开始算，加上第二个参数size，就是整个数据区间
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);

        // 激活（开启）分配给a_Position变量的缓冲区对象
        gl.enableVertexAttribArray(a_Position);

        // ----------------------- coord data ------------------------------

        //将纹理坐标分配给a_TexCoord并开启它
        const a_TexCoord = gl.getAttribLocation(gl.program as WebGLProgram, "a_TexCoord");
        if (a_TexCoord < 0) {
            console.log("Failed to get the storage location of a_TexCoord");
            return -1;
        }

        gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
        gl.enableVertexAttribArray(a_TexCoord);

        return n;
    };

    //标记纹理单元是否已经就绪
    let g_texUnit0 = false;
    let g_texUnit1 = false;

    // 监听纹理图像的加载事件，一旦加载完成，就在webgl中使用纹理
    const loadTexture = (
        gl: WebGLRenderingContextExtend,
        n: number,
        texture: WebGLTexture | null,
        u_Sampler: WebGLUniformLocation | null,
        image: HTMLImageElement,
        texUnit: number
    ) => {
        // 1. 对纹理图像进行y轴反转
        // webgl纹理系统的t轴的方向和各种png，jpg格式图片的坐标系统的Y轴方向是相反的
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

        if (texUnit == 0) {
            // 2. 开启0号纹理单元
            gl.activeTexture(gl.TEXTURE0);
            g_texUnit0 = true;
        } else {
            gl.activeTexture(gl.TEXTURE1);
            g_texUnit1 = true;
        }

        // 3. 向target绑定纹理对象，告诉webgl系统纹理对象使用的是哪种类型的纹理
        // 当前是二维纹理
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // 4. 配置纹理参数
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);

        // 5. 配置纹理图像
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

        // 6. 将0号纹理传递给着色器
        gl.uniform1i(u_Sampler, texUnit);

        gl.clear(gl.COLOR_BUFFER_BIT);

        // 两个纹理都开启再绘制，提高性能
        if (g_texUnit0 && g_texUnit1) {
            // 7. 绘制矩形
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
        }
    };

    // 准备待加载的纹理图像，令浏览器读取它
    const initTextures = (gl: WebGLRenderingContextExtend, n: number) => {
        // 1. 创建纹理对象
        const texture0 = gl.createTexture();
        const texture1 = gl.createTexture();

        // 2. 获取u_Sampler的存储位置
        // 这个是2D取样器，取样器不是直接获取纹理图像，而是通过附近若干个像素共同计算出来的
        const u_Sampler0 = gl.getUniformLocation(gl.program as WebGLProgram, "u_Sampler0");
        const u_Sampler1 = gl.getUniformLocation(gl.program as WebGLProgram, "u_Sampler1");

        // 3. 创建一个image对象
        const image0 = new Image();
        const image1 = new Image();

        // 5. 注册图像加载时间的响应函数
        image0.onload = function () {
            loadTexture(gl, n, texture0, u_Sampler0, image0, 0);
        };
        image1.onload = function () {
            loadTexture(gl, n, texture1, u_Sampler1, image1, 1);
        };

        // 4. 添加src属性，告诉浏览器开始加载图像
        image0.src = sky;
        image1.src = circle;

        return true;
    };
    const draw = (gl: WebGLRenderingContextExtend) => {
        if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
            console.log("Failed to intialize shaders.");
            return;
        }

        // 将顶点的位置写入顶点着色器
        const n = initVertexBuffers(gl);
        if (n < 0) {
            console.log("Failed to set the positions of the vertices");
            return;
        }

        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        // 清空颜色缓冲区，基于多基本缓冲区模型
        gl.clear(gl.COLOR_BUFFER_BIT);

        // 加载纹理
        if (!initTextures(gl, n)) {
            console.log("Failed to intialize the texture.");
            return;
        }
    };

    return <Canvas draw={draw} width={500} height={500} options={{ context: "webgl" }} />;
}

export default MultiTexture;
