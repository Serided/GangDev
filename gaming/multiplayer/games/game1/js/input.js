export function setupInputListeners(keys, chatInput, camera) {
    window.addEventListener("keydown", (event) => {
        if (document.activeElement === chatInput) return;

        if (event.key === "Control") {
            event.preventDefault();
        } else if (event.key !== "Shift") {
            event.preventDefault();
        }

        keys[event.key] = true;
    });

    window.addEventListener("keyup", (event) => {
        if (document.activeElement === chatInput) return;
        keys[event.key] = false;
    });

    window.addEventListener("wheel", (event) => {
        event.preventDefault();
        camera.zoom += (event.deltaY > 0 ? -0.1 : 0.1);
        if (camera.zoom < 0.5) camera.zoom = 0.5;
        if (camera.zoom > 1.5) camera.zoom = 1.5;
    }, { passive: false });
}
