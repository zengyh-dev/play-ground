import { ReadonlyVec3 } from "gl-matrix";
import { WebGL2RenderingContextExtend } from "../../../canvas/interface";
import { Mesh } from "../Objects/Mesh";
import { processFramebuffer, setTransform } from "../utils";
import { EmissiveMaterial } from "./Light";
import { ExtendedFramebuffer } from "../interface";

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
    public hasShadowMap;
    public fbo: ExtendedFramebuffer;

    constructor(
        lightIntensity: ReadonlyVec3,
        lightPos: ReadonlyVec3,
        hasShadowMap: boolean,
        gl: WebGL2RenderingContextExtend
    ) {
        this.mesh = Mesh.cube(setTransform(0, 0, 0, 0.2, 0.2, 0.2));
        this.mat = new EmissiveMaterial(lightIntensity);
        this.lightPos = lightPos;

        this.hasShadowMap = hasShadowMap;
        const pointLightFBO = gl.createFramebuffer() as ExtendedFramebuffer;
        processFramebuffer(pointLightFBO, gl, 5);
        this.fbo = pointLightFBO;
        if (!pointLightFBO) {
            console.error("无帧缓冲区对象: directionalLightFBO");
            return;
        }
    }
}
