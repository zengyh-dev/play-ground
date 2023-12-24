import { ReadonlyVec3, mat4 } from "gl-matrix";
import { Mesh } from "../Objects/Mesh";
import { EmissiveMaterial } from "./Light";
import { WebGLRenderingContextExtend } from "../../../canvas/interface";
import { FBO } from "../Textures/FBO";
import { setTransform } from "../utils/utils";

export class DirectionalLight {
    public mesh;
    public mat;
    public fbo;
    public lightPos;
    public focalPoint;
    public lightUp;
    public hasShadowMap;

    constructor(
        lightIntensity: number,
        lightColor: number[],
        lightPos: ReadonlyVec3,
        focalPoint: ReadonlyVec3,
        lightUp: ReadonlyVec3,
        hasShadowMap: boolean,
        gl: WebGLRenderingContextExtend
    ) {
        this.mesh = Mesh.cube(setTransform(0, 0, 0, 0.2, 0.2, 0.2));
        this.mat = new EmissiveMaterial(lightIntensity, lightColor);
        this.lightPos = lightPos;
        this.focalPoint = focalPoint;
        this.lightUp = lightUp;

        this.hasShadowMap = hasShadowMap;
        this.fbo = new FBO(gl);
        if (!this.fbo) {
            console.log("无法设置帧缓冲区对象");
            return;
        }
    }

    CalcLightMVP(translate: ReadonlyVec3, scale: ReadonlyVec3) {
        console.log(translate);
        console.log(scale);
        const lightMVP = mat4.create();
        const modelMatrix = mat4.create();
        const viewMatrix = mat4.create();
        const projectionMatrix = mat4.create();

        // Model transform
        mat4.translate(modelMatrix, modelMatrix, translate);
        mat4.scale(modelMatrix, modelMatrix, scale);

        // View transform
        mat4.lookAt(viewMatrix, this.lightPos, this.focalPoint, this.lightUp);

        // Projection transform
        const left = -100.0;
        const right = 100.0;

        const bottom = -100.0;
        const top = 100.0;

        const near = 0.01;
        const far = 500.0;
        // 正交投影
        mat4.ortho(projectionMatrix, left, right, bottom, top, near, far);

        // MVP矩阵
        mat4.multiply(lightMVP, projectionMatrix, viewMatrix);
        mat4.multiply(lightMVP, lightMVP, modelMatrix);

        return lightMVP;
    }
}
