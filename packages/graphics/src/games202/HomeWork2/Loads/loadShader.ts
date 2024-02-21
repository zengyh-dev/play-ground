import * as THREE from "three";

export const loadShaderFile = async (filename: string) => {
    return new Promise((resolve) => {
        const loader = new THREE.FileLoader();

        loader.load(filename, (data) => {
            resolve(data);
            //console.log(data);
        });
    });
};

export async function getShaderString(this: any, filename: string) {
    let val = "";
    await this.loadShaderFile(filename).then((result: string) => {
        val = result;
    });
    //console.log(val);
    return val;
}
