import React from "react";
import ReactDOM from "react-dom/client";
import HelloPoint from "./webgl/ch02/HelloPoint";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <HelloPoint />
    </React.StrictMode>
);
