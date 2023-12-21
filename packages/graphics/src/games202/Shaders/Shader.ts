// import { WebGLProgram } from "three";
import { WebGLRenderingContextExtend } from "../../canvas/interface";

interface ShaderLocations {
    uniforms: string[];
    attribs: string[];
}

interface CustomMap {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

interface WebglProgram {
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
    public program!: WebglProgram;
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

    compileShader(shaderSource: string, shaderType: number) {
        const gl = this.gl;
        const shader = gl.createShader(shaderType);
        if (!shader) {
            return;
        }

        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(shaderSource);
            console.error("shader compiler error:\n" + gl.getShaderInfoLog(shader));
        }

        return shader;
    }

    linkShader(vs: WebGLShader, fs: WebGLShader) {
        const gl = this.gl;
        const prog = gl.createProgram();
        if (!prog) {
            return;
        }
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.linkProgram(prog);

        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
            alert("shader linker error:\n" + gl.getProgramInfoLog(prog));
        }
        return prog;
    }

    addShaderLocations(result: ShaderResult, shaderLocations: ShaderLocations) {
        const gl = this.gl;
        result.uniforms = {};
        result.attribs = {};

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
