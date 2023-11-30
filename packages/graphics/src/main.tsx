import React from "react";
import ReactDOM from "react-dom/client";
import RotatedTriangleMatrix from "./webgl/Triangles/12RotatedTriangle_Matrix";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RotatedTriangleMatrix />
    </React.StrictMode>
);
