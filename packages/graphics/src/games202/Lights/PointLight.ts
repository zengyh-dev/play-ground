import { Mesh } from "../Objects/Mesh";
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
    constructor(lightIntensity: number, lightColor: number[]) {
        this.mesh = Mesh.cube();
        this.mat = new EmissiveMaterial(lightIntensity, lightColor);
    }
}
