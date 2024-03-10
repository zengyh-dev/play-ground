import { Material } from "./Materials";
import { DirectionalLight } from "../Lights/DirectionalLight";

import { PerspectiveCamera } from "../interface";
import { mipMapLevel } from "../utils/constant";

export class SSRMaterial extends Material {
    constructor(light: DirectionalLight, camera: PerspectiveCamera, vertexShader: string, fragmentShader: string) {
        let lightIntensity = light.mat.GetIntensity();
        // let lightVP = light.CalcLightVP();
        let lightDir = light.CalcShadingDirection();

        const uniforms: any = {
            uLightRadiance: { type: "3fv", value: lightIntensity },
            uLightDir: { type: "3fv", value: lightDir },

            uGDiffuse: { type: "texture", value: camera.fbo.textures[0] },
            uGDepth: { type: "texture", value: camera.fbo.textures[1] },
            uGNormalWorld: { type: "texture", value: camera.fbo.textures[2] },
            uGShadow: { type: "texture", value: camera.fbo.textures[3] },
            uGPosWorld: { type: "texture", value: camera.fbo.textures[4] },
        };

        for (let i = 0; i < mipMapLevel; i++) {
            uniforms["uDepthTexture" + "[" + i + "]"] = { type: "texture", value: null };
        }

        super(uniforms, [], vertexShader, fragmentShader);
    }
}
