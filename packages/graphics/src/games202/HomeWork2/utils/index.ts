import { mat3, mat4 } from "gl-matrix";
import { matrix, inv, multiply, transpose, sqrt } from "mathjs";
import { SHEval } from "./sh";
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

export function getRotationPrecomputeL(precompute_L: any, rotationMatrix: any) {
    const rotationMatrix_inverse = mat4.create();
    mat4.invert(rotationMatrix_inverse, rotationMatrix);
    const r = mat4Matrix2mathMatrix(rotationMatrix_inverse);

    const shRotateMatrix3x3 = computeSquareMatrix_3by3(r);
    const shRotateMatrix5x5 = computeSquareMatrix_5by5(r);

    const result = [];
    for (let i = 0; i < 9; i++) {
        result[i] = [];
    }
    for (let i = 0; i < 3; i++) {
        const L_SH_R_3 = multiply([precompute_L[1][i], precompute_L[2][i], precompute_L[3][i]], shRotateMatrix3x3);
        const L_SH_R_5 = multiply(
            [precompute_L[4][i], precompute_L[5][i], precompute_L[6][i], precompute_L[7][i], precompute_L[8][i]],
            shRotateMatrix5x5
        );

        result[0][i] = precompute_L[0][i];
        result[1][i] = L_SH_R_3._data[0];
        result[2][i] = L_SH_R_3._data[1];
        result[3][i] = L_SH_R_3._data[2];
        result[4][i] = L_SH_R_5._data[0];
        result[5][i] = L_SH_R_5._data[1];
        result[6][i] = L_SH_R_5._data[2];
        result[7][i] = L_SH_R_5._data[3];
        result[8][i] = L_SH_R_5._data[4];
    }

    return result;
}

function computeSquareMatrix_3by3(rotationMatrix: any) {
    // 计算方阵SA(-1) 3*3

    // 1、pick ni - {ni}
    const n1 = [1, 0, 0, 0];
    const n2 = [0, 0, 1, 0];
    const n3 = [0, 1, 0, 0];

    // 2、{P(ni)} - A  A_inverse
    const n1_sh = SHEval(n1[0], n1[1], n1[2], 3);
    const n2_sh = SHEval(n2[0], n2[1], n2[2], 3);
    const n3_sh = SHEval(n3[0], n3[1], n3[2], 3);

    const A = matrix([
        [n1_sh[1], n2_sh[1], n3_sh[1]],
        [n1_sh[2], n2_sh[2], n3_sh[2]],
        [n1_sh[3], n2_sh[3], n3_sh[3]],
    ]);

    const A_inverse = inv(A);

    // 3、用 R 旋转 ni - {R(ni)}
    const n1_r = multiply(rotationMatrix, n1);
    const n2_r = multiply(rotationMatrix, n2);
    const n3_r = multiply(rotationMatrix, n3);

    // 4、R(ni) SH投影 - S
    const n1_r_sh = SHEval(n1_r[0], n1_r[1], n1_r[2], 3);
    const n2_r_sh = SHEval(n2_r[0], n2_r[1], n2_r[2], 3);
    const n3_r_sh = SHEval(n3_r[0], n3_r[1], n3_r[2], 3);

    const S = matrix([
        [n1_r_sh[1], n2_r_sh[1], n3_r_sh[1]],
        [n1_r_sh[2], n2_r_sh[2], n3_r_sh[2]],
        [n1_r_sh[3], n2_r_sh[3], n3_r_sh[3]],
    ]);

    // 5、S*A_inverse
    return multiply(S, A_inverse);
}

function computeSquareMatrix_5by5(rotationMatrix) {
    // 计算方阵SA(-1) 5*5

    // 1、pick ni - {ni}
    const k = 1 / sqrt(2);
    const n1 = [1, 0, 0, 0];
    const n2 = [0, 0, 1, 0];
    const n3 = [k, k, 0, 0];
    const n4 = [k, 0, k, 0];
    const n5 = [0, k, k, 0];

    // 2、{P(ni)} - A  A_inverse
    const n1_sh = SHEval(n1[0], n1[1], n1[2], 3);
    const n2_sh = SHEval(n2[0], n2[1], n2[2], 3);
    const n3_sh = SHEval(n3[0], n3[1], n3[2], 3);
    const n4_sh = SHEval(n4[0], n4[1], n4[2], 3);
    const n5_sh = SHEval(n5[0], n5[1], n5[2], 3);

    const A = matrix([
        [n1_sh[4], n2_sh[4], n3_sh[4], n4_sh[4], n5_sh[4]],
        [n1_sh[5], n2_sh[5], n3_sh[5], n4_sh[5], n5_sh[5]],
        [n1_sh[6], n2_sh[6], n3_sh[6], n4_sh[6], n5_sh[6]],
        [n1_sh[7], n2_sh[7], n3_sh[7], n4_sh[7], n5_sh[7]],
        [n1_sh[8], n2_sh[8], n3_sh[8], n4_sh[8], n5_sh[8]],
    ]);

    const A_inverse = inv(A);

    // 3、用 R 旋转 ni - {R(ni)}
    const n1_r = multiply(rotationMatrix, n1);
    const n2_r = multiply(rotationMatrix, n2);
    const n3_r = multiply(rotationMatrix, n3);
    const n4_r = multiply(rotationMatrix, n4);
    const n5_r = multiply(rotationMatrix, n5);

    // 4、R(ni) SH投影 - S
    const n1_r_sh = SHEval(n1_r[0], n1_r[1], n1_r[2], 3);
    const n2_r_sh = SHEval(n2_r[0], n2_r[1], n2_r[2], 3);
    const n3_r_sh = SHEval(n3_r[0], n3_r[1], n3_r[2], 3);
    const n4_r_sh = SHEval(n4_r[0], n4_r[1], n4_r[2], 3);
    const n5_r_sh = SHEval(n5_r[0], n5_r[1], n5_r[2], 3);

    const S = matrix([
        [n1_r_sh[4], n2_r_sh[4], n3_r_sh[4], n4_r_sh[4], n5_r_sh[4]],
        [n1_r_sh[5], n2_r_sh[5], n3_r_sh[5], n4_r_sh[5], n5_r_sh[5]],
        [n1_r_sh[6], n2_r_sh[6], n3_r_sh[6], n4_r_sh[6], n5_r_sh[6]],
        [n1_r_sh[7], n2_r_sh[7], n3_r_sh[7], n4_r_sh[7], n5_r_sh[7]],
        [n1_r_sh[8], n2_r_sh[8], n3_r_sh[8], n4_r_sh[8], n5_r_sh[8]],
    ]);

    // 5、S*A_inverse
    return multiply(S, A_inverse);
}

function mat4Matrix2mathMatrix(rotationMatrix: any) {
    const mathMatrix = [];
    for (let i = 0; i < 4; i++) {
        const r = [];
        for (let j = 0; j < 4; j++) {
            r.push(rotationMatrix[i * 4 + j]);
        }
        mathMatrix.push(r);
    }
    // Edit Start
    //return math.matrix(mathMatrix)
    return transpose(mathMatrix);
    // Edit End
}

export function getMat3ValueFromRGB(precomputeL: any) {
    const colorMat3 = [];
    for (let i = 0; i < 3; i++) {
        colorMat3[i] = mat3.fromValues(
            precomputeL[0][i],
            precomputeL[1][i],
            precomputeL[2][i],
            precomputeL[3][i],
            precomputeL[4][i],
            precomputeL[5][i],
            precomputeL[6][i],
            precomputeL[7][i],
            precomputeL[8][i]
        );
    }
    return colorMat3;
}
