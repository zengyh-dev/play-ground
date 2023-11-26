import Canvas from "../../canvas";
import { WebGLRenderingContextExtend } from "../../canvas/interface";
import { initShaders } from "../../lib/cuon-utils";
import FSHADER_SOURCE from "./fShader.frag";
import VSHADER_SOURCE from "./vShader.vert";

function HelloPoint2() {
    const draw = (ctx: WebGLRenderingContextExtend) => {
        // 绘制上下文
        const gl = ctx;

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

        // 顶点位置传输给attribute变量，会自动补全缺失的齐次坐标最后一个变量
        gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);
        gl.vertexAttrib1f(a_PointSize, 5.0);

        // Set clear color
        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        // 清空颜色缓冲区，基于多基本缓冲区模型
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Draw a point
        gl.drawArrays(gl.POINTS, 0, 1);
    };

    return <Canvas draw={draw} width={500} height={500} options={{ context: "webgl" }} />;
}

export default HelloPoint2;
