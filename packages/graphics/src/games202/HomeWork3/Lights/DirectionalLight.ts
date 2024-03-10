import { ReadonlyVec3, mat4 } from "gl-matrix";
import { Mesh } from "../Objects/Mesh";
import { EmissiveMaterial } from "./Light";
import { WebGL2RenderingContextExtend } from "../../../canvas/interface";
import { processFramebuffer, setTransform } from "../utils";
import { ExtendedFramebuffer } from "../interface";

interface LightDir {
    x: number;
    y: number;
    z: number;
}

export class DirectionalLight {
    public mesh;
    public mat;
    public fbo;
    public lightPos;
    public focalPoint;
    public lightUp;
    public hasShadowMap;
    public lightDir: LightDir | undefined;

    constructor(
        lightRadiance: ReadonlyVec3,
        lightPos: ReadonlyVec3,
        focalPoint: ReadonlyVec3, // 焦点
        lightUp: ReadonlyVec3,
        hasShadowMap: boolean,
        gl: WebGL2RenderingContextExtend,
        lightDir?: LightDir
    ) {
        this.mesh = Mesh.cube(setTransform(0, 0, 0, 0.1, 0.1, 0.1));
        this.mat = new EmissiveMaterial(lightRadiance);
        this.lightPos = lightPos;
        this.focalPoint = focalPoint;
        this.lightUp = lightUp;
        this.lightDir = lightDir;

        this.hasShadowMap = hasShadowMap;

        const directionalLightFBO = gl.createFramebuffer() as ExtendedFramebuffer;

        processFramebuffer(directionalLightFBO, gl, 1);
        this.fbo = directionalLightFBO;
        if (!directionalLightFBO) {
            console.error("无帧缓冲区对象: directionalLightFBO");
            return;
        }
    }

    // MVP矩阵可用于实现光照模型（如Phong光照模型）中的光照计算，包括漫反射、镜面反射和环境光等
    CalcLightMVP(translate: ReadonlyVec3, scale: ReadonlyVec3) {
        const lightMVP = mat4.create();
        const modelMatrix = mat4.create();
        const viewMatrix = mat4.create();
        const projectionMatrix = mat4.create();

        // 1. Model transform（模型变换）
        // mat4.translate(输出矩阵，输入矩阵，变换矩阵)
        mat4.translate(modelMatrix, modelMatrix, translate);
        mat4.scale(modelMatrix, modelMatrix, scale);

        // 2. View transform（视图变换）
        mat4.lookAt(viewMatrix, this.lightPos, this.focalPoint, this.lightUp);

        // 3. Projection transform（投影变换）
        // 这些参数决定阴影的分辨率
        const left = -100.0;
        const right = 100.0;
        const bottom = -100.0;
        const top = 100.0;
        // near和far代表的是距离
        const near = 1e-2;
        const far = 500.0;
        // 正交投影
        mat4.ortho(projectionMatrix, left, right, bottom, top, near, far);

        // MVP矩阵
        mat4.multiply(lightMVP, projectionMatrix, viewMatrix);
        mat4.multiply(lightMVP, lightMVP, modelMatrix);

        return lightMVP;
    }

    CalcShadingDirection() {
        if (!this.lightDir) {
            console.error("missing lightDir!");
            return;
        }
        const lightDir = [-this.lightDir["x"], -this.lightDir["y"], -this.lightDir["z"]];
        return lightDir;
    }

    // 视图投影矩阵（VP矩阵）用于计算阴影效果
    CalcLightVP() {
        if (!this.lightDir) {
            console.error("missing lightDir!");
            return;
        }

        let lightVP = mat4.create();
        let viewMatrix = mat4.create();
        let projectionMatrix = mat4.create();

        // View transform
        // const focalPoint: ReadonlyVec3 = [
        //     this.lightDir["x"] + this.lightPos[0],
        //     this.lightDir["y"] + this.lightPos[1],
        //     this.lightDir["z"] + this.lightPos[2],
        // ];
        //
        mat4.lookAt(viewMatrix, this.lightPos, this.focalPoint, this.lightUp);
        // Projection transform
        mat4.ortho(projectionMatrix, -10, 10, -10, 10, 1e-2, 1000);
        // VP transform
        mat4.multiply(lightVP, projectionMatrix, viewMatrix);

        return lightVP;
    }
}
