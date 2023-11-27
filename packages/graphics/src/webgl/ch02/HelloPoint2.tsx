import Canvas from "../../canvas";
import { WebGLRenderingContextExtend } from "../../canvas/interface";
import { initShaders } from "../../lib/cuon-utils";
import FSHADER_SOURCE from "./fShader.frag";
import { Point } from "./interface";
import VSHADER_SOURCE from "./vShader.vert";

function HelloPoint2() {
    let clickCanvas: (e: React.MouseEvent<HTMLButtonElement>,) => void;
    const draw = (ctx: WebGLRenderingContextExtend, canvas: HTMLCanvasElement) => {
        // 绘制上下文
        const gl = ctx;

        // Initialize shaders
        if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
            console.log("Failed to intialize shaders.");
            return;
        }

        console.log(gl);

        // Get the storage location of a_Position
        const a_Position = gl.getAttribLocation(gl.program as WebGLProgram, "a_Position");
        if (a_Position < 0) {
            console.log("Failed to get the storage location of a_Position");
            return;
        }

        const a_PointSize = gl.getAttribLocation(gl.program as WebGLProgram, "a_PointSize");
        const u_FragColor = gl.getUniformLocation(gl.program as WebGLProgram, 'u_FragColor');
        console.log(u_FragColor);

        // 顶点位置传输给attribute变量，会自动补全缺失的齐次坐标最后一个变量
        gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);
        gl.vertexAttrib1f(a_PointSize, 5.0);

        // Set clear color
        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        // 清空颜色缓冲区，基于多基本缓冲区模型
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Draw a point
        gl.drawArrays(gl.POINTS, 0, 1);

        // 鼠标点击位置数组
        const g_ponits: Point[] = [];
        // cosnt g_colors = [];
        clickCanvas = (e: React.MouseEvent<HTMLButtonElement>) => {
            const target = e.target as HTMLElement;
            const x = e.clientX;
            const y = e.clientY;

            // 获取canvas的位置和尺寸信息
            // react.left 和 react.top 是canvas的原点在浏览器窗口的坐标
            const react = target.getBoundingClientRect();

            console.log('x: ', x, '  y: ', y);
            console.log('react: ', react);

            const gl_point: Point = {
                gl_point_x: ((x - react.left) - canvas.width / 2) / (canvas.width / 2),
                gl_point_y: ((canvas.height / 2 - (y - react.top))) / (canvas.height / 2)
            };
            g_ponits.push(gl_point);

            // 需要clear，但是不用重新设置颜色
            gl.clear(gl.COLOR_BUFFER_BIT);

            // 绘制操作在颜色缓冲区进行绘制，绘制结束后系统会将缓冲区中的内容显示在屏幕上
            // 默认情况下，颜色缓冲区会被重置！！！
            g_ponits.forEach((point: Point) => {
                gl.vertexAttrib3f(a_Position, point.gl_point_x, point.gl_point_y, 0.0);
                gl.drawArrays(gl.POINTS, 0, 1);
            });
        };
    };

    const handleClickCanvas = (e: React.MouseEvent<HTMLButtonElement>) => {
        clickCanvas(e);
    };

    return <Canvas onClick={handleClickCanvas} draw={draw} width={500} height={500} options={{ context: "webgl" }} />;
};

export default HelloPoint2;
