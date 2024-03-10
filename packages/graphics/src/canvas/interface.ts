export type WebGLRenderingContextExtend = WebGLRenderingContext & { program?: WebGLProgram };
export type WebGL2RenderingContextExtend = WebGL2RenderingContext & { program?: WebGLProgram };

export type Draw = (ctx: WebGL2RenderingContextExtend, canvas: HTMLCanvasElement, frameCount?: number) => void;

export interface CanvasProps {
    draw: Draw;
    options?: {
        context: string;
    };
    [key: string]: unknown;
}
