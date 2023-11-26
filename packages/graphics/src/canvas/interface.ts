export type WebGLRenderingContextExtend = WebGLRenderingContext & { program?: WebGLProgram };

export type Draw = (ctx: WebGLRenderingContextExtend, frameCount?: number) => void;

export interface CanvasProps {
    draw: Draw;
    options?: {
        context: string;
    };
    [key: string]: unknown;
}
