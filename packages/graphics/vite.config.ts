import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import glsl from "vite-plugin-glsl";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), glsl()],
    resolve: {
        alias: {
            // @ 替代为 src
            "@": resolve(__dirname, "src"),
            // @component 替代为 src/component
            "@cubemap": resolve(__dirname, "src/assets/cubemap"),
            "@assets": resolve(__dirname, "src/assets"),
        },
    },
});
