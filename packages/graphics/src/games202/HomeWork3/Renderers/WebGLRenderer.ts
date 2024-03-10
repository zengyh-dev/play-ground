import { ReadonlyVec3 } from "gl-matrix";
import { WebGL2RenderingContextExtend } from "../../../canvas/interface";

import { DirectionalLight } from "../Lights/DirectionalLight";
// import { EmissiveMaterial } from "../Lights/Light";
import { PointLight } from "../Lights/PointLight";
// import { getMat3ValueFromRGB, getRotationPrecomputeL } from "../utils";
import { mipMapLevel } from "../utils/constant";
import { MeshRender } from "./MeshRenderer";
import { ExtendedFramebuffer, PerspectiveCamera } from "../interface";

interface RendererLight {
    entity: DirectionalLight | PointLight;
    meshRender: MeshRender;
}

// Remain rotatation
export class TRSTransform {
    translate: ReadonlyVec3;
    scale: ReadonlyVec3;
    rotate: ReadonlyVec3;
    constructor(
        translate: ReadonlyVec3 = [0, 0, 0],
        scale: ReadonlyVec3 = [1, 1, 1],
        rotate: ReadonlyVec3 = [0, 0, 0]
    ) {
        this.translate = translate;
        this.scale = scale;
        this.rotate = rotate;
    }
}

export class WebGLRenderer {
    meshes: MeshRender[] = [];
    lights: RendererLight[] = [];
    shadowMeshes: MeshRender[] = [];
    bufferMeshes: MeshRender[] = [];
    gl;
    camera: PerspectiveCamera;
    depthFBOs: ExtendedFramebuffer[] = [];
    depthMeshRender: MeshRender | null = null;

    constructor(gl: WebGL2RenderingContextExtend, camera: PerspectiveCamera) {
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

    addBufferMeshRender(mesh: MeshRender) {
        this.bufferMeshes.push(mesh);
    }

    addDepthFBO(fbo: ExtendedFramebuffer) {
        this.depthFBOs.push(fbo);
    }

    addDepthMeshRender(mesh: MeshRender) {
        this.depthMeshRender = mesh;
    }

    render() {
        console.assert(this.lights.length != 0, "No light");
        console.assert(this.lights.length == 1, "Multiple lights");

        const gl = this.gl;

        gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
        gl.clearDepth(1.0); // Clear everything
        gl.enable(gl.DEPTH_TEST); // Enable depth testing

        // 指定将输入像素深度与当前深度缓冲区值进行比较的函数
        // LEQUAL: LESS && EQUAL 小于等于深度缓冲区值则通过
        gl.depthFunc(gl.LEQUAL); // Near things obscure far things

        // gl.enable(gl.CULL_FACE); // 消隐功能，不再绘制背面，提高绘制速度（理想情况是两倍）

        // 清除WebGL绘图上下文中的颜色缓冲区和深度缓冲区的内容
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // 更新灯光参数
        const light = this.lights[0];
        const lightVP = (light.entity as DirectionalLight).CalcLightVP();
        const lightDir = (light.entity as DirectionalLight).CalcShadingDirection();
        const updatedParamters: { [key: string]: any } = {
            uLightVP: lightVP,
            uLightDir: lightDir,
        };

        // Draw light
        light.meshRender.mesh.transform.translate = light.entity.lightPos;
        light.meshRender.draw(this.camera, null, updatedParamters);

        // Shadow pass
        gl.bindFramebuffer(gl.FRAMEBUFFER, light.entity.fbo);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        for (let i = 0; i < this.shadowMeshes.length; i++) {
            this.shadowMeshes[i].draw(this.camera, light.entity.fbo, updatedParamters);
            // this.shadowMeshes[i].draw(this.camera);
        }

        // Buffer pass
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.camera.fbo);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        for (let i = 0; i < this.bufferMeshes.length; i++) {
            this.bufferMeshes[i].draw(this.camera, this.camera.fbo, updatedParamters);
            // this.bufferMeshes[i].draw(this.camera);
        }

        // Depth Mipmap pass
        for (let lv = 0; lv < this.depthFBOs.length && this.depthMeshRender != null; lv++) {
            if (!this.depthMeshRender.shader.program) {
                console.error("no depthMeshRender.shader.program");
                return;
            }

            gl.useProgram(this.depthMeshRender.shader.program.glShaderProgram);
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.depthFBOs[lv]);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            const mipMapUpdatedParamters: { [key: string]: any } = {
                uLastMipLevel: lv - 1,
                uLastMipSize: [this.depthFBOs[lv].lastWidth, this.depthFBOs[lv].lastHeight, 0],
                uCurLevel: lv,
            };

            if (lv != 0) {
                updatedParamters.uDepthMipMap = this.depthFBOs[lv - 1].textures[0];
            }

            this.depthMeshRender.bindGeometryInfo();
            this.depthMeshRender.updateMaterialParameters(mipMapUpdatedParamters);
            this.depthMeshRender.bindMaterialParameters();

            gl.viewport(0, 0, this.depthFBOs[lv].width, this.depthFBOs[lv].height);
            {
                const vertexCount = this.depthMeshRender.mesh.count;
                const type = gl.UNSIGNED_SHORT;
                const offset = 0;
                gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
            }
        }

        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        // Camera pass
        for (let i = 0; i < this.meshes.length; i++) {
            // Edit Start
            for (let lv = 0; lv < mipMapLevel; lv++) {
                if (this.depthFBOs.length > lv) {
                    updatedParamters["uDepthTexture" + "[" + lv + "]"] = this.depthFBOs[lv].textures[0];
                }
            }
            // Edit End
            this.meshes[i].draw(this.camera, null, updatedParamters);
        }
    }
}
