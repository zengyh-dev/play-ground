import { WebGL2RenderingContextExtend } from "../../../canvas/interface";

export class CubeTexture {
    urls: string[];
    gl: WebGL2RenderingContextExtend;
    texture!: WebGLTexture | null;
    constructor(gl: WebGL2RenderingContextExtend, urls: string[]) {
        this.urls = urls;
        this.gl = gl;
    }

    async init() {
        const img = new Array(6);
        const gl = this.gl;

        for (let i = 0; i < 6; i++) {
            img[i] = new Image();
            const imgUrl = new URL(this.urls[i], import.meta.url).href;
            img[i].src = imgUrl;
            // console.log('loadd img', imgUrl);
            const loadImage = async (img: HTMLImageElement) => {
                return new Promise((resolve) => {
                    img.onload = async () => {
                        resolve(true);
                    };
                });
            };
            await loadImage(img[i]);
        }
        // console.log('imgs', img);

        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);

        const targets = [
            gl.TEXTURE_CUBE_MAP_POSITIVE_X,
            gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
            gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
            gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
            gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
            gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
        ];

        for (let j = 0; j < 6; j++) {
            gl.texImage2D(targets[j], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img[j]);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    }
}
