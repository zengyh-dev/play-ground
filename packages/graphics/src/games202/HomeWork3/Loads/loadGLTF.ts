import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { WebGLRenderer } from "../Renderers/WebGLRenderer";

import { Texture } from "../Textures/Texture";
import { Mesh } from "../Objects/Mesh";
import { setTransform } from "../utils";

import { MeshRender } from "../Renderers/MeshRenderer";

import { DirectionalLight } from "../Lights/DirectionalLight";

import { SSRMaterial } from "../Materials/SSRMaterial";
import { ShadowMaterial } from "../Materials/ShadowMaterial";
import { GBufferMaterial } from "../Materials/GBufferMaterial";

import SSRFragment from "../Shaders/SSRShader/SSR.frag";
import SSRVertx from "../Shaders/SSRShader/SSR.vert";

import shadowFragment from "../Shaders/ShadowShader/Shadow.frag";
import shadowVertex from "../Shaders/ShadowShader/Shadow.vert";

import gBufferFragment from "../Shaders/G-BufferShader/G_buffer.frag";
import gBufferVertex from "../Shaders/G-BufferShader/G_buffer.vert";

export const loadGLTF = (renderer: WebGLRenderer, path: string, name: string, materialName: string) => {
    const manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
    };

    function onProgress(xhr: ProgressEvent) {
        if (xhr.lengthComputable) {
            const percentComplete = (xhr.loaded / xhr.total) * 100;
            console.log("model " + Math.round(percentComplete) + "% downloaded");
        }
    }
    function onError(error: any) {
        console.error(error);
    }

    const curPath = new URL(path, import.meta.url).href;
    new GLTFLoader(manager).setPath(curPath).load(
        name + ".gltf",
        function (gltf) {
            gltf.scene.traverse(function (child: any) {
                if (child.isMesh) {
                    let geo = child.geometry;
                    let mat;
                    if (Array.isArray(child.material)) mat = child.material[0];
                    else mat = child.material;
                    const gltfTransform = setTransform(
                        child.position.x,
                        child.position.y,
                        child.position.z,
                        child.scale.x,
                        child.scale.y,
                        child.scale.z,
                        child.rotation.x,
                        child.rotation.y,
                        child.rotation.z
                    );
                    // const indices = Array.from({ length: geo.attributes.position.count }, (v, k) => k);
                    let mesh = new Mesh(
                        { name: "aVertexPosition", array: geo.attributes.position.array },
                        { name: "aNormalPosition", array: geo.attributes.normal.array },
                        { name: "aTextureCoord", array: geo.attributes.uv.array },
                        geo.index.array,
                        gltfTransform
                    );

                    // 漫反射贴图
                    const diffuseMap = new Texture();
                    if (mat.map != null) {
                        diffuseMap.CreateImageTexture(renderer.gl, mat.map.image);
                    } else {
                        diffuseMap.CreateConstantTexture(renderer.gl, mat.color.toArray(), true);
                    }

                    // 镜面反射贴图
                    const specularMap = new Texture();
                    specularMap.CreateConstantTexture(renderer.gl, [0, 0, 0]);

                    // 法线贴图
                    const normalMap = new Texture();
                    if (mat.normalMap != null) {
                        normalMap.CreateImageTexture(renderer.gl, mat.normalMap.image);
                    } else {
                        normalMap.CreateConstantTexture(renderer.gl, [0.5, 0.5, 1], false);
                    }

                    const light = renderer.lights[0].entity as DirectionalLight;

                    let material, shadowMaterial, bufferMaterial;
                    switch (materialName) {
                        case "SSRMaterial":
                            material = new SSRMaterial(light, renderer.camera, SSRVertx, SSRFragment);

                            shadowMaterial = new ShadowMaterial(light, shadowVertex, shadowFragment);

                            bufferMaterial = new GBufferMaterial(
                                diffuseMap,
                                normalMap,
                                light,
                                renderer.camera,
                                gBufferVertex,
                                gBufferFragment
                            );
                            break;
                    }

                    if (material) {
                        console.log("🔥add material", material);
                        const meshRender = new MeshRender(renderer.gl, mesh, material);
                        renderer.addMeshRender(meshRender);
                    }

                    if (shadowMaterial) {
                        console.log("🔥add shadowMaterial", material);
                        const shadowMeshRender = new MeshRender(renderer.gl, mesh, shadowMaterial);
                        renderer.addShadowMeshRender(shadowMeshRender);
                    }

                    if (bufferMaterial) {
                        console.log("🔥add bufferMaterial", material);
                        const bufferMeshRender = new MeshRender(renderer.gl, mesh, bufferMaterial);
                        renderer.addBufferMeshRender(bufferMeshRender);
                    }
                }
            });
        },
        onProgress,
        onError
    );
};
