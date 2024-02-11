// import { WebGLProgram } from "three";
import { WebGLRenderingContextExtend } from "../../../canvas/interface";

interface ShaderLocations {
    uniforms: string[];
    attribs: string[];
}

interface CustomMap {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

// 包含了程序对象和变量信息
export interface WebglProgram {
    uniforms: CustomMap;
    attribs: CustomMap;
    glShaderProgram: WebGLProgram;
}

interface ShaderResult {
    uniforms?: CustomMap;
    attribs?: CustomMap;
    glShaderProgram: WebGLProgram;
}

export class Shader {
    public gl: WebGLRenderingContextExtend;
    public program: WebglProgram | null = null;
    constructor(gl: WebGLRenderingContextExtend, vsSrc: string, fsSrc: string, shaderLocations: ShaderLocations) {
        this.gl = gl;
        const vs = this.compileShader(vsSrc, gl.VERTEX_SHADER);
        const fs = this.compileShader(fsSrc, gl.FRAGMENT_SHADER);

        if (!vs || !fs) {
            console.log("compile shader error!");
            return;
        }

        const glShaderProgram = this.linkShader(vs, fs);
        if (!glShaderProgram) {
            console.log("linkShader error!");
            return;
        }

        this.program = this.addShaderLocations(
            {
                glShaderProgram,
            },
            shaderLocations
        );
    }

    // 创建并编译着色器对象
    compileShader(shaderSource: string, shaderType: number) {
        const gl = this.gl;
        // 1. 创建着色器对象
        const shader = gl.createShader(shaderType);
        if (!shader) {
            return;
        }

        // 2. 向着色器对象填充着色器程序源码
        // 源码以字符串形式存储
        gl.shaderSource(shader, shaderSource);

        // 3. 编译着色器
        // 需要编译成二进制才能执行（类似C++）
        gl.compileShader(shader);

        // 检查着色器是否编译成功
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(shaderSource);
            console.error("shader compiler error:\n" + gl.getShaderInfoLog(shader));
        }

        return shader;
    }

    // 创建程序对象并分配着色器
    linkShader(vs: WebGLShader, fs: WebGLShader) {
        const gl = this.gl;
        // 4. 创建着色器程序对象
        const prog = gl.createProgram();
        if (!prog) {
            return;
        }

        // 5. 为程序对象分配着色器
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);

        // 6. 连接程序对象，检查两个着色器内容
        // (1) 顶点着色器和片元着色器的varying变量同名且同类型，且一一对应
        // (2) 顶点着色器对每个arying变量赋了值
        // (3) 顶点着色器和片元着色器中的同名 uniform变量也是同类型的(无需一一对应，即某些uniform变量可以出现在一个着色器中而不出现在另一个中)
        // (4) 着色器中的attribute变量、uniform变量和varying变量的个数没有超过着色器的上限
        gl.linkProgram(prog);

        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
            alert("shader linker error:\n" + gl.getProgramInfoLog(prog));
        }
        return prog;
    }

    addShaderLocations(result: ShaderResult, shaderLocations: ShaderLocations) {
        const gl = this.gl;
        result.uniforms = {}; // 可以用在顶点和片元着色器中，全局变量，一般是变换矩阵
        result.attribs = {}; // 只能出现在顶点着色器中，是全局变量，逐顶点信息

        // 将着色器程序中的uniform和attrib的位置信息添加到着色器结果对象中，以便在后续的渲染过程中使用这些位置信息
        if (shaderLocations && shaderLocations.uniforms && shaderLocations.uniforms.length) {
            for (let i = 0; i < shaderLocations.uniforms.length; ++i) {
                result.uniforms = Object.assign(result.uniforms, {
                    [shaderLocations.uniforms[i]]: gl.getUniformLocation(
                        result.glShaderProgram,
                        shaderLocations.uniforms[i]
                    ),
                });
                //console.log(gl.getUniformLocation(result.glShaderProgram, 'uKd'));
            }
        }
        if (shaderLocations && shaderLocations.attribs && shaderLocations.attribs.length) {
            for (let i = 0; i < shaderLocations.attribs.length; ++i) {
                result.attribs = Object.assign(result.attribs, {
                    [shaderLocations.attribs[i]]: gl.getAttribLocation(
                        result.glShaderProgram,
                        shaderLocations.attribs[i]
                    ),
                });
            }
        }

        return result as WebglProgram;
    }
}
