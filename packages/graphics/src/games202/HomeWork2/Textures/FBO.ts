import { WebGLRenderingContextExtend } from "../../../canvas/interface";
import { resolution } from "../utils/constant";

// 帧缓冲区对象
export class FBO {
    constructor(gl: WebGLRenderingContextExtend) {
        let framebuffer: WebGLFramebuffer | null = null;
        let texture: WebGLTexture | null = null;
        let depthBuffer: WebGLRenderbuffer | null = null;

        //定义错误函数
        function error() {
            if (framebuffer) gl.deleteFramebuffer(framebuffer);
            if (texture) gl.deleteFramebuffer(texture);
            if (depthBuffer) gl.deleteFramebuffer(depthBuffer);
            return null;
        }

        // 1. 创建帧缓冲区对象
        framebuffer = gl.createFramebuffer();
        if (!framebuffer) {
            console.log("无法创建帧缓冲区对象");
            return error();
        }

        // 2. 创建纹理对象并设置其尺寸和参数
        texture = gl.createTexture();
        if (!texture) {
            console.log("无法创建纹理对象");
            return error();
        }

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, resolution, resolution, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        framebuffer.texture = texture; //将纹理对象存入framebuffer

        // 3. 创建渲染缓冲区对象
        depthBuffer = gl.createRenderbuffer();
        if (!depthBuffer) {
            console.log("无法创建渲染缓冲区对象");
            return error();
        }

        // 4. 绑定渲染缓冲区对象并设置其尺寸
        gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
        // 设置缓冲区的格式、宽高
        // 当前表示渲染缓冲区将替代深度缓冲区
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, resolution, resolution);

        // 5. 绑定缓冲区对象
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

        // 6. 将纹理对象关联到帧缓冲区对象
        // COLOR_ATTACHMENT0,这里的0是因为OpenGL中可以有多个颜色关联对象，而webgl中只可以有一个
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

        // 7. 将渲染缓冲区对象关联到帧缓冲区对象
        // 这里的作用是帮助进行隐藏面消除
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

        // 8. 检查帧缓冲区对象是否被正确设置
        const e = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        if (gl.FRAMEBUFFER_COMPLETE !== e) {
            console.log("渲染缓冲区设置错误" + e.toString());
            return error();
        }

        // 取消当前的focus对象
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);

        return framebuffer;
    }
}
