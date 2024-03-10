import { DirectionalLight } from "../Lights/DirectionalLight";
import { Material } from "./Materials";

export class ShadowMaterial extends Material {
    constructor(light: DirectionalLight, vertexShader: string, fragmentShader: string) {
        // 光源MVP
        const lightVP = light.CalcLightVP();

        super(
            {
                uLightVP: { type: "matrix4fv", value: lightVP },
            },
            [],
            vertexShader,
            fragmentShader,
            light.fbo
        );
    }
}
