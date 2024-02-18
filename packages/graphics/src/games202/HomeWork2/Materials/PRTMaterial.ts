import { Material } from "./Materials";
export class PRTMaterial extends Material {
    constructor(
        vertexShader: string,
        fragmentShader: string
    ) {
        super({
            'uPrecomputeL[0]': { type: 'precomputeL', value: null},
            'uPrecomputeL[1]': { type: 'precomputeL', value: null},
            'uPrecomputeL[2]': { type: 'precomputeL', value: null},
        }, 
        ['aPrecomputeLT'], 
        vertexShader, fragmentShader, null);
    }
}
