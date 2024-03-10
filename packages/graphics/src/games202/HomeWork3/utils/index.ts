import { WebGL2RenderingContextExtend } from "@/canvas/interface";
import { ExtendedFramebuffer } from "../interface";
export const setTransform = (
    t_x: number,
    t_y: number,
    t_z: number,
    s_x: number,
    s_y: number,
    s_z: number,
    r_x: number = 0,
    r_y: number = 0,
    r_z: number = 0
) => {
    return {
        modelTransX: t_x,
        modelTransY: t_y,
        modelTransZ: t_z,
        modelScaleX: s_x,
        modelScaleY: s_y,
        modelScaleZ: s_z,
        modelRotateX: r_x,
        modelRotateY: r_y,
        modelRotateZ: r_z,
    };
};

// Add resize listener
export const setSize = (camera: THREE.PerspectiveCamera, width: number, height: number) => {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
};

export const createAndBindColorTargetTexture = (
    attachment: number,
    gl: WebGL2RenderingContextExtend,
    width: number,
    height: number
) => {
    // 创建纹理对象
    const texture = gl.createTexture();
    if (!texture) {
        console.error("无法创建纹理对象");
    }
    // 绑定纹理
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // texImage2D为纹理对象分配一块存储纹理图像的区域, 最后一个参数为null，可以新建一个空白区域
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, width, height, 0, gl.RGBA, gl.FLOAT, null);
    // 设置纹理的过滤器和包裹模式
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // 将纹理对象关联到帧缓冲区对象
    // 这里的0是因为OpenGL中可以有多个颜色关联对象，而webgl中只可以有一个
    gl.framebufferTexture2D(gl.FRAMEBUFFER, attachment, gl.TEXTURE_2D, texture, 0);

    // console.log(attachment, width, height);
    return texture;
};

export const processFramebuffer = (
    framebuffer: ExtendedFramebuffer,
    gl: WebGL2RenderingContextExtend,
    GBufferNum: number,
    width?: number,
    height?: number
) => {
    if (!framebuffer) {
        console.error("无帧缓冲区对象");
        return;
    }

    // 1. 绑定缓冲区对象
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

    framebuffer.attachments = [];
    framebuffer.textures = [];

    // Edit Start
    if (!width) {
        width = window.screen.width;
    }
    if (!height) {
        height = window.screen.height;
    }

    framebuffer.width = width;
    framebuffer.height = height;

    for (let i = 0; i < GBufferNum; i++) {
        // const attachment = gl_draw_buffers["COLOR_ATTACHMENT" + i + "_WEBGL"];

        // COLOR_ATTACHMENT0是指帧缓冲区对象（Frame Buffer Object）中的第一个颜色附着点
        const attachment = gl.COLOR_ATTACHMENT0 + i;
        // 3. 创建纹理对象并设置其尺寸和参数
        const texture = createAndBindColorTargetTexture(attachment, gl, width, height) as WebGLTexture;
        framebuffer.attachments.push(attachment);
        framebuffer.textures.push(texture);

        const checkStatus = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        if (checkStatus !== gl.FRAMEBUFFER_COMPLETE) {
            console.error("Framebuffer object is incomplete: ", checkStatus);
        }
    }

    // 定义了写入片段颜色的绘制缓冲区
    gl.drawBuffers(framebuffer.attachments);

    // 1. 创建渲染缓冲区对象
    const depthBuffer = gl.createRenderbuffer();
    if (!depthBuffer) {
        console.error("创建渲染缓冲区对象失败！");
    }

    // framebuffer.depthBuffer = depthBuffer as WebGLRenderbuffer;

    // 2. 绑定渲染缓冲区对象并设置其尺寸
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer as WebGLRenderbuffer);
    // 设置缓冲区的格式、宽高,gl.DEPTH_COMPONENT16 当前表示渲染缓冲区将替代深度缓冲区
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);

    // 3. 将渲染缓冲区对象关联到帧缓冲区对象
    // 这里的作用是帮助进行隐藏面消除
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

    // 当将帧缓冲区对象绑定到 null 时，意味着将当前的渲染目标重置为默认的帧缓冲区
    // 这意味着后续的渲染操作将会直接渲染到屏幕上，而不是渲染到自定义的帧缓冲区对象
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
};
