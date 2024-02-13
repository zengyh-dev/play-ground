import { mat3 } from "gl-matrix";

export const setTransform = (t_x: number, t_y: number, t_z: number, s_x: number, s_y: number, s_z: number) => {
    return {
        modelTransX: t_x,
        modelTransY: t_y,
        modelTransZ: t_z,
        modelScaleX: s_x,
        modelScaleY: s_y,
        modelScaleZ: s_z,
    };
};

// Add resize listener
export const setSize = (camera: THREE.PerspectiveCamera, width: number, height: number) => {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
};

export const getMat3ValueFromRGB = (precomputeL: any) =>{
    let colorMat3 = [];
    for (var i = 0; i < 3; i++) {
        colorMat3[i] = mat3.fromValues(precomputeL[0][i], precomputeL[1][i], precomputeL[2][i],
            precomputeL[3][i], precomputeL[4][i], precomputeL[5][i],
            precomputeL[6][i], precomputeL[7][i], precomputeL[8][i]);
    }
    return colorMat3;
}