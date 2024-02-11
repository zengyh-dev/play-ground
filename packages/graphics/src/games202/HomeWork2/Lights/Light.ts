import { ReadonlyVec3 } from "gl-matrix";
import { Material } from "../Materials/Materials";
import LightCubeFragmentShader from "../Shaders/LightShader/LightCubeFragment.frag";
import LightCubeVertexShader from "../Shaders/LightShader/LightCubeVertex.vert";

export class EmissiveMaterial extends Material {
    public color: ReadonlyVec3;

    constructor(lightRadiance: ReadonlyVec3) {
        super(
            {
                lightRadiance: { type: "3fv", value: lightRadiance },
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
