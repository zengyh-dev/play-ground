import { Mat4 } from "cuon-matrix-ts";

import Canvas from "../../../canvas";
import { WebGLRenderingContextExtend } from "../../../canvas/interface";
import { initShaders } from "../../../../lib/cuon-utils";

import FSHADER_SOURCE from "./matrix.frag";
import VSHADER_SOURCE from "./matrix.vert";

function RotatingTriangle() {
    let g_last = Date.now();
    const ANGLE_STEP = 45.0;

    const initVertexBuffers = (gl: WebGLRenderingContextExtend) => {
        // -------------------创建和写入缓冲区------------------------
        // 通过new来创建类型化数组
        const vertices = new Float32Array([0.0, 0.3, -0.3, -0.3, 0.3, -0.3]);

        // 点的个数
        const n = 3;

        // 1. 创建缓冲区对象
        const vertexBuffer = gl.createBuffer();
        if (!vertexBuffer) {
            console.log("Failed to create thie buffer object");
            return -1;
        }

        // 2. 将缓冲区对象保存到目标上 （目标表示缓冲区对象的用途）
        // ARRAY_BUFFER：表示缓冲区对象包含了顶点的数据
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

        // 3. 向缓冲区对象写入数据
        // 参数一 目标：写入绑定在gl.ARRAY_BUFFER上的缓冲区对象
        // 参数二 数据：类型化的数组
        // 参数三 用途：表示程序将如何使用存储在缓冲区对象中的数据
        //      当前是写入一次，可以绘制很多次
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        // -------------------使用缓冲区进行绘图------------------------
        const a_Position = gl.getAttribLocation(gl.program as WebGLProgram, "a_Position");
        if (a_Position < 0) {
            console.log("Failed to get the storage location of a_Position");
            return -1;
        }
        // 4. 将缓冲区对象的引用分配给一个attribute变量
        // 参数一 位置： attribute变量的存储位置
        // 参数二 大小： 缓冲区每个顶点的分量个数，不够会补全（这里就补了两位）
        // 参数三 类型： 数据类型
        // 参数四 归一： 是否将非浮点的数据归一化到[0, 1]或[-1, 1]区间
        // 参数五 间隔： 两个顶点间的字节数，默认0字节
        // 参数六 偏移： 缓冲区对象的偏移量，默认0字节
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

        // 5. 激活（开启）分配给a_Position变量的缓冲区对象
        gl.enableVertexAttribArray(a_Position);

        return n;
    };

    const animate = (angle: number) => {
        const now = Date.now();
        // 由于使用的是requestAnimationFrame，间隔时间肯定不固定
        // 所以要根据间隔时间来计算角度
        const elapsed = now - g_last;
        g_last = now;
        // 更新旋转角度，时间单位是毫秒，要除以1000
        let newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
        // 返回每次绘制时，三角形相对于初始状态被旋转的角度
        // 要保证小于360
        return (newAngle %= 360);
    };

    const reDraw = (
        gl: WebGLRenderingContextExtend, // 上下文
        n: number, // 顶点个数
        currentAngle: number, // 当前旋转角度
        modelMatrix: Mat4, // 旋转矩阵
        u_ModelMatrix: number // 变量存储位置
    ) => {
        modelMatrix.setRotate(currentAngle, 0, 0, 1);
        modelMatrix.translate(0.35, 0, 0);
        gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, n);
    };

    const draw = (gl: WebGLRenderingContextExtend) => {
        if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
            console.log("Failed to intialize shaders.");
            return;
        }

        // 创建顶点缓冲区对象，将多个顶点的数据保存在缓冲区，最后将缓冲区传给顶点着色器
        const n = initVertexBuffers(gl);
        if (n < 0) {
            console.log("Failed to set the positions of the vertices");
            return;
        }

        // 将旋转矩阵传输给顶点
        const u_ModelMatrix = gl.getUniformLocation(gl.program as WebGLProgram, "u_ModelMatrix") as number | null;
        if (!u_ModelMatrix || u_ModelMatrix < 0) {
            console.log("Failed to get the storage location of u_ModelMatrix");
            return;
        }

        const modelMatrix = new Mat4();
        let currentAngle = 0.0;

        // 不断更新动画状态，重新绘制场景
        const tick = () => {
            // 1. 更新动画状态
            currentAngle = animate(currentAngle);
            // 2. 重新绘制场景
            reDraw(gl, n, currentAngle, modelMatrix, u_ModelMatrix);
            // 3. 在浏览器下一次重绘之前调用该函数
            // 相对于setTimeout，requestAnimationFrame 可以自动适应浏览器的刷新率，提供更加平滑和高效的动画效果
            // 并且在页面不可见或隐藏时会自动暂停，节省了资源的消耗
            requestAnimationFrame(tick);
        };
        tick();
    };

    return <Canvas draw={draw} width={500} height={500} options={{ context: "webgl" }} />;
}

export default RotatingTriangle;
