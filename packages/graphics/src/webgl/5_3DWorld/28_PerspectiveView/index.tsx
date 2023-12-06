import { Mat4 } from "cuon-matrix-ts";
import Canvas from "../../../canvas";
import { WebGLRenderingContextExtend } from "../../../canvas/interface";
import { initShaders } from "../../../lib/cuon-utils";

import FSHADER_SOURCE from "./test.frag";
import VSHADER_SOURCE from "./test.vert";

function PerspectiveView() {
    //设置顶点的纹理坐标
    const initVertexBuffers = (gl: WebGLRenderingContextExtend) => {
        // 顶点坐标和纹理坐标交叉存储在一个数组中
        // prettier-ignore
        const verticesColors = new Float32Array(
            [
                // Three triangles on the right side
            0.0,  1.0,   0.0,  0.4,  0.4,  1.0,  // The front blue one
            -0.5, -1.0,   0.0,  0.4,  0.4,  1.0,
            0.5, -1.0,   0.0,  1.0,  0.4,  0.4,

            0.0,  1.0,  -2.0,  1.0,  1.0,  0.4, // The middle yellow one
            -0.5, -1.0,  -2.0,  1.0,  1.0,  0.4,
            0.5, -1.0,  -2.0,  1.0,  0.4,  0.4,

            0.0,  1.0,  -4.0,  0.4,  1.0,  0.4, // The back green one
            -0.5, -1.0,  -4.0,  0.4,  1.0,  0.4,
            0.5, -1.0,  -4.0,  1.0,  0.4,  0.4,
            ]);
        const n = 18; //点的个数

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

    const draw = (gl: WebGLRenderingContextExtend) => {
        const canvas = document.getElementById("webgl") as HTMLCanvasElement;
        if (!canvas) {
            console.log("Failed to retrieve the <canvas> element");
            return;
        }
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

        //开启隐藏面消除
        gl.enable(gl.DEPTH_TEST);

        //模型矩阵------------------------------
        const u_ModelMatrix = gl.getUniformLocation(gl.program as WebGLProgram, "u_ModelMatrix");
        const modelMatrix = new Mat4();
        modelMatrix.setTranslate(0.75, 0, 0); //平移0.75单位
        gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
        //---------------------------------------

        //视图矩阵------------------------------
        const u_ViewMatrix = gl.getUniformLocation(gl.program as WebGLProgram, "u_ViewMatrix");
        //设置视点、视线、上方向
        const viewMatrix = new Mat4();
        viewMatrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0);
        gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
        //---------------------------------------

        //投影矩阵--------------------------
        const u_ProjMatrix = gl.getUniformLocation(gl.program as WebGLProgram, "u_ProjMatrix");
        const projMatrix = new Mat4();
        projMatrix.setPerspective(30, canvas.width / canvas.height, 1, 100);
        gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
        //----------------------------------

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.drawArrays(gl.TRIANGLES, 0, n); //绘制右侧一组三角形

        modelMatrix.setTranslate(-0.75, 0, 0);
        gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
        gl.drawArrays(gl.TRIANGLES, 0, n); //绘制左侧一组三角形
    };

    return (
        <>
            <Canvas id="webgl" draw={draw} width={500} height={500} options={{ context: "webgl" }} />;
        </>
    );
}

export default PerspectiveView;
