import { WebGL2RenderingContextExtend } from "../../../canvas/interface";
// import { resolution } from "../utils/constant";

interface ExtendedFramebuffer extends WebGLFramebuffer {
    attachments: number[];
    textures: WebGLTexture[];
}

// 帧缓冲区对象
export class FBO {
    public framebuffer: ExtendedFramebuffer | null;
    gl: WebGL2RenderingContext | null;
    depthBuffer: WebGLRenderbuffer | null;
    GBufferNum: number;

    constructor(gl: WebGL2RenderingContextExtend, GBufferNum: number) {
        this.gl = gl;
        this.GBufferNum = GBufferNum;
        this.framebuffer = this.createFramebuffer() as ExtendedFramebuffer;
        this.depthBuffer = null;
    }

    private createAndBindColorTargetTexture(attachment: number) {
        const { gl } = this;
        if (!gl) {
            console.error("no gl!");
            return;
        }

        // 创建纹理对象
        const texture = gl.createTexture();
        if (!texture) {
            console.error("无法创建纹理对象");
            return this.error();
        }
        // 绑定纹理
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // texImage2D为纹理对象分配一块存储纹理图像的区域, 最后一个参数为null，可以新建一个空白区域
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, window.screen.width, window.screen.height, 0, gl.RGBA, gl.FLOAT, null);
        // 设置纹理的过滤器和包裹模式
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        // 6. 将纹理对象关联到帧缓冲区对象
        // 这里的0是因为OpenGL中可以有多个颜色关联对象，而webgl中只可以有一个
        gl.framebufferTexture2D(gl.FRAMEBUFFER, attachment, gl.TEXTURE_2D, texture, 0);
        return texture;
    }

    createFramebuffer() {
        const { gl } = this;
        if (!gl) {
            console.log("error no gl!");
            return;
        }

        // 1. 创建帧缓冲区对象
        // 创建出帧缓冲区对象后，还需要将其颜色关联对象指定为一个纹理对象, 将其深度关联对象指定为一个渲染缓冲区对象
        const framebuffer = gl.createFramebuffer() as ExtendedFramebuffer;
        if (!framebuffer) {
            console.error("无法创建帧缓冲区对象");
            return this.error();
        }
        // 2. 绑定缓冲区对象
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

        // const GBufferNum = 5;
        framebuffer.attachments = [];
        framebuffer.textures = [];

        // const gl_draw_buffers = gl.getExtension("WEBGL_draw_buffers") as WEBGL_draw_buffers;

        for (let i = 0; i < this.GBufferNum; i++) {
            // const attachment = gl_draw_buffers["COLOR_ATTACHMENT" + i + "_WEBGL"];

            // COLOR_ATTACHMENT0是指帧缓冲区对象（Frame Buffer Object）中的第一个颜色附着点
            const attachment = gl.COLOR_ATTACHMENT0 + i;
            // 3. 创建纹理对象并设置其尺寸和参数
            const texture = this.createAndBindColorTargetTexture(attachment) as WebGLTexture;
            framebuffer.attachments.push(attachment);
            framebuffer.textures.push(texture);
        }

        // 由于我们使用了多个渲染目标

        // 因此必须通过 glDrawBuffers 明确告诉 OpenGL 我们希望渲染到与 GBuffer 关联的哪个颜色缓冲区

        // gl_draw_buffers.drawBuffersWEBGL(framebuffer.attachments);

        // 定义了写入片段颜色的绘制缓冲区
        gl.drawBuffers(framebuffer.attachments);

        // 1. 创建渲染缓冲区对象
        this.depthBuffer = gl.createRenderbuffer();
        // 2. 绑定渲染缓冲区对象并设置其尺寸
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.depthBuffer as WebGLRenderbuffer);
        // 设置缓冲区的格式、宽高,gl.DEPTH_COMPONENT16 当前表示渲染缓冲区将替代深度缓冲区
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, window.screen.width, window.screen.height);

        // 3. 将渲染缓冲区对象关联到帧缓冲区对象
        // 这里的作用是帮助进行隐藏面消除
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.depthBuffer);

        const checkStatus = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        if (checkStatus !== gl.FRAMEBUFFER_COMPLETE) {
            console.log("帧缓冲对象不完整: ", checkStatus);
            return this.error();
        }

        // 当将帧缓冲区对象绑定到 null 时，意味着将当前的渲染目标重置为默认的帧缓冲区
        // 这意味着后续的渲染操作将会直接渲染到屏幕上，而不是渲染到自定义的帧缓冲区对象
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);

        return framebuffer;
    }

    //定义错误函数
    error() {
        const { gl, framebuffer, depthBuffer } = this;
        if (!gl) {
            console.log("no gl!");
            return;
        }
        if (framebuffer) {
            gl.deleteFramebuffer(framebuffer);
        }
        // if (texture) {
        //     gl.deleteFramebuffer(texture);
        // }
        if (depthBuffer) {
            gl.deleteFramebuffer(depthBuffer);
        }
        return null;
    }
}
