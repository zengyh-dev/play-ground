import { WebGLRenderingContextExtend } from "../../../canvas/interface";
import { Mesh } from "../Objects/Mesh";
import { FBO } from "../Textures/FBO";
import { setTransform } from "../engine";
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
    hasShadowMap;
    fbo;

    constructor(lightIntensity: number, lightColor: number[], hasShadowMap: boolean, gl: WebGLRenderingContextExtend) {
        this.mesh = Mesh.cube(setTransform(0, 0, 0, 0.2, 0.2, 0.2));
        this.mat = new EmissiveMaterial(lightIntensity, lightColor);

        this.hasShadowMap = hasShadowMap;
        this.fbo = new FBO(gl);
        if (!this.fbo) {
            console.log("无法设置帧缓冲区对象");
            return;
        }
    }
}
