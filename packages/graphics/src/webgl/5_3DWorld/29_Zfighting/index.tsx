import { Mat4 } from "cuon-matrix-ts";
import Canvas from "../../../canvas";
import { WebGLRenderingContextExtend } from "../../../canvas/interface";
import { initShaders } from "../../../../lib/cuon-utils";

import FSHADER_SOURCE from "./test.frag";
import VSHADER_SOURCE from "./test.vert";

function Zfighting() {
    //设置顶点的纹理坐标
    const initVertexBuffers = (gl: WebGLRenderingContextExtend) => {
        // 顶点坐标和纹理坐标交叉存储在一个数组中
        // prettier-ignore
        const verticesColors = new Float32Array(
            [
                // Three triangles on the right side
                0.0,  2.5,  -5.0,  0.4,  1.0,  0.4, // The green triangle
    -2.5, -2.5,  -5.0,  0.4,  1.0,  0.4,
     2.5, -2.5,  -5.0,  1.0,  0.4,  0.4, 

     0.0,  3.0,  -5.0,  1.0,  0.4,  0.4, // The yellow triagle
    -3.0, -3.0,  -5.0,  1.0,  1.0,  0.4,
     3.0, -3.0,  -5.0,  1.0,  1.0,  0.4, 
            ]);
        const n = 6; //点的个数

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

        return n;
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

        // Get the storage locations of u_ViewProjMatrix
        const u_ViewProjMatrix = gl.getUniformLocation(gl.program as WebGLProgram, "u_ViewProjMatrix");
        if (!u_ViewProjMatrix) {
            console.log("Failed to get the storage locations of u_ViewProjMatrix");
            return;
        }

        const viewProjMatrix = new Mat4();
        // Set the eye point, look-at point, and up vector.
        viewProjMatrix.setPerspective(30, canvas.width / canvas.height, 1, 100);
        viewProjMatrix.lookAt(3.06, 2.5, 10.0, 0, 0, -2, 0, 1, 0);

        // Pass the view projection matrix to u_ViewProjMatrix
        gl.uniformMatrix4fv(u_ViewProjMatrix, false, viewProjMatrix.elements);

        // Clear color and depth buffer
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Enable the polygon offset function
        gl.enable(gl.POLYGON_OFFSET_FILL);
        // Draw the triangles
        gl.drawArrays(gl.TRIANGLES, 0, n / 2); // The green triangle
        gl.polygonOffset(1.0, 1.0); // Set the polygon offset
        gl.drawArrays(gl.TRIANGLES, n / 2, n / 2); // The yellow triangle
    };

    return <Canvas id="webgl" draw={draw} width={500} height={500} options={{ context: "webgl" }} />;
}

export default Zfighting;
