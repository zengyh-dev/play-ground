import Canvas from "../../canvas";
import { initShaders } from "../../../lib/cuon-utils";
import FSHADER_SOURCE from "./fShader.frag";
import VSHADER_SOURCE from "./vShader.vert";

function HelloPoint() {
    const draw = (ctx: RenderingContext) => {
        // 绘制上下文
        const gl = ctx as WebGLRenderingContext;
        console.log(gl);

        // Initialize shaders
        if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
            console.log("Failed to intialize shaders.");
            return;
        }

        // Set clear color
        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        // Clear <canvas>
        // 清空颜色缓冲区，基于多基本缓冲区模型
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Draw a point
        gl.drawArrays(gl.POINTS, 0, 1);
    };

    return <Canvas draw={draw} width={500} height={500} options={{ context: "webgl" }} />;
}

export default HelloPoint;
