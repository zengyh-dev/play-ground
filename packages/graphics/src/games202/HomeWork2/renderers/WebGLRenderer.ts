import { ReadonlyVec3, mat4 } from "gl-matrix";
import { WebGLRenderingContextExtend } from "../../../canvas/interface";
import { MeshRender } from './MeshRender';
import { DirectionalLight } from "../Lights/DirectionalLight";
import { WebglProgram } from "../Shaders/Shader";
// import { EmissiveMaterial } from "../Lights/Light";
import { PointLight } from "../Lights/PointLight";
import { getMat3ValueFromRGB } from "../utils";
import { guiParams, precomputeL } from "../utils/constant";

interface RendererLight {
    entity: DirectionalLight | PointLight;
    meshRender: MeshRender;
}

// Remain rotatation
export class TRSTransform {
    translate: ReadonlyVec3;
    scale: ReadonlyVec3;
    constructor(translate: ReadonlyVec3 = [0, 0, 0], scale: ReadonlyVec3 = [1, 1, 1]) {
        this.translate = translate;
        this.scale = scale;
    }
}

export class WebGLRenderer {
    meshes: MeshRender[] = [];
    lights: RendererLight[] = [];
    shadowMeshes: MeshRender[] = [];
    gl;
    camera;
    precomputeL: any;

    constructor(gl: WebGLRenderingContextExtend, camera: THREE.Camera) {
        this.gl = gl;
        console.log("camera", camera);
        this.camera = camera;
    }

    addLight(light: DirectionalLight | PointLight) {
        console.log("lights", light);
        this.lights.push({ entity: light, meshRender: new MeshRender(this.gl, light.mesh, light.mat) });
    }

    addMeshRender(mesh: MeshRender) {
        this.meshes.push(mesh);
    }

    addShadowMeshRender(mesh: MeshRender) {
        this.shadowMeshes.push(mesh);
    }

    addPrecomputeL(precomputeL: any) {
        this.precomputeL = precomputeL;
    }

    render() {
        const gl = this.gl;

        gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
        gl.clearDepth(1.0); // Clear everything
        gl.enable(gl.DEPTH_TEST); // Enable depth testing
        gl.depthFunc(gl.LEQUAL); // Near things obscure far things
        // gl.enable(gl.CULL_FACE); // 消隐功能，不再绘制背面，提高绘制速度（理想情况是两倍）

        console.assert(this.lights.length != 0, "No light");
        console.assert(this.lights.length == 1, "Multiple lights");

        for (let l = 0; l < this.lights.length; l++) {
            // Draw light
            // TODO: Support all kinds of transform
            this.lights[l].meshRender.mesh.transform.translate = this.lights[l].entity.lightPos;
            this.lights[l].meshRender.draw(this.camera);

            // Shadow pass
            if (this.lights[l].entity.hasShadowMap == true) {
                for (let i = 0; i < this.shadowMeshes.length; i++) {
                    this.shadowMeshes[i].draw(this.camera);
                }
            }

            // Camera pass
            for (let i = 0; i < this.meshes.length; i++) {
                const shaderProgram = this.meshes[i].shader.program as WebglProgram;
                this.gl.useProgram(shaderProgram.glShaderProgram);
                this.gl.uniform3fv(shaderProgram.uniforms.uLightPos, this.lights[l].entity.lightPos);

                const colorMat3 = getMat3ValueFromRGB(precomputeL[guiParams.envmapId]);
                for (let key in this.meshes[i].material.uniforms) {

                    const cameraModelMatrix = mat4.create();
                    //mat4.fromRotation(cameraModelMatrix, timer, [0, 1, 0]);

                    // const precomputeLMat3 = getMat3ValueFromRGB(this.precomputeL[guiParams.envmapId]);
                    // console.log('🔥precomputeMat3', precomputeLMat3);
                    if (key == 'uMoveWithCamera') { // The rotation of the skybox
                        gl.uniformMatrix4fv(
                            shaderProgram.uniforms[key],
                            false,
                            cameraModelMatrix);
                    }

                    // 在渲染循环中给材质设置precomputeL实时的值
                    // Bonus - Fast Spherical Harmonic Rotation 每一帧都要重新赋值
                    // let Mat3Value = getMat3ValueFromRGB(precomputeL[guiParams.envmapId])
                    for (let j = 0; j < 3; j++) {
                        if (key == `uPrecomputeL[${j}]`) {
                            gl.uniformMatrix3fv(
                                shaderProgram.uniforms[key],
                                false,
                                colorMat3[j]);
                        }
                    }

                    // Bonus - Fast Spherical Harmonic Rotation
                    // let precomputeL_RGBMat3 = getRotationPrecomputeL(precomputeL[guiParams.envmapId], cameraModelMatrix);
                }

                this.meshes[i].draw(this.camera);
            }
        }
    }
}
