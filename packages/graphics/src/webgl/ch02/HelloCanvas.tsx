import Canvas from "../../canvas";

function HelloCanvas() {
    const draw = (ctx: RenderingContext) => {
        // 绘制上下文
        const gl = ctx as WebGLRenderingContext;

        // Set clear color
        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        // Clear <canvas>
        // 清空颜色缓冲区，基于多基本缓冲区模型
        gl.clear(gl.COLOR_BUFFER_BIT);
        console.log(gl);
    };

    return <Canvas draw={draw} width={500} height={500} options={{ context: "webgl" }} />;
}

export default HelloCanvas;
