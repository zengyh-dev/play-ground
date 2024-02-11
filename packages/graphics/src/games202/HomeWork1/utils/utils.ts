export const setTransform = (t_x: number, t_y: number, t_z: number, s_x: number, s_y: number, s_z: number) => {
    return {
        modelTransX: t_x,
        modelTransY: t_y,
        modelTransZ: t_z,
        modelScaleX: s_x,
        modelScaleY: s_y,
        modelScaleZ: s_z,
    };
};

// Add resize listener
export const setSize = (camera: THREE.PerspectiveCamera, width: number, height: number) => {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
};
