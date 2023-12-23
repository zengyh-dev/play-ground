import * as THREE from "three";
export const loadShaderFile = (filename: string) => {
    return new Promise((resolve) => {
        const loader = new THREE.FileLoader();
        loader.load(filename, (data) => {
            resolve(data);
            //console.log(data);
        });
    });
};
