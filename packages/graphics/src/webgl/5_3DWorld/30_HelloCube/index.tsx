import { Mat4 } from "cuon-matrix-ts";
import Canvas from "../../../canvas";
import { WebGLRenderingContextExtend } from "../../../canvas/interface";
import { initShaders } from "../../../../lib/cuon-utils";

import FSHADER_SOURCE from "./test.frag";
import VSHADER_SOURCE from "./test.vert";

function HelloCube() {
    //设置顶点的纹理坐标
    const initVertexBuffers = (gl: WebGLRenderingContextExtend) => {
        // 顶点坐标和纹理坐标交叉存储在一个数组中
        // Create a cube
        //    v6----- v5
        //   /|      /|
        //  v1------v0|
        //  | |     | |
        //  | |v7---|-|v4
        //  |/      |/
        //  v2------v3
        // prettier-ignore
        const verticesColors = new Float32Array(
            [
                // Vertex coordinates and color
                1.0,  1.0,  1.0,     1.0,  1.0,  1.0,  // v0 White
                -1.0,  1.0,  1.0,     1.0,  0.0,  1.0,  // v1 Magenta
                -1.0, -1.0,  1.0,     1.0,  0.0,  0.0,  // v2 Red
                1.0, -1.0,  1.0,     1.0,  1.0,  0.0,  // v3 Yellow
                1.0, -1.0, -1.0,     0.0,  1.0,  0.0,  // v4 Green
                1.0,  1.0, -1.0,     0.0,  1.0,  1.0,  // v5 Cyan
                -1.0,  1.0, -1.0,     0.0,  0.0,  1.0,  // v6 Blue
                -1.0, -1.0, -1.0,     0.0,  0.0,  0.0   // v7 Black
            ]);

        // 顶点索引
        // 通过索引来访问顶点数据，从而循环利用顶点信息，控制内存开销
        // 但是使用索引也会很麻烦
        // prettier-ignore
        const indices = new Uint8Array([  //(Uint8Array)是无符号8位整型数
            0, 1, 2,   0, 2, 3,    // front
            0, 3, 4,   0, 4, 5,    // right
            0, 5, 6,   0, 6, 1,    // up
            1, 6, 7,   1, 7, 2,    // left
            7, 4, 3,   7, 3, 2,    // down
            4, 7, 6,   4, 6, 5     // back
        ]);

        //
        // ----------------------- position and size buffer ------------------------------
        // 创建缓冲区对象
        const verteColorBuffer = gl.createBuffer();
        const indexBuffer = gl.createBuffer();
        if (!verteColorBuffer || !indexBuffer) {
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

        // 将顶点索引数据写入缓冲区对象
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

        return indices.length;
    };

    const draw = (gl: WebGLRenderingContextExtend) => {
        const canvas = document.getElementById("webgl") as HTMLCanvasElement;
        if (!canvas) {
            console.log("Failed to retrieve the <canvas> element");
            return;
        }
        // Get the rendering context for WebGL
        // const gl = getWebGLContext(canvas);
        if (!gl) {
            console.log("Failed to get the rendering context for WebGL");
            return;
        }

        // Initialize shaders
        if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
            console.log("Failed to intialize shaders.");
            return;
        }

        // Set the vertex coordinates and color (the blue triangle is in the front)
        const n = initVertexBuffers(gl);
        if (n < 0) {
            console.log("Failed to set the vertex information");
            return;
        }

        //Set clear color and enable the hidden surface removal function
        gl.clearColor(0, 0, 0, 1);
        gl.enable(gl.DEPTH_TEST);

        //模型视图投影矩阵
        const u_MvpMatrix = gl.getUniformLocation(gl.program as WebGLProgram, "u_MvpMatrix");
        const mvpMatrix = new Mat4();
        mvpMatrix.setPerspective(30, 1, 1, 100);
        mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);
        gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
    };

    return <Canvas id="webgl" draw={draw} width={500} height={500} options={{ context: "webgl" }} />;
}

export default HelloCube;
