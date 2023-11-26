export type CanvasContext = WebGLRenderingContext | CanvasRenderingContext2D;
export type Draw = (ctx: RenderingContext, frameCount?: number) => void;

export interface CanvasProps {
    draw: Draw;
    options?: {
        context: string;
    };
    [key: string]: unknown;
}
