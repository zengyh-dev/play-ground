import React from "react";
import ReactDOM from "react-dom/client";
import OrthoView from "./webgl/5_3DWorld/28_PerspectiveView";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <OrthoView />
    </React.StrictMode>
);
