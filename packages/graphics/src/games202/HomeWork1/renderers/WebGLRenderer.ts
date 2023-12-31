import { ReadonlyVec3 } from "gl-matrix";
import { WebGLRenderingContextExtend } from "../../../canvas/interface";
import { EmissiveMaterial } from "../Lights/Light";
import { Mesh } from "../Objects/Mesh";
import { MeshRender } from "./MeshRender";

interface Light {
    mat: EmissiveMaterial;
    mesh: Mesh;
}
interface RendererLight {
    entity: Light;
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
    gl;
    camera;

    constructor(gl: WebGLRenderingContextExtend, camera: THREE.Camera) {
        this.gl = gl;
        console.log("camera", camera);
        this.camera = camera;
    }

    addLight(light: { mat: EmissiveMaterial; mesh: Mesh }) {
        console.log("lightsssss", light);
        this.lights.push({ entity: light, meshRender: new MeshRender(this.gl, light.mesh, light.mat) });
    }

    addMesh(mesh: MeshRender) {
        this.meshes.push(mesh);
    }

    render(guiParams: {
        modelTransX: number;
        modelTransY: number;
        modelTransZ: number;
        modelScaleX: number;
        modelScaleY: number;
        modelScaleZ: number;
    }) {
        const gl = this.gl;

        gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
        gl.clearDepth(1.0); // Clear everything
        gl.enable(gl.DEPTH_TEST); // Enable depth testing
        gl.depthFunc(gl.LEQUAL); // Near things obscure far things

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Handle light
        const timer = Date.now() * 0.00025;
        const lightPos: ReadonlyVec3 = [
            Math.sin(timer * 6) * 100,
            Math.cos(timer * 4) * 150,
            Math.cos(timer * 2) * 100,
        ];

        if (this.lights.length != 0) {
            for (let l = 0; l < this.lights.length; l++) {
                const trans = new TRSTransform(lightPos);
                this.lights[l].meshRender.draw(this.camera, trans);

                for (let i = 0; i < this.meshes.length; i++) {
                    const mesh = this.meshes[i];

                    const modelTranslation: ReadonlyVec3 = [
                        guiParams.modelTransX,
                        guiParams.modelTransY,
                        guiParams.modelTransZ,
                    ];
                    const modelScale: ReadonlyVec3 = [
                        guiParams.modelScaleX,
                        guiParams.modelScaleY,
                        guiParams.modelScaleZ,
                    ];
                    const meshTrans = new TRSTransform(modelTranslation, modelScale);

                    this.gl.useProgram(mesh.shader.program.glShaderProgram);
                    // WebGLProgram#getUniforms getUniforms() instead.
                    const uLightPos = this.gl.getUniformLocation(
                        mesh.shader.program.glShaderProgram as WebGLProgram,
                        "uLightPos"
                    );
                    this.gl.uniform3fv(uLightPos, lightPos);
                    // console.log("hhh", mesh.shader.program);
                    // this.gl.uniform3fv(mesh.shader.program.uniforms.uLightPos, lightPos);
                    mesh.draw(this.camera, meshTrans);
                }
            }
        } else {
            // Handle mesh(no light)
            for (let i = 0; i < this.meshes.length; i++) {
                const mesh = this.meshes[i];
                const trans = new TRSTransform();
                mesh.draw(this.camera, trans);
            }
        }
    }
}
