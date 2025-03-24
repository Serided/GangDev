export function setupInputListeners(keys, chatInput, camera) {
    window.addEventListener("keydown", (event) => {
        if (document.activeElement === chatInput) return;
        // Log the event for debugging.
        console.log("keydown:", event.key, event.code, event.ctrlKey, event.shiftKey);
        // Prevent default behavior and stop propagation.
        event.preventDefault();
        event.stopPropagation();
        keys[event.key] = true;
    }, { capture: true });

    window.addEventListener("keyup", (event) => {
        if (document.activeElement === chatInput) return;
        console.log("keyup:", event.key, event.code);
        event.preventDefault();
        event.stopPropagation();
        keys[event.key] = false;
    }, { capture: true });

    window.addEventListener("wheel", (event) => {
        event.preventDefault();
        camera.zoom += (event.deltaY > 0 ? -0.1 : 0.1);
        if (camera.zoom < 0.5) camera.zoom = 0.5;
        if (camera.zoom > 1.5) camera.zoom = 1.5;
    }, { passive: false });
}