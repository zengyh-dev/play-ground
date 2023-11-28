import React from "react";
import ReactDOM from "react-dom/client";
import HelloTriangle from "./webgl/Triangles/HelloTriangle";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <HelloTriangle />
    </React.StrictMode>
);
