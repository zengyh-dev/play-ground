import { ReadonlyVec3 } from "gl-matrix";
import { WebGLRenderingContextExtend } from "../../../canvas/interface";
import { Mesh } from "../Objects/Mesh";
import { FBO } from "../Textures/FBO";
import { setTransform } from "../utils/utils";
import { EmissiveMaterial } from "./Light";

export class PointLight {
    /**
     * Creates an instance of PointLight.
     * @param {float} lightIntensity  The intensity of the PointLight.
     * @param {vec3f} lightColor The color of the PointLight.
     * @memberof PointLight
     */
    public mesh;
    public mat;
    public lightPos;
    hasShadowMap;
    fbo;

    constructor(lightIntensity: ReadonlyVec3, lightPos: ReadonlyVec3, hasShadowMap: boolean, gl: WebGLRenderingContextExtend) {
        this.mesh = Mesh.cube(setTransform(0, 0, 0, 0.2, 0.2, 0.2));
        this.mat = new EmissiveMaterial(lightIntensity);
        this.lightPos = lightPos;

        this.hasShadowMap = hasShadowMap;
        this.fbo = new FBO(gl);
        if (!this.fbo) {
            console.log("无法设置帧缓冲区对象");
            return;
        }
    }
}
