import { ReadonlyVec3 } from "gl-matrix";
import { WebGLRenderingContextExtend } from "../../../canvas/interface";
import { MeshRender } from "./MeshRender";
import { DirectionalLight } from "../Lights/DirectionalLight";

interface RendererLight {
    entity: DirectionalLight;
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

    constructor(gl: WebGLRenderingContextExtend, camera: THREE.Camera) {
        this.gl = gl;
        console.log("camera", camera);
        this.camera = camera;
    }

    addLight(light: DirectionalLight) {
        console.log("lightsssss", light);
        this.lights.push({ entity: light, meshRender: new MeshRender(this.gl, light.mesh, light.mat) });
    }

    addMeshRender(mesh: MeshRender) {
        this.meshes.push(mesh);
    }

    addShadowMeshRender(mesh: MeshRender) {
        this.shadowMeshes.push(mesh);
    }

    render() {
        const gl = this.gl;

        gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
        gl.clearDepth(1.0); // Clear everything
        gl.enable(gl.DEPTH_TEST); // Enable depth testing
        gl.depthFunc(gl.LEQUAL); // Near things obscure far things

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
                this.gl.useProgram(this.meshes[i].shader.program.glShaderProgram);
                this.gl.uniform3fv(this.meshes[i].shader.program.uniforms.uLightPos, this.lights[l].entity.lightPos);
                this.meshes[i].draw(this.camera);
            }
        }
    }
}
