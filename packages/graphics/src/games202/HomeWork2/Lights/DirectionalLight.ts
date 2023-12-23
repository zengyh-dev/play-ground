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
        focalPoint: number[],
        lightUp: number[],
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

    CalcLightMVP(translate: number[], scale: number[]) {
        console.log(translate);
        console.log(scale);
        const lightMVP = mat4.create();
        const modelMatrix = mat4.create();
        const viewMatrix = mat4.create();
        const projectionMatrix = mat4.create();

        // Model transform

        // View transform

        // Projection transform

        mat4.multiply(lightMVP, projectionMatrix, viewMatrix);
        mat4.multiply(lightMVP, lightMVP, modelMatrix);

        return lightMVP;
    }
}
