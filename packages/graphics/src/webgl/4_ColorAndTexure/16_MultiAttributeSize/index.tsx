import Canvas from "../../../canvas";
import { WebGLRenderingContextExtend } from "../../../canvas/interface";
import { initShaders } from "../../../../lib/cuon-utils";

import FSHADER_SOURCE from "./multi.frag";
import VSHADER_SOURCE from "./multi.vert";

function MultiAttributeSize() {
    const initVertexBuffers = (gl: WebGLRenderingContextExtend) => {
        const vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);

        // 点的个数
        const n = 3;

        // 通过为顶点的每种数据建立缓冲区，分配给对应的attribute变量
        // ----------------------- position ------------------------------
        // 创建缓冲区对象
        const vertexBuffer = gl.createBuffer();
        if (!vertexBuffer) {
            console.log("Failed to create thie buffer object");
            return -1;
        }

        // 将缓冲区对象保存到目标上
        // 目标表示缓冲区对象的用途
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

        // 向缓冲区对象写入数据
        // 第二个参数是数据：类型化的数组
        // 第三个参数是用途：表示程序将如何使用存储在缓冲区对象中的数据，
        //      当前是吸入一次，绘制很多次
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const a_Position = gl.getAttribLocation(gl.program as WebGLProgram, "a_Position");
        if (a_Position < 0) {
            console.log("Failed to get the storage location of a_Position");
            return -1;
        }
        // 将缓冲区对象的引用分配给一个attribute变量
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

        // 激活（开启）分配给a_Position变量的缓冲区对象
        gl.enableVertexAttribArray(a_Position);

        // ----------------------- size ------------------------------
        const sizes = new Float32Array([10.0, 20.0, 30.0]);

        const sizeBuffer = gl.createBuffer();
        if (!sizeBuffer) {
            console.log("Failed to create thie buffer object");
            return -1;
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);

        const a_PointSize = gl.getAttribLocation(gl.program as WebGLProgram, "a_PointSize");
        if (a_Position < 0) {
            console.log("Failed to get the storage location of a_Position");
            return -1;
        }

        gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_PointSize);

        return n;
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

        // Set clear color
        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        // 清空颜色缓冲区，基于多基本缓冲区模型
        gl.clear(gl.COLOR_BUFFER_BIT);

        // 注意最后一个参数是n
        gl.drawArrays(gl.POINTS, 0, n);
    };

    return <Canvas draw={draw} width={500} height={500} options={{ context: "webgl" }} />;
}

export default MultiAttributeSize;
