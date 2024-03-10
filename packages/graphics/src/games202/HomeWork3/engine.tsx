import * as THREE from "three";
// import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/Addons.js";

import Canvas from "../../canvas";
import { WebGL2RenderingContextExtend } from "../../canvas/interface";

import { WebGLRenderer } from "./Renderers/WebGLRenderer";
import { processFramebuffer, setSize, setTransform } from "./utils";

import { ReadonlyVec3 } from "gl-matrix";

import { mipMapLevel } from "./utils/constant";

import depthVert from "./Shaders/SceneDepthShader/depth.vert";
import depthFragment from "./Shaders/SceneDepthShader/depth.frag";

import { ExtendedFramebuffer, PerspectiveCamera } from "./interface";
import { DirectionalLight } from "./Lights/DirectionalLight";
import { loadGLTF } from "./Loads/loadGLTF";
import { SceneDepthMaterial } from "./Materials/SceneDepthMaterial";
import { MeshRender } from "./Renderers/MeshRenderer";
import { Mesh } from "./Objects/Mesh";

// const cameraPosition = [50, 0, 100];

// const envmap = [
//     'GraceCathedral',
//     'Indoor',
//     'Skybox',
// ];

// const resolution = 2048;

// let envMapPass = null;

function GAMES202Main() {
    // gl: webgl上下文具有一系列绘制渲染三维场景的方法 ，也就是 WebGL API
    // canvas: 我们的画布，仅需要设置画布大小
    const draw = async (gl: WebGL2RenderingContextExtend, canvas: HTMLCanvasElement) => {
        // const canvas = document.getElementById("webgl") as HTMLCanvasElement;
        console.log(canvas);
        if (!canvas) {
            console.error("No Canvas!");
            return;
        }

        let ext = gl.getExtension("EXT_color_buffer_float");
        if (!ext) {
            alert("Need EXT_color_buffer_float");
            return;
        }

        canvas.width = window.screen.width;
        canvas.height = window.screen.height;

        if (!gl) {
            console.error("Unable to initialize WebGL. Your browser or machine may not support it.");
            return;
        }

        const camera = new THREE.PerspectiveCamera(
            75,
            canvas.clientWidth / canvas.clientHeight,
            1e-2,
            1000
        ) as PerspectiveCamera;

        // Cave
        const cameraPosition = [4.18927, 1.0313, 2.07331];
        const cameraTarget = [2.92191, 0.98, 1.55037];
        camera.position.set(cameraPosition[0], cameraPosition[1], cameraPosition[2]);

        const cameraFBO = gl.createFramebuffer() as ExtendedFramebuffer;
        if (!cameraFBO) {
            console.error("无帧缓冲区对象: cameraFBO");
            return;
        }
        processFramebuffer(cameraFBO, gl, 5);
        camera.fbo = cameraFBO;

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
        cameraControls.target.set(cameraTarget[0], cameraTarget[1], cameraTarget[2]);

        // Add renderer
        const renderer = new WebGLRenderer(gl, camera);

        // Add lights
        // Cave light
        const lightPos: ReadonlyVec3 = [-0.45, 5.40507, 0.637043];
        const lightRadiance: ReadonlyVec3 = [20, 20, 20];
        const lightDir = {
            x: 0.39048811,
            y: -0.89896828,
            z: 0.19843153,
        };
        const lightUp: ReadonlyVec3 = [1, 0, 0];
        const focalPoint: ReadonlyVec3 = [
            lightDir["x"] + lightPos[0],
            lightDir["y"] + lightPos[1],
            lightDir["z"] + lightPos[2],
        ];
        const directionLight = new DirectionalLight(lightRadiance, lightPos, focalPoint, lightUp, false, gl, lightDir);
        renderer.addLight(directionLight);

        loadGLTF(renderer, "../../../assets/cave/", "cave", "SSRMaterial");

        let currentWidth = window.screen.width;
        let currentHeight = window.screen.height;

        for (let i = 0; i < mipMapLevel; i++) {
            let lastWidth = currentWidth;
            let lastHeight = currentHeight;

            if (i > 0) {
                // calculate next viewport size
                currentWidth /= 2;
                currentHeight /= 2;

                currentWidth = Math.floor(currentWidth);
                currentHeight = Math.floor(currentHeight);

                // ensure that the viewport size is always at least 1x1
                currentWidth = currentWidth > 0 ? currentWidth : 1;
                currentHeight = currentHeight > 0 ? currentHeight : 1;
            }
            console.log("MipMap Level", i, ":", currentWidth, "x", currentHeight);

            const fb = gl.createFramebuffer() as ExtendedFramebuffer;
            if (!fb) {
                console.error("无帧缓冲区对象: cameraFBO");
                return;
            }
            processFramebuffer(fb, gl, 1, currentWidth, currentHeight);

            fb.lastWidth = lastWidth;
            fb.lastHeight = lastHeight;
            fb.width = currentWidth;
            fb.height = currentHeight;
            renderer.addDepthFBO(fb);
        }

        const depthTexture = camera.fbo.textures[1];
        const sceneDepthMaterial = new SceneDepthMaterial(depthTexture, depthVert, depthFragment);
        const depthMeshRender = new MeshRender(
            renderer.gl,
            Mesh.Quad(setTransform(0, 0, 0, 1, 1, 1)),
            sceneDepthMaterial
        );
        renderer.addDepthMeshRender(depthMeshRender);

        // function createGUI() {
        //     const gui = new dat.GUI();
        //     console.log(gui);
        //     const lightPanel = gui.addFolder("Directional Light");
        //     const light = renderer.lights[0].entity;
        //     if (light instanceof DirectionalLight && light.lightDir) {
        //         lightPanel.add(light.lightDir, "x", -10, 10, 0.1);
        //         lightPanel.add(light.lightDir, "y", -10, 10, 0.1);
        //         lightPanel.add(light.lightDir, "z", -10, 10, 0.1);
        //     }
        //     lightPanel.open();
        // }
        // createGUI();

        function mainLoop() {
            cameraControls.update();

            renderer.render();
            requestAnimationFrame(mainLoop);
        }
        requestAnimationFrame(mainLoop);
    };

    return (
        <Canvas draw={draw} width={window.screen.width} height={window.screen.height} options={{ context: "webgl2" }} />
    );
}
export default GAMES202Main;
