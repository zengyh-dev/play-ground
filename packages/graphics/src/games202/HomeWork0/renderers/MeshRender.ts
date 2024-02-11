import { ReadonlyMat4, mat4 } from "gl-matrix";
import { WebGLRenderingContextExtend } from "../../../canvas/interface";
import { Mesh } from "../Objects/Mesh";
import { Material } from "../Materials/Materials";
import { TRSTransform } from "./WebGLRenderer";
import { Texture } from "../Textures/Texture";

export class MeshRender {
    #vertexBuffer;
    #normalBuffer;
    #texcoordBuffer;
    #indicesBuffer;
    gl;
    mesh;
    material;
    shader;
    constructor(gl: WebGLRenderingContextExtend, mesh: Mesh, material: Material) {
        this.gl = gl;
        this.mesh = mesh;
        this.material = material;

        this.#vertexBuffer = gl.createBuffer();
        this.#normalBuffer = gl.createBuffer();
        this.#texcoordBuffer = gl.createBuffer();
        this.#indicesBuffer = gl.createBuffer();

        const extraAttribs = [];
        if (mesh.vertices) {
            extraAttribs.push(mesh.verticesName);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.#vertexBuffer);

            gl.bufferData(gl.ARRAY_BUFFER, mesh.vertices, gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        }

        if (mesh.normals) {
            extraAttribs.push(mesh.normalsName);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.#normalBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, mesh.normals, gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        }

        if (mesh.texcoords) {
            extraAttribs.push(mesh.texcoordsName);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.#texcoordBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, mesh.texcoords, gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.#indicesBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.indices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        this.material.setMeshAttribs(extraAttribs as string[]);
        this.shader = this.material.compile(gl);
    }

    draw(camera: THREE.Camera, transform: TRSTransform) {
        const gl = this.gl;

        const modelViewMatrix = mat4.create();
        const projectionMatrix = mat4.create();

        camera.updateMatrixWorld();
        mat4.invert(modelViewMatrix, camera.matrixWorld.elements as unknown as ReadonlyMat4);
        mat4.translate(modelViewMatrix, modelViewMatrix, transform.translate);
        mat4.scale(modelViewMatrix, modelViewMatrix, transform.scale);
        mat4.copy(projectionMatrix, camera.projectionMatrix.elements as unknown as ReadonlyMat4);

        if (this.mesh.verticesName) {
            const numComponents = 3;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.#vertexBuffer);
            gl.vertexAttribPointer(
                this.shader.program.attribs[this.mesh.verticesName],
                numComponents,
                type,
                normalize,
                stride,
                offset
            );
            gl.enableVertexAttribArray(this.shader.program.attribs[this.mesh.verticesName]);
        }

        if (this.mesh.normalsName) {
            const numComponents = 3;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.#normalBuffer);
            gl.vertexAttribPointer(
                this.shader.program.attribs[this.mesh.normalsName],
                numComponents,
                type,
                normalize,
                stride,
                offset
            );
            gl.enableVertexAttribArray(this.shader.program.attribs[this.mesh.normalsName]);
        }

        if (this.mesh.texcoordsName) {
            const numComponents = 2;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.#texcoordBuffer);
            gl.vertexAttribPointer(
                this.shader.program.attribs[this.mesh.texcoordsName],
                numComponents,
                type,
                normalize,
                stride,
                offset
            );
            gl.enableVertexAttribArray(this.shader.program.attribs[this.mesh.texcoordsName]);
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.#indicesBuffer);

        gl.useProgram(this.shader.program.glShaderProgram);

        gl.uniformMatrix4fv(this.shader.program.uniforms.uProjectionMatrix, false, projectionMatrix);
        gl.uniformMatrix4fv(this.shader.program.uniforms.uModelViewMatrix, false, modelViewMatrix);

        // Specific the camera uniforms
        gl.uniform3fv(this.shader.program.uniforms.uCameraPos, [
            camera.position.x,
            camera.position.y,
            camera.position.z,
        ]);

        for (const k in this.material.uniforms) {
            if (this.material.uniforms[k].type == "matrix4fv") {
                gl.uniformMatrix4fv(
                    this.shader.program.uniforms[k],
                    false,
                    this.material.uniforms[k].value as Iterable<number>
                );
            } else if (this.material.uniforms[k].type == "3fv") {
                gl.uniform3fv(this.shader.program.uniforms[k], this.material.uniforms[k].value as Iterable<number>);
            } else if (this.material.uniforms[k].type == "1f") {
                gl.uniform1f(this.shader.program.uniforms[k], this.material.uniforms[k].value as number);
            } else if (this.material.uniforms[k].type == "1i") {
                gl.uniform1i(this.shader.program.uniforms[k], this.material.uniforms[k].value as number);
            } else if (this.material.uniforms[k].type == "texture") {
                const texture = this.material.uniforms[k].value as Texture;
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, texture.texture);
                gl.uniform1i(this.shader.program.uniforms[k], 0);
            }
        }

        {
            const vertexCount = this.mesh.count;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }
    }
}
