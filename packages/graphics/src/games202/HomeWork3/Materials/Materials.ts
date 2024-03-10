import { WebGL2RenderingContextExtend } from "../../../canvas/interface";
import { Shader } from "../Shaders/Shader";
import { Texture } from "../Textures/Texture";
import { ExtendedFramebuffer } from "../interface";
// import { Texture } from '../Textures/Texture';

export interface Uniform {
    type: string;
    value: number[] | number | Texture | Iterable<number> | ExtendedFramebuffer | WebGLTexture | null | undefined;
}

export interface Uniforms {
    [key: string]: Uniform;
}

export class Material {
    #flatten_uniforms;
    #flatten_attribs;
    #vsSrc;
    #fsSrc;
    uniforms;
    attribs;
    frameBuffer;
    notShadow;

    // Uniforms is a map, attribs is a Array
    constructor(
        uniforms: Uniforms,
        attribs: string[],
        vsSrc: string,
        fsSrc: string,
        frameBuffer?: ExtendedFramebuffer | null
    ) {
        this.uniforms = uniforms;
        this.attribs = attribs;
        this.#vsSrc = vsSrc;
        this.#fsSrc = fsSrc;
        this.#flatten_uniforms = ["uViewMatrix", "uModelMatrix", "uProjectionMatrix", "uCameraPos", "uLightPos"];

        for (const k in uniforms) {
            this.#flatten_uniforms.push(k);
        }
        this.#flatten_attribs = attribs;

        this.frameBuffer = frameBuffer;
        this.notShadow = false;
    }

    setMeshAttribs(extraAttribs: string[]) {
        for (let i = 0; i < extraAttribs.length; i++) {
            this.#flatten_attribs.push(extraAttribs[i]);
        }
    }

    compile(gl: WebGL2RenderingContextExtend) {
        return new Shader(gl, this.#vsSrc, this.#fsSrc, {
            uniforms: this.#flatten_uniforms,
            attribs: this.#flatten_attribs,
        });
    }
}
