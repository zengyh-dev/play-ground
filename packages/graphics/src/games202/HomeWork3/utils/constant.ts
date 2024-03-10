import { CubeTexture } from "../Textures/CubeTexture";

export const resolution = 2048;
export const guiParams = {
    envmapId: 0,
};

export const cubeMaps: CubeTexture[] = [];

export const precomputeLT: any = [];
export const precomputeL: any = [];

export const mipMapLevel = 1 + Math.floor(Math.log2(Math.max(window.screen.width, window.screen.height)));
