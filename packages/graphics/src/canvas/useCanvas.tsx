import { useRef, useEffect } from "react";
import { CanvasProps } from "./interface";

const useCanvas = (props: CanvasProps) => {
    const { draw, options } = props;
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current as unknown as HTMLCanvasElement;
        // 参数为'webgl'返回: 基于 OpenGL ES 2.0 的绘图上下文
        // 参数为'webgl2'返回: 基于 OpenGL ES 3.0 的绘图上下文
        const context = canvas.getContext(options?.context || "webgl") as WebGLRenderingContext;
        // let frameCount = 0;
        // let animationFrameId: number;
        // const render = () => {
        //     frameCount++;
        //     draw(context, frameCount);
        //     animationFrameId = window.requestAnimationFrame(render);
        // };
        // render();
        // return () => {
        //     window.cancelAnimationFrame(animationFrameId);
        // };
        draw(context, canvas);
    });
    return canvasRef;
};
export default useCanvas;
