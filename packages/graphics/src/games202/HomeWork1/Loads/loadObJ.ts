import * as THREE from "three";
import { MeshRender } from "../renderers/MeshRender";
// import { Material } from "../Materials/Materials";
import { MTLLoader, OBJLoader } from "obj-mtl-loader-three";
import { Mesh, Transform } from "../Objects/Mesh";
import { Texture } from "../Textures/Texture";

// import VertexShader from "../Shaders/PhongShader/vertex.vert";
// import FragmentShader from "../Shaders/PhongShader/fragment.frag";
import { WebGLRenderer } from "../renderers/WebGLRenderer";
import texture from "../assets/mary/MC003_Kozakura_Mari.png";
import { PhongMaterial } from "../Materials/PhongMaterial";
import { ShadowMaterial } from "../Materials/ShadowMaterial";

import phongFragment from "../Shaders/PhongShader/phongFragment.frag";
import phongVertex from "../Shaders/PhongShader/phongVertex.vert";

import shadowFragment from "../Shaders/shadowShader/shadowFragment.frag";
import shadowVertex from "../Shaders/shadowShader/shadowVertex.vert";
import { ReadonlyVec3 } from "gl-matrix";

console.log(texture);

export const loadOBJ = (
    renderer: WebGLRenderer,
    path: string,
    name: string,
    objMaterial: string,
    transform: Transform
) => {
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
    function onError() { }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new MTLLoader(manager).setPath(path).load(name + ".mtl", function (materials: any) {
        materials.preload();
        new OBJLoader(manager)
            .setMaterials(materials)
            .setPath(path)
            .load(
                name + ".obj",
                function (object) {
                    object.traverse(function (child) {
                        if (child.isMesh) {
                            const geo = child.geometry;
                            let mat;
                            if (Array.isArray(child.material)) mat = child.material[0];
                            else mat = child.material;

                            const indices = Array.from({ length: geo.attributes.position.count }, (_, k) => k);
                            const mesh = new Mesh(
                                { name: "aVertexPosition", array: geo.attributes.position.array },
                                { name: "aNormalPosition", array: geo.attributes.normal.array },
                                { name: "aTextureCoord", array: geo.attributes.uv.array },
                                indices,
                                transform
                            );

                            const colorMap = new Texture();
                            if (mat.map != null) {
                                colorMap.CreateImageTexture(renderer.gl, mat.map.image);
                            } else {
                                colorMap.CreateConstantTexture(renderer.gl, mat.color.toArray());
                            }

                            let material, shadowMaterial;
                            const Translation: ReadonlyVec3 = [
                                transform.modelTransX,
                                transform.modelTransY,
                                transform.modelTransZ,
                            ];
                            const Scale: ReadonlyVec3 = [
                                transform.modelScaleX,
                                transform.modelScaleY,
                                transform.modelScaleZ,
                            ];

                            const light = renderer.lights[0].entity;
                            switch (objMaterial) {
                                case "PhongMaterial":
                                    material = new PhongMaterial(
                                        colorMap,
                                        mat.specular.toArray(),
                                        light,
                                        Translation,
                                        Scale,
                                        phongVertex,
                                        phongFragment
                                    );
                                    shadowMaterial = new ShadowMaterial(
                                        light,
                                        Translation,
                                        Scale,
                                        shadowVertex,
                                        shadowFragment
                                    );
                                    break;
                            }

                            if (material && shadowMaterial) {
                                console.log('🔥add material', material);
                                const meshRender = new MeshRender(renderer.gl, mesh, material);
                                renderer.addMeshRender(meshRender);

                                const shadowMeshRender = new MeshRender(renderer.gl, mesh, shadowMaterial);
                                renderer.addShadowMeshRender(shadowMeshRender);
                            }
                        }
                    });
                },
                onProgress,
                onError
            );
    });
};
