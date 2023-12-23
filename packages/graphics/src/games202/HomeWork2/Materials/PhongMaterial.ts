import { Material } from "./Materials";
import { DirectionalLight } from "../Lights/DirectionalLight";
import { Texture } from "../Textures/Texture";

export class PhongMaterial extends Material {
    /**
     * Creates an instance of PhongMaterial.
     * @param {vec3f} color The material color
     * @param {Texture} colorMap The texture object of the material
     * @param {vec3f} specular The material specular coefficient
     * @param {float} intensity The light intensity
     * @memberof PhongMaterial
     */

    constructor(
        color: Texture,
        specular: number[],
        light: DirectionalLight,
        translate,
        scale,
        vertexShader: string,
        fragmentShader: string
    ) {
        const lightMVP = light.CalcLightMVP(translate, scale);
        const lightIntensity = light.mat.GetIntensity();

        super(
            {
                // Phong
                uSampler: { type: "texture", value: color },
                uKs: { type: "3fv", value: specular },
                uLightIntensity: { type: "3fv", value: lightIntensity },
                // Shadow
                uShadowMap: { type: "texture", value: light.fbo },
                uLightMVP: { type: "matrix4fv", value: lightMVP },
            },
            [],
            vertexShader,
            fragmentShader
        );
    }
}
