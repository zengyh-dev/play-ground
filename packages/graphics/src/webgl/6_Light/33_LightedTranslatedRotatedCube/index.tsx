import { Mat4, Vec3 } from "cuon-matrix-ts";
import Canvas from "../../../canvas";
import { WebGLRenderingContextExtend } from "../../../canvas/interface";
import { initShaders } from "../../../../lib/cuon-utils";

import FSHADER_SOURCE from "./test.frag";
import VSHADER_SOURCE from "./test.vert";

function LightedTranslatedRotatedCube() {
    const initArrayBuffer = (
        gl: WebGLRenderingContextExtend,
        data: Float32Array,
        num: number,
        type: number,
        attribute: string
    ) => {
        const buffer = gl.createBuffer(); // Create a buffer object
        if (!buffer) {
            console.log("Failed to create the buffer object");
            return false;
        }
        // Write date into the buffer object
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        // Assign the buffer object to the attribute variable
        const a_attribute = gl.getAttribLocation(gl.program as WebGLProgram, attribute);
        if (a_attribute < 0) {
            console.log("Failed to get the storage location of " + attribute);
            return false;
        }
        gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
        // Enable the assignment of the buffer object to the attribute variable
        gl.enableVertexAttribArray(a_attribute);

        return true;
    };

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

        // 这里是定义了8个面
        // prettier-ignore
        const vertices = new Float32Array([   // Vertex coordinates
            1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,   // v0-v1-v2-v3 front
            1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,   // v0-v3-v4-v5 right
            1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,   // v0-v5-v6-v1 up
            -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,  // v1-v6-v7-v2 left
            -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,  // v7-v4-v3-v2 down
            1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0    // v4-v7-v6-v5 back
        ]);

        // prettier-ignore
        const colors = new Float32Array([     // Colors
            1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v1-v2-v3 front
            1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v3-v4-v5 right
            1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v5-v6-v1 up
            1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v1-v6-v7-v2 left
            1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v7-v4-v3-v2 down
            1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0      // v4-v7-v6-v5 back
        ]);

        // prettier-ignore
        const normals = new Float32Array([    // Normal
            0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
            1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
            0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
            -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
            0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
            0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // v4-v7-v6-v5 back
        ]);

        // prettier-ignore
        const indices = new Uint8Array([       // Indices of the vertices
            0, 1, 2,   0, 2, 3,    // front
            4, 5, 6,   4, 6, 7,    // right
            8, 9,10,   8,10,11,    // up
            12,13,14,  12,14,15,   // left
            16,17,18,  16,18,19,   // down
            20,21,22,  20,22,23    // back
        ]);

        // Write the vertex coordinates and color to the buffer object
        if (!initArrayBuffer(gl, vertices, 3, gl.FLOAT, "a_Position")) return -1;

        if (!initArrayBuffer(gl, colors, 3, gl.FLOAT, "a_Color")) return -1;

        if (!initArrayBuffer(gl, normals, 3, gl.FLOAT, "a_Normal")) return -1;

        // Create a buffer object
        const indexBuffer = gl.createBuffer();
        if (!indexBuffer) return -1;

        // Write the indices to the buffer object
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

        const u_MvpMatrix = gl.getUniformLocation(gl.program as WebGLProgram, "u_MvpMatrix"); //模型视图投影矩阵
        const u_NormalMatrix = gl.getUniformLocation(gl.program as WebGLProgram, "u_NormalMatrix");
        const u_LightColor = gl.getUniformLocation(gl.program as WebGLProgram, "u_LightColor");
        const u_LightDirection = gl.getUniformLocation(gl.program as WebGLProgram, "u_LightDirection");
        const u_AmbientLight = gl.getUniformLocation(gl.program as WebGLProgram, "u_AmbientLight");
        if (!u_MvpMatrix || !u_NormalMatrix || !u_LightColor || !u_LightDirection) {
            console.log("Failed to get the storage location");
            return;
        }

        gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0); //设置光线颜色为白色
        gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2); //设置环境光颜色

        const lightDirection = new Vec3(0.5, 3.0, 4.0); //设置光线方向（世界坐标系下）
        lightDirection.normalize(); //归一化
        gl.uniform3fv(u_LightDirection, lightDirection.elements);

        const modelMatrix = new Mat4(); //模型矩阵
        const mvpMatrix = new Mat4(); //模型视图投影矩阵
        const normalMatrix = new Mat4(); //用来变换法向量的矩阵

        modelMatrix.setTranslate(0, 0.9, 0); //y轴平移
        modelMatrix.rotate(90, 0, 0, 1); //绕z轴旋转

        mvpMatrix.setPerspective(30, canvas.width / canvas.height, 1, 100);
        mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);
        mvpMatrix.multiply(modelMatrix);
        gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

        //根据模型矩阵计算用来变换法向量的矩阵
        normalMatrix.setInverseOf(modelMatrix); // 逆矩阵
        normalMatrix.transpose(); // 转置矩阵
        gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
    };

    return <Canvas id="webgl" draw={draw} width={500} height={500} options={{ context: "webgl" }} />;
}

export default LightedTranslatedRotatedCube;
