import { useRef, useEffect } from "react";
import { CanvasProps } from "./interface";

const useCanvas = (props: CanvasProps) => {
    const { draw, options } = props;
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current as unknown as HTMLCanvasElement;
        const context = canvas.getContext(options?.context || "2d") as WebGLRenderingContext;
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
