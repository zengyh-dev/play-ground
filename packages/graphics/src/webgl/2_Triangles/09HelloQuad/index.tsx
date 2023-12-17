import Canvas from "../../../canvas";
import { WebGLRenderingContextExtend } from "../../../canvas/interface";
import { initShaders } from "../../../../lib/cuon-utils";

import FSHADER_SOURCE from "./point.frag";
import VSHADER_SOURCE from "./point.vert";

function HelloQuad() {
    const initVertexBuffers = (gl: WebGLRenderingContextExtend) => {
        // -------------------创建和写入缓冲区------------------------
        // 通过new来创建类型化数组
        const vertices = new Float32Array([-0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, -0.5]);

        // 点的个数
        const n = 4;

        // 1. 创建缓冲区对象
        const vertexBuffer = gl.createBuffer();
        if (!vertexBuffer) {
            console.log("Failed to create thie buffer object");
            return -1;
        }

        // 2. 将缓冲区对象保存到目标上 （目标表示缓冲区对象的用途）
        // ARRAY_BUFFER：表示缓冲区对象包含了顶点的数据
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

        // 3. 向缓冲区对象写入数据
        // 参数一 目标：写入绑定在gl.ARRAY_BUFFER上的缓冲区对象
        // 参数二 数据：类型化的数组
        // 参数三 用途：表示程序将如何使用存储在缓冲区对象中的数据
        //      当前是写入一次，可以绘制很多次
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        // -------------------使用缓冲区进行绘图------------------------
        const a_Position = gl.getAttribLocation(gl.program as WebGLProgram, "a_Position");
        if (a_Position < 0) {
            console.log("Failed to get the storage location of a_Position");
            return -1;
        }
        // 4. 将缓冲区对象的引用分配给一个attribute变量
        // 参数一 位置： attribute变量的存储位置
        // 参数二 大小： 缓冲区每个顶点的分量个数，不够会补全（这里就补了两位）
        // 参数三 类型： 数据类型
        // 参数四 归一： 是否将非浮点的数据归一化到[0, 1]或[-1, 1]区间
        // 参数五 间隔： 两个顶点间的字节数，默认0字节
        // 参数六 偏移： 缓冲区对象的偏移量，默认0字节
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

        // 5. 激活（开启）分配给a_Position变量的缓冲区对象
        gl.enableVertexAttribArray(a_Position);

        return n;
    };

    const draw = (gl: WebGLRenderingContextExtend) => {
        if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
            console.log("Failed to intialize shaders.");
            return;
        }

        // 创建顶点缓冲区对象，将多个顶点的数据保存在缓冲区，最后将缓冲区传给顶点着色器
        const n = initVertexBuffers(gl);
        if (n < 0) {
            console.log("Failed to set the positions of the vertices");
            return;
        }

        // Set clear color
        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        // 清空颜色缓冲区，基于多基本缓冲区模型
        gl.clear(gl.COLOR_BUFFER_BIT);

        // 注意最后一个参数是n，顶点着色器会执行n次
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    };

    return <Canvas draw={draw} width={500} height={500} options={{ context: "webgl" }} />;
}

export default HelloQuad;
