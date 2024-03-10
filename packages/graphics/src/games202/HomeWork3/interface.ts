export interface PerspectiveCamera extends THREE.PerspectiveCamera {
    fbo: ExtendedFramebuffer;
}

export interface ExtendedFramebuffer extends WebGLFramebuffer {
    attachments: number[];
    textures: WebGLTexture[];
    depthBuffer: WebGLRenderbuffer;
    lastWidth: number;
    lastHeight: number;
    width: number;
    height: number;
}
