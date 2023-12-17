import { Mat4 } from "cuon-matrix-ts";
import Canvas from "../../../canvas";
import { WebGLRenderingContextExtend } from "../../../canvas/interface";
import { initShaders } from "../../../../lib/cuon-utils";

import FSHADER_SOURCE from "./test.frag";
import VSHADER_SOURCE from "./test.vert";

function LookAtTrianglesWithKeys_ViewVolume() {
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

    let g_eyeX = 0.2;
    const g_eyeY = 0.25;
    const g_eyeZ = 0.25; //视点
    const reDraw = (
        gl: WebGLRenderingContextExtend,
        n: number,
        u_ViewMatrix: WebGLUniformLocation,
        viewMatrix: Mat4
    ) => {
        //设置视点和视线
        viewMatrix.setLookAt(g_eyeX, g_eyeY, g_eyeZ, 0, 0, 0, 0, 1, 0);

        //将视图矩阵传递给u_ViewMatrix变量
        gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.drawArrays(gl.TRIANGLES, 0, n);
    };

    const keydown = (
        ev: KeyboardEvent,
        gl: WebGLRenderingContextExtend,
        n: number,
        u_ViewMatrix: WebGLUniformLocation,
        viewMatrix: Mat4
    ) => {
        console.log(ev);
        if (ev.key === "ArrowRight") {
            //按下右键
            g_eyeX += 0.1;
        } else if (ev.key === "ArrowLeft") {
            //按下左键
            g_eyeX -= 0.1;
        } else {
            return;
        }
        reDraw(gl, n, u_ViewMatrix, viewMatrix);
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

        const u_ViewMatrix = gl.getUniformLocation(gl.program as WebGLProgram, "u_ViewMatrix");
        if (!u_ViewMatrix) {
            return;
        }

        const viewMatrix = new Mat4();

        //注册键盘事件响应函数
        document.onkeydown = function (ev) {
            keydown(ev, gl, n, u_ViewMatrix, viewMatrix);
        };

        const u_ProjMatrix = gl.getUniformLocation(gl.program as WebGLProgram, "u_ProjMatrix");
        const projMatrix = new Mat4();
        projMatrix.setOrtho(-1.0, 1.0, -1.0, 1.0, 0.0, 2.0);
        //projMatrix.setOrtho(-0.5, 0.5, -0.5, 0.5, 0.0, 2.0);
        //projMatrix.setOrtho(-0.3, 0.3, -1.0, 1.0, 0.0, 2.0);
        gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

        // 首次绘制
        reDraw(gl, n, u_ViewMatrix, viewMatrix);
    };

    return <Canvas draw={draw} width={500} height={500} options={{ context: "webgl" }} />;
}

export default LookAtTrianglesWithKeys_ViewVolume;
