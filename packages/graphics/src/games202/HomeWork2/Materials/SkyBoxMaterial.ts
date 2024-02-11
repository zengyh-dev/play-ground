
import { Material } from './Materials';

export class SkyBoxMaterial extends Material {

    constructor(vertexShader: string, fragmentShader: string) {
        super({
            'skybox': { type: 'CubeTexture', value: null },
            'uMoveWithCamera': { type: 'updatedInRealTime', value: null }
        }, [], vertexShader, fragmentShader, null);
    }
}

export async function buildSkyBoxMaterial(vertexShader: string, fragmentShader: string) {
    return new SkyBoxMaterial(vertexShader, fragmentShader);

}