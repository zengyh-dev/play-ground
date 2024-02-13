class PRTMaterial extends Material {

    constructor(vertexShader, fragmentShader) {
        console.log('haha:' + precomputeL);
        super({
            'uPrecomputeL0': { type: '', value: null },
            'uPrecomputeL1': { type: '', value: null },
            'uPrecomputeL2': { type: '', value: null },
        }, [ 'aPrecomputeLT'], vertexShader, fragmentShader, null);
    }
}

async function buildPRTMaterial(vertexPath, fragmentPath) {


    let vertexShader = await getShaderString(vertexPath);
    let fragmentShader = await getShaderString(fragmentPath);

    return new PRTMaterial(vertexShader, fragmentShader);

}