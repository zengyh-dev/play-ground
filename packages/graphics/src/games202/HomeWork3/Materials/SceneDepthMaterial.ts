import { Material } from "./Materials";

export class SceneDepthMaterial extends Material {
    notShadow;
    constructor(depthTexture: WebGLTexture, vertexShader: string, fragmentShader: string) {
        super(
            {
                uSampler: { type: "texture", value: depthTexture },
                uDepthMipMap: { type: "texture", value: null },
                uLastMipLevel: { type: "1i", value: -1 },
                uLastMipSize: { type: "3fv", value: null },
                uCurLevel: { type: "1i", value: 0 },
            },
            [],
            vertexShader,
            fragmentShader
        );
        this.notShadow = true;
    }
}
