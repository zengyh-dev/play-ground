import { WebGLRenderingContextExtend } from "../../canvas/interface";
import { Shader } from "../Shaders/Shader";

export class Material {
    #flatten_uniforms;
    #flatten_attribs;
    #vsSrc;
    #fsSrc;
    uniforms;
    attribs;

    // Uniforms is a map, attribs is a Array
    constructor(
        uniforms: Map<string, { type: string; value: number[] | object }>,
        attribs: string[],
        vsSrc: string,
        fsSrc: string
    ) {
        this.uniforms = uniforms;
        this.attribs = attribs;
        this.#vsSrc = vsSrc;
        this.#fsSrc = fsSrc;

        this.#flatten_uniforms = ["uModelViewMatrix", "uProjectionMatrix", "uCameraPos", "uLightPos"];
        for (const k in uniforms) {
            this.#flatten_uniforms.push(k);
        }
        this.#flatten_attribs = attribs;
    }

    setMeshAttribs(extraAttribs: string[]) {
        for (let i = 0; i < extraAttribs.length; i++) {
            this.#flatten_attribs.push(extraAttribs[i]);
        }
    }

    compile(gl: WebGLRenderingContextExtend) {
        return new Shader(gl, this.#vsSrc, this.#fsSrc, {
            uniforms: this.#flatten_uniforms,
            attribs: this.#flatten_attribs,
        });
    }
}
