import { ReadonlyMat4, mat4 } from "gl-matrix";
import { WebGLRenderingContextExtend } from "../../../canvas/interface";
import { Mesh } from "../Objects/Mesh";
import { Material } from "../Materials/Materials";
import { Texture } from "../Textures/Texture";
import { resolution } from "../utils/constant";

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

        // 1. 创建缓冲区对象
        // 一次性地向着色器传入多个顶点的数据
        this.#vertexBuffer = gl.createBuffer();
        this.#normalBuffer = gl.createBuffer();
        this.#texcoordBuffer = gl.createBuffer();
        this.#indicesBuffer = gl.createBuffer();

        const extraAttribs = [];

        if (mesh.vertices) {
            extraAttribs.push(mesh.verticesName);
            // 2. 将缓冲区对象保存到目标上 （目标表示缓冲区对象的用途）
            // ARRAY_BUFFER：表示缓冲区对象包含了顶点的数据
            // 我们不能直接向缓冲区写入数据，只能向前面的“目标”写入数据，所以要先绑定到ARRAY_BUFFER
            gl.bindBuffer(gl.ARRAY_BUFFER, this.#vertexBuffer);

            // 3. 向ARRAY_BUFFER的缓冲区对象写入数据
            // STATIC_DRAW只会向缓冲区对象写入一次数据，但需要绘制很多次
            gl.bufferData(gl.ARRAY_BUFFER, mesh.vertices, gl.STATIC_DRAW);

            // buffer为null，表示禁用对target的绑定
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

    bindGeometryInfo() {
        const gl = this.gl;

        if (!this.shader.program) {
            return;
        }

        if (this.mesh.verticesName) {
            const numComponents = 3;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.#vertexBuffer);
            // 4. 将缓冲区对象分配给一个attribute变量
            gl.vertexAttribPointer(
                this.shader.program.attribs[this.mesh.verticesName],
                numComponents,
                type,
                normalize,
                stride,
                offset
            );
            // 5. 开启attribute变量
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
    }

    bindCameraParameters(camera: THREE.Camera) {
        const gl = this.gl;

        const modelMatrix = mat4.create();
        const viewMatrix = mat4.create();
        const projectionMatrix = mat4.create();
        // Model transform
        mat4.identity(modelMatrix);
        mat4.translate(modelMatrix, modelMatrix, this.mesh.transform.translate);
        mat4.scale(modelMatrix, modelMatrix, this.mesh.transform.scale);
        // View transform
        camera.updateMatrixWorld();
        mat4.invert(viewMatrix, camera.matrixWorld.elements as unknown as ReadonlyMat4);
        // mat4.lookAt(viewMatrix, cameraPosition, [0,0,0], [0,1,0]);
        // Projection transform
        mat4.copy(projectionMatrix, camera.projectionMatrix.elements as unknown as ReadonlyMat4);

        if (!this.shader.program) {
            return;
        }

        gl.uniformMatrix4fv(this.shader.program.uniforms.uProjectionMatrix, false, projectionMatrix);
        gl.uniformMatrix4fv(this.shader.program.uniforms.uModelMatrix, false, modelMatrix);
        gl.uniformMatrix4fv(this.shader.program.uniforms.uViewMatrix, false, viewMatrix);
        gl.uniform3fv(this.shader.program.uniforms.uCameraPos, [
            camera.position.x,
            camera.position.y,
            camera.position.z,
        ]);
    }

    bindMaterialParameters() {
        const gl = this.gl;

        let textureNum = 0;

        if (!this.shader.program) {
            return;
        }

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
                gl.activeTexture(gl.TEXTURE0 + textureNum);
                gl.bindTexture(gl.TEXTURE_2D, texture.texture);
                gl.uniform1i(this.shader.program.uniforms[k], textureNum);
                textureNum += 1;
            }
        }
    }

    draw(camera: THREE.Camera) {
        const gl = this.gl;

        // 如果为null，就会解除帧缓冲区的绑定
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.material.frameBuffer || null);

        // 为帧缓冲区准备
        if (this.material.frameBuffer != null) {
            // Shadow map
            gl.viewport(0.0, 0.0, resolution, resolution);
        } else {
            gl.viewport(0.0, 0.0, window.screen.width, window.screen.height);
        }

        if (!this.shader.program) {
            return;
        }

        // 7. 告知WebGL系统所使用的程序对象，可以在绘制的时候根据需要切换
        gl.useProgram(this.shader.program.glShaderProgram);

        // Bind geometry information
        this.bindGeometryInfo();

        // Bind Camera parameters
        this.bindCameraParameters(camera);

        // Bind material parameters
        this.bindMaterialParameters();

        // Draw
        {
            const vertexCount = this.mesh.count;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }
    }
}
