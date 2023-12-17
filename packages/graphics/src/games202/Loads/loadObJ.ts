import * as THREE from "three";
import { MeshRender } from "../renderers/MeshRender";
import { Material } from "../Materials/Materials";
import { MTLLoader, OBJLoader } from "obj-mtl-loader-three";
import { Mesh } from "../Objects/Mesh";
import { Texture } from "../Textures/Texture";

import VertexShader from "../Shaders/PhongShader/vertex.glsl";
import FragmentShader from "../Shaders/PhongShader/fragment.glsl";
import { WebGLRenderer } from "../renderers/WebGLRenderer";
import texture from "../../../assets/mary/MC003_Kozakura_Mari.png";

console.log(texture);

export const loadOBJ = (renderer: WebGLRenderer, path: string, name: string) => {
    const manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
    };

    function onProgress(xhr) {
        if (xhr.lengthComputable) {
            const percentComplete = (xhr.loaded / xhr.total) * 100;
            console.log("model " + Math.round(percentComplete, 2) + "% downloaded");
        }
    }
    function onError() {}

    new MTLLoader(manager).setPath(path).load(name + ".mtl", function (materials) {
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
                            if (Array.isArray(child.material)) {
                                mat = child.material[0];
                            } else {
                                mat = child.material;
                            }

                            const indices = Array.from({ length: geo.attributes.position.count }, (v, k) => k);
                            const mesh = new Mesh(
                                { name: "aVertexPosition", array: geo.attributes.position.array },
                                { name: "aNormalPosition", array: geo.attributes.normal.array },
                                { name: "aTextureCoord", array: geo.attributes.uv.array },
                                indices
                            );

                            let colorMap = null;
                            if (mat.map != null) colorMap = new Texture(renderer.gl, mat.map.image);
                            // MARK: You can change the myMaterial object to your own Material instance

                            let textureSample = 0;
                            let myMaterial;
                            if (colorMap != null) {
                                textureSample = 1;
                                myMaterial = new Material(
                                    {
                                        uSampler: { type: "texture", value: colorMap },
                                        uTextureSample: { type: "1i", value: textureSample },
                                        uKd: { type: "3fv", value: mat.color.toArray() },
                                    },
                                    [],
                                    VertexShader,
                                    FragmentShader
                                );
                            } else {
                                myMaterial = new Material(
                                    {
                                        uTextureSample: { type: "1i", value: textureSample },
                                        uKd: { type: "3fv", value: mat.color.toArray() },
                                    },
                                    [],
                                    VertexShader,
                                    FragmentShader
                                );
                            }

                            const meshRender = new MeshRender(renderer.gl, mesh, myMaterial);
                            renderer.addMesh(meshRender);
                        }
                    });
                },
                onProgress,
                onError
            );
    });
};
