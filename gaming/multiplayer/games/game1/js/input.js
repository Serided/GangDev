export function setupInputListeners(keys, chatInput, camera) {
    // Keydown listener: simply record key state.
    document.addEventListener("keydown", (event) => {
        if (document.activeElement === chatInput) return;
        keys[event.key] = true;
    });

    // Keyup listener: record release.
    document.addEventListener("keyup", (event) => {
        if (document.activeElement === chatInput) return;
        keys[event.key] = false;
    });

    // Wheel event for zoom.
    window.addEventListener("wheel", (event) => {
        event.preventDefault();
        camera.zoom += (event.deltaY > 0 ? -0.1 : 0.1);
        if (camera.zoom < 0.5) camera.zoom = 0.5;
        if (camera.zoom > 1.5) camera.zoom = 1.5;
    }, { passive: false });
}