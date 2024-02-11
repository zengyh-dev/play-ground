import { ReadonlyVec3 } from "gl-matrix";
import { DirectionalLight } from "../Lights/DirectionalLight";
import { Material } from "./Materials";

export class ShadowMaterial extends Material {
    constructor(
        light: DirectionalLight,
        translate: ReadonlyVec3,
        scale: ReadonlyVec3,
        vertexShader: string,
        fragmentShader: string
    ) {
        // 光源MVP
        const lightMVP = light.CalcLightMVP(translate, scale);

        super(
            {
                uLightMVP: { type: "matrix4fv", value: lightMVP },
            },
            [],
            vertexShader,
            fragmentShader,
            light.fbo
        );
    }
}
