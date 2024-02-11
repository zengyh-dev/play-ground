import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/Addons.js";

import Canvas from "../../canvas";
import { WebGLRenderingContextExtend } from "../../canvas/interface";

import { WebGLRenderer } from "./renderers/WebGLRenderer";
import { loadOBJ } from "./Loads/loadObJ";
import { setSize, setTransform } from "./utils/utils";
import { DirectionalLight } from "./Lights/DirectionalLight";

import { ReadonlyVec3 } from "gl-matrix";
import { PointLight } from "./Lights/PointLight";
import { CubeTexture } from "./Textures/CubeTexture";


const cameraPosition = [50, 0, 100];

let precomputeLT = [];
let precomputeL = [];

const envmap = [
    'assets/cubemap/GraceCathedral',
    'assets/cubemap/Indoor',
    'assets/cubemap/Skybox',
];

const guiParams = {
    envmapId: 0
};

const cubeMaps: CubeTexture[] = [];

const resolution = 2048;

let envMapPass = null;


function GAMES202Main() {
    const draw = (gl: WebGLRenderingContextExtend, canvas: HTMLCanvasElement) => {
        // const canvas = document.getElementById("webgl") as HTMLCanvasElement;
        console.log(canvas);
        if (!canvas) {
            return;
        }

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
        // const focalPoint: ReadonlyVec3 = [0, 0, 0];
        // const lightUp: ReadonlyVec3 = [0, 1, 0];
        const pointLight = new PointLight(lightRadiance, lightPos, false, renderer.gl);
        renderer.addLight(pointLight);

        // Add shapes
        let skyBoxTransform = setTransform(0, 50, 50, 150, 150, 150);
        let boxTransform = setTransform(0, 0, 0, 200, 200, 200);
        let box2Transform = setTransform(0, -10, 0, 20, 20, 20);

        envmap.forEach(async (curEnvMap, index) => {
            let urls = [
                curEnvMap + '/posx.jpg',
                curEnvMap + '/negx.jpg',
                curEnvMap + '/posy.jpg',
                curEnvMap + '/negy.jpg',
                curEnvMap + '/posz.jpg',
                curEnvMap + '/negz.jpg',
            ];
            cubeMaps.push(new CubeTexture(gl, urls));
            await cubeMaps[index].init();
        });
        // load skybox
        loadOBJ(renderer, 'assets/testObj/', 'testObj', 'SkyBoxMaterial', skyBoxTransform);

        // let floorTransform = setTransform(0, 0, 0, 100, 100, 100);
        // let cubeTransform = setTransform(0, 50, 0, 10, 50, 10);
        // let sphereTransform = setTransform(30, 10, 0, 10, 10, 10);

        //loadOBJ(renderer, 'assets/basic/', 'cube', 'PhongMaterial', cubeTransform);
        // loadOBJ(renderer, 'assets/basic/', 'sphere', 'PhongMaterial', sphereTransform);
        //loadOBJ(renderer, 'assets/basic/', 'plane', 'PhongMaterial', floorTransform);

        function createGUI() {
            const gui = new dat.GUI();
            console.log(gui);
            const panelModel = gui.addFolder('Switch Environemtn Map');
            panelModel.add(guiParams, 'envmapId', { 'GraceGathedral': 0, 'Indoor': 1, 'Skybox': 2 }).name('Envmap Name');
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
