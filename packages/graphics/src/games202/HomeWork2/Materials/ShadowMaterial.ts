import { DirectionalLight } from "../Lights/DirectionalLight";
import { Material } from "./Materials";

export class ShadowMaterial extends Material {
    constructor(light: DirectionalLight, translate, scale, vertexShader: string, fragmentShader: string) {
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
