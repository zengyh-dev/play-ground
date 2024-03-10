import { DirectionalLight } from "../Lights/DirectionalLight";
import { Texture } from "../Textures/Texture";
import { PerspectiveCamera } from "../interface";
import { Material } from "./Materials";

export class GBufferMaterial extends Material {
    constructor(
        diffuseMap: Texture,
        normalMap: Texture,
        light: DirectionalLight,
        camera: PerspectiveCamera,
        vertexShader: string,
        fragmentShader: string
    ) {
        let lightVP = light.CalcLightVP();

        super(
            {
                uKd: { type: "texture", value: diffuseMap.texture },
                uNt: { type: "texture", value: normalMap.texture },

                uLightVP: { type: "matrix4fv", value: lightVP },
                uShadowMap: { type: "texture", value: light.fbo.textures[0] },
            },
            [],
            vertexShader,
            fragmentShader,
            camera.fbo
        );
    }
}
