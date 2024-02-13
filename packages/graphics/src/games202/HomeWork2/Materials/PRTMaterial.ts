import { Material } from "./Materials";

export class PRTMaterial extends Material {
    constructor(
        vertexShader: string,
        fragmentShader: string
    ) {
        super({
            'uPrecomputeL0': { type: '', value: null },
            'uPrecomputeL1': { type: '', value: null },
            'uPrecomputeL2': { type: '', value: null },
        }, ['aPrecomputeLT'], vertexShader, fragmentShader, null);
    }
}
