import { Material } from "../Materials/Materials";
import LightCubeFragmentShader from "../Shaders/LightShader/LightCubeFragment.frag";
import LightCubeVertexShader from "../Shaders/LightShader/LightCubeVertex.vert";

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

    GetIntensity() {
        return [this.intensity * this.color[0], this.intensity * this.color[1], this.intensity * this.color[2]];
    }
}
