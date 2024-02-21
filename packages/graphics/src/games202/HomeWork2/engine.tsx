import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/Addons.js";

import Canvas from "../../canvas";
import { WebGLRenderingContextExtend } from "../../canvas/interface";

import { WebGLRenderer } from "./Renderers/WebGLRenderer";
import { loadOBJ } from "./Loads/loadObJ";
import { setSize, setTransform } from "./utils";

import { ReadonlyVec3 } from "gl-matrix";
import { PointLight } from "./Lights/PointLight";
import { CubeTexture } from "./Textures/CubeTexture";
// import { loadShaderFile } from "./Loads/loadShader";

import GraceCathedralLight from "@assets/cubemap/GraceCathedral/light.txt?raw";
import GraceCathedralTransport from "@assets/cubemap/GraceCathedral/transport.txt?raw";

import IndoorLight from "@assets/cubemap/Indoor/light.txt?raw";
import IndoorTransport from "@assets/cubemap/Indoor/transport.txt?raw";

import SkyboxLight from "@assets/cubemap/Skybox/light.txt?raw";
import SkyboxTransport from "@assets/cubemap/Skybox/transport.txt?raw";

import CornellBoxLight from "@assets/cubemap/CornellBox/light.txt?raw";
import CornellBoxTransport from "@assets/cubemap/CornellBox/transport.txt?raw";
import { cubeMaps, guiParams, precomputeL, precomputeLT } from "./utils/constant";

interface EnvLight {
    [key: string]: {
        light: string;
        trans: string;
    };
}

const envLight: EnvLight = {
    GraceCathedral: {
        light: GraceCathedralLight,
        trans: GraceCathedralTransport,
    },
    Indoor: {
        light: IndoorLight,
        trans: IndoorTransport,
    },
    Skybox: {
        light: SkyboxLight,
        trans: SkyboxTransport,
    },
    CornellBox: {
        light: CornellBoxLight,
        trans: CornellBoxTransport,
    },
};

const cameraPosition = [50, 0, 100];

// const envmap = [
//     'GraceCathedral',
//     'Indoor',
//     'Skybox',
// ];

// const resolution = 2048;

// let envMapPass = null;

function GAMES202Main() {
    const draw = async (gl: WebGLRenderingContextExtend, canvas: HTMLCanvasElement) => {
        // const canvas = document.getElementById("webgl") as HTMLCanvasElement;
        console.log(canvas);
        if (!canvas) {
            console.log("No Canvas!");
            return;
        }

        canvas.width = window.screen.width;
        canvas.height = window.screen.height;

        if (!gl) {
            console.log("Unable to initialize WebGL. Your browser or machine may not support it.");
            return;
        }

        const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 1e-2, 1000);
        camera.position.set(cameraPosition[0], cameraPosition[1], cameraPosition[2]);

        setSize(camera, canvas.clientWidth, canvas.clientHeight);
        window.addEventListener("resize", () => setSize(camera, canvas.clientWidth, canvas.clientHeight));

        // Add camera control
        const cameraControls = new OrbitControls(camera, canvas);
        cameraControls.enableZoom = true;
        cameraControls.enableRotate = true;
        cameraControls.enablePan = true;
        cameraControls.rotateSpeed = 0.3;
        cameraControls.zoomSpeed = 1.0;
        cameraControls.panSpeed = 0.8;
        cameraControls.target.set(0, 0, 0);

        // Add renderer
        const renderer = new WebGLRenderer(gl, camera);

        // Add lights
        // light - is open shadow map == true
        const lightPos: ReadonlyVec3 = [0, 10000, 0];
        const lightRadiance: ReadonlyVec3 = [1, 0, 0];
        const pointLight = new PointLight(lightRadiance, lightPos, false, renderer.gl);
        renderer.addLight(pointLight);

        // Add shapes
        const skyBoxTransform = setTransform(0, 50, 50, 150, 150, 150);
        // const boxTransform = setTransform(0, 0, 0, 200, 200, 200);
        const box2Transform = setTransform(0, -10, 0, 20, 20, 20);

        const envMap = Object.keys(envLight);
        const cubeMapList = ["/posx.jpg", "/negx.jpg", "/posy.jpg", "/negy.jpg", "/posz.jpg", "/negz.jpg"];
        for (let i = 0; i < envMap.length; i++) {
            const urls = cubeMapList.map((cubemapName) => {
                return "../../../assets/cubemap/" + envMap[i] + cubemapName;
            });
            cubeMaps.push(new CubeTexture(gl, urls));
            await cubeMaps[i].init();
        }

        // load skybox
        loadOBJ(renderer, "../../../assets/testObj/", "testObj", "SkyBoxMaterial", skyBoxTransform);

        // file parsing
        for (let i = 0; i < envMap.length; i++) {
            const curLight = envLight[envMap[i]].light;
            const curTransport = envLight[envMap[i]].trans;
            console.log("curLight", curLight);
            console.log("curTransport", curTransport);

            const preArray = curTransport.split(/[(\r\n)\r\n' ']+/);
            let lineArray = [];
            precomputeLT[i] = [];
            for (let j = 1; j <= Number(preArray.length) - 2; j++) {
                precomputeLT[i][j - 1] = Number(preArray[j]);
            }

            precomputeL[i] = curLight.split(/[(\r\n)\r\n]+/);
            precomputeL[i].pop();
            for (let j = 0; j < 9; j++) {
                lineArray = precomputeL[i][j].split(" ");
                for (let k = 0; k < 3; k++) {
                    lineArray[k] = Number(lineArray[k]);
                }
                precomputeL[i][j] = lineArray;
            }
            console.log("precompute" + precomputeL);
        }
        renderer.addPrecomputeL(precomputeL);
        // // TODO: load model - Add your Material here
        loadOBJ(renderer, "../../../assets/mary/", "mary", "PRTMaterial", box2Transform);

        function createGUI() {
            const gui = new dat.GUI();
            console.log(gui);
            const panelModel = gui.addFolder("Switch Environemtn Map");
            panelModel
                .add(guiParams, "envmapId", { GraceGathedral: 0, Indoor: 1, Skybox: 2, CornellBox: 3 })
                .name("Envmap Name");
            panelModel.open();
        }
        createGUI();

        function mainLoop() {
            cameraControls.update();

            renderer.render();
            requestAnimationFrame(mainLoop);
        }
        requestAnimationFrame(mainLoop);
    };

    return (
        <Canvas draw={draw} width={window.screen.width} height={window.screen.height} options={{ context: "webgl" }} />
    );
}
export default GAMES202Main;
