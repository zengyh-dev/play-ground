import * as THREE from "three";
// import { MeshRender } from "../Re";
import { MeshRender } from "../Renderers/MeshRenderer";
// import { Material } from "../Materials/Materials";
// import texture from "../../../../assets/mary/MC003_Kozakura_Mari.png";
import { MTLLoader, OBJLoader } from "obj-mtl-loader-three";
import { Mesh, Transform } from "../Objects/Mesh";
import { Texture } from "../Textures/Texture";

// import VertexShader from "../Shaders/PhongShader/vertex.vert";
// import FragmentShader from "../Shaders/PhongShader/fragment.frag";
import { WebGLRenderer } from "../Renderers/WebGLRenderer";

import { PhongMaterial } from "../Materials/PhongMaterial";
// import { ShadowMaterial } from "../Materials/ShadowMaterial";

import phongFragment from "../Shaders/PhongShader/Phong.frag";
import phongVertex from "../Shaders/PhongShader/Phong.vert";

// import shadowFragment from "../Shaders/shadowShader/shadowFragment.frag";
// import shadowVertex from "../Shaders/shadowShader/shadowVertex.vert";
import SkyBoxFragment from "../Shaders/SkyBoxShader/SkyBox.frag";
import SkyBoxVertex from "../Shaders/SkyBoxShader/SkyBox.vert";

import PRTFragment from "../Shaders/PRTShader/PRT.frag";
import PRTVertex from "../Shaders/PRTShader/PRT.vert";

import { ReadonlyVec3 } from "gl-matrix";
import { SkyBoxMaterial } from "../Materials/SkyBoxMaterial";
import { PRTMaterial } from "../Materials/PRTMaterial";

// console.log(texture);

export const loadOBJ = (
    renderer: WebGLRenderer,
    path: string,
    name: string,
    objMaterial: string,
    transform: Transform
) => {
    console.log("🔥load obj", path, name, objMaterial);

    const manager = new THREE.LoadingManager();
    manager.onProgress = function (item: any, loaded: any, total: any) {
        console.log(item, loaded, total);
    };

    function onProgress(xhr: ProgressEvent) {
        if (xhr.lengthComputable) {
            const percentComplete = (xhr.loaded / xhr.total) * 100;
            console.log("model " + Math.round(percentComplete) + "% downloaded");
        }
    }
    function onError(error: any) {
        console.log("😭load error", error);
    }

    const curPath = new URL(path, import.meta.url).href;
    console.log("🔥path", curPath);
    new MTLLoader(manager).setPath(curPath).load(name + ".mtl", function (materials: any) {
        materials.preload();
        new OBJLoader(manager)
            .setMaterials(materials)
            .setPath(curPath)
            .load(
                name + ".obj",
                function (object: any) {
                    object.traverse(function (child: any) {
                        if (child.isMesh) {
                            const geo = child.geometry;
                            let mat;
                            if (Array.isArray(child.material)) mat = child.material[0];
                            else mat = child.material;

                            const indices = Array.from({ length: geo.attributes.position.count }, (_, k) => k);
                            const mesh = new Mesh(
                                { name: "aVertexPosition", array: geo.attributes.position.array },
                                { name: "aNormalPosition", array: geo.attributes.normal.array },
                                // { name: "aTextureCoord", array: geo.attributes.uv.array },
                                null,
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
                                    break;
                                case "SkyBoxMaterial":
                                    material = new SkyBoxMaterial(SkyBoxVertex, SkyBoxFragment);
                                    break;
                                case "PRTMaterial":
                                    // console.log('renderer.precomputeL: '+ renderer.precomputeL);
                                    material = new PRTMaterial(PRTVertex, PRTFragment);
                                    break;
                            }

                            if (material) {
                                console.log("🔥add material", material);
                                const meshRender = new MeshRender(renderer.gl, mesh, material);
                                renderer.addMeshRender(meshRender);
                            }

                            if (shadowMaterial) {
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
