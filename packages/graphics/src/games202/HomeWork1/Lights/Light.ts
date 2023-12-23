import { Material } from "../Materials/Materials";
import LightCubeFragmentShader from "../Shaders/LightShader/fragment.glsl";
import LightCubeVertexShader from "../Shaders/LightShader/vertex.glsl";

export class EmissiveMaterial extends Material {
    public intensity: number;
    public color: number[];

    constructor(lightIntensity: number, lightColor: number[]) {
        super(
            {
                uLigIntensity: { type: "1f", value: lightIntensity },
                uLightColor: { type: "3fv", value: lightColor },
            },
            [],
            LightCubeVertexShader,
            LightCubeFragmentShader
        );

        this.intensity = lightIntensity;
        this.color = lightColor;
    }
}
