import { Mat4 } from "cuon-matrix-ts";
import Canvas from "../../../canvas";
import { WebGLRenderingContextExtend } from "../../../canvas/interface";
import { initShaders } from "../../../lib/cuon-utils";

import FSHADER_SOURCE from "./test.frag";
import VSHADER_SOURCE from "./test.vert";

function OrthoView() {
    //设置顶点的纹理坐标
    const initVertexBuffers = (gl: WebGLRenderingContextExtend) => {
        // 顶点坐标和纹理坐标交叉存储在一个数组中
        // prettier-ignore
        const verticesColors = new Float32Array(
            [
                0.0,  0.5,  -0.4,  0.4,  1.0,  0.4, // The back green one
                -0.5, -0.5,  -0.4,  0.4,  1.0,  0.4,
                0.5, -0.5,  -0.4,  1.0,  0.4,  0.4,

                0.5,  0.4,  -0.2,  1.0,  0.4,  0.4, // The middle yellow one
                -0.5,  0.4,  -0.2,  1.0,  1.0,  0.4,
                0.0, -0.6,  -0.2,  1.0,  1.0,  0.4,

                0.0,  0.5,   0.0,  0.4,  0.4,  1.0,  // The front blue one
                -0.5, -0.5,   0.0,  0.4,  0.4,  1.0,
                0.5, -0.5,   0.0,  1.0,  0.4,  0.4
            ]
        );
        // 点的个数
        const n = 9;

        //
        // ----------------------- position and size buffer ------------------------------
        // 创建缓冲区对象
        const verteColorBuffer = gl.createBuffer();
        if (!verteColorBuffer) {
            console.log("Failed to create thie buffer object");
            return -1;
        }

        // 将缓冲区对象保存到目标上
        // 目标表示缓冲区对象的用途
        gl.bindBuffer(gl.ARRAY_BUFFER, verteColorBuffer);

        // 向缓冲区对象写入数据
        // 第二个参数是数据：类型化的数组
        // 第三个参数是用途：表示程序将如何使用存储在缓冲区对象中的数据，
        //      当前是写入一次，绘制很多次
        gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

        const FSIZE = verticesColors.BYTES_PER_ELEMENT;

        // ----------------------- position data ------------------------------
        const a_Position = gl.getAttribLocation(gl.program as WebGLProgram, "a_Position");
        if (a_Position < 0) {
            console.log("Failed to get the storage location of a_Position");
            return -1;
        }
        // 将缓冲区对象的引用分配给一个attribute变量
        // 参数五 步幅stride: 相邻两个顶点间的字节数
        // 参数六 偏移offset: 偏移量，从哪开始算，加上第二个参数size，就是整个数据区间
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);

        // 激活（开启）分配给a_Position变量的缓冲区对象
        gl.enableVertexAttribArray(a_Position);

        // ----------------------- color data ------------------------------
        const a_Color = gl.getAttribLocation(gl.program as WebGLProgram, "a_Color");
        if (a_Color < 0) {
            console.log("Failed to get the storage location of a_Position");
            return -1;
        }

        gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
        gl.enableVertexAttribArray(a_Color);

        gl.bindBuffer(gl.ARRAY_BUFFER, null); //取消绑定的缓冲区对象

        return n;
    };

    const reDraw = (
        gl: WebGLRenderingContextExtend,
        n: number,
        u_ProjMatrix: WebGLUniformLocation,
        projMatrix: Mat4,
        nf: HTMLElement
    ) => {
        //设置视点和视线
        projMatrix.setOrtho(-1, 1, -1, 1, g_near, g_far);

        //将视图矩阵传递给u_ViewMatrix变量
        gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

        gl.clear(gl.COLOR_BUFFER_BIT);

        //innerHTML在JS是双向功能：获取对象的内容  或  向对象插入内容；
        nf.innerHTML = "near: " + Math.round(g_near * 100) / 100 + ", far: " + Math.round(g_far * 100) / 100;

        gl.drawArrays(gl.TRIANGLES, 0, n);
    };

    let g_near = 0.0;
    let g_far = 0.5;
    const keydown = (
        ev: KeyboardEvent,
        gl: WebGLRenderingContextExtend,
        n: number,
        u_ProjMatrix: WebGLUniformLocation,
        viewMatrix: Mat4,
        nf: HTMLElement
    ) => {
        console.log(ev);
        switch (ev.keyCode) {
            case 39:
                g_near += 0.01;
                break; //right
            case 37:
                g_near -= 0.01;
                break; //left
            case 38:
                g_far += 0.01;
                break; //up
            case 40:
                g_far -= 0.01;
                break; //down
            default:
                return;
        }
        reDraw(gl, n, u_ProjMatrix, viewMatrix, nf);
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
        const nf = document.getElementById("nearFar");
        if (!nf) {
            return;
        }

        const u_ProjMatrix = gl.getUniformLocation(gl.program as WebGLProgram, "u_ProjMatrix");
        if (!u_ProjMatrix) {
            return;
        }

        const projMatrix = new Mat4();

        //注册键盘事件响应函数
        document.onkeydown = function (ev) {
            keydown(ev, gl, n, u_ProjMatrix, projMatrix, nf);
        };

        // 首次绘制
        reDraw(gl, n, u_ProjMatrix, projMatrix, nf);
    };

    return (
        <>
            <p id="nearFar"> The near and far values are displayed here. </p>
            <Canvas draw={draw} width={500} height={500} options={{ context: "webgl" }} />;
        </>
    );
}

export default OrthoView;
