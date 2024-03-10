import { ReadonlyVec3 } from "gl-matrix";
import { Material } from "../Materials/Materials";
import LightCubeFragmentShader from "../Shaders/LightShader/LightCube.frag";
import LightCubeVertexShader from "../Shaders/LightShader/LightCube.vert";

export class EmissiveMaterial extends Material {
    public color: ReadonlyVec3;

    constructor(lightRadiance: ReadonlyVec3) {
        super(
            {
                uLightRadiance: { type: "3fv", value: lightRadiance },
            },
            [],
            LightCubeVertexShader,
            LightCubeFragmentShader
        );

        this.color = lightRadiance;
    }

    GetIntensity() {
        return this.color;
    }
}
