import React from "react";

import Canvas from "../../../canvas";
import { WebGLRenderingContextExtend } from "../../../canvas/interface";
import { initShaders } from "../../../lib/cuon-utils";
import { Color, Point } from "../../interface";

import FSHADER_SOURCE from "./point.frag";
import VSHADER_SOURCE from "./point.vert";

function MultiPoints() {

    const draw = (gl: WebGLRenderingContextExtend, canvas: HTMLCanvasElement) => {

        // Initialize shaders
        if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
            console.log("Failed to intialize shaders.");
            return;
        }

        console.log(gl);

        // Get the storage location of a_Position
        const a_Position = gl.getAttribLocation(gl.program as WebGLProgram, "a_Position");
        if (a_Position < 0) {
            console.log("Failed to get the storage location of a_Position");
            return;
        }

        const a_PointSize = gl.getAttribLocation(gl.program as WebGLProgram, "a_PointSize");
        const u_FragColor = gl.getUniformLocation(gl.program as WebGLProgram, "u_FragColor");
        console.log(u_FragColor);

        // 顶点位置传输给attribute变量，会自动补全缺失的齐次坐标最后一个变量
        gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);
        gl.vertexAttrib1f(a_PointSize, 5.0);

        // Set clear color
        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        // 清空颜色缓冲区，基于多基本缓冲区模型
        gl.clear(gl.COLOR_BUFFER_BIT);
    };

    const initVertexBuggers = (gl: WebGLRenderingContextExtend) => {
        const vertices = new Float32Array([
            0.0, 0.5, -0.5, 0.5, -0.5
        ]);

        // 点的个数
        const n = 3;

        // 创建缓冲区对象
        const vertexBuffer = gl.createBuffer();
        if (!vertexBuffer) {
            console.log("Failed to create thie buffer object");
            return -1;
        }

        // 将缓冲区对象保存到目标上
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

        // 向缓冲区对象写入数据
    };

    return <Canvas draw={draw} width={500} height={500} options={{ context: "webgl" }} />;
}

export default MultiPoints;
