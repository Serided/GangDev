export function setupInputListeners(keys, chatInput, camera) {
    window.addEventListener("keydown", (event) => {
        if (document.activeElement === chatInput) return;
        // If either Control or Shift is involved, prevent default behavior.
        if (event.key === "Control" || event.key === "Shift" || event.ctrlKey || event.shiftKey) {
            event.preventDefault();
        }
        keys[event.key] = true;
    }, { capture: true });

    window.addEventListener("keyup", (event) => {
        if (document.activeElement === chatInput) return;
        keys[event.key] = false;
    }, { capture: true });

    window.addEventListener("wheel", (event) => {
        event.preventDefault();
        camera.zoom += (event.deltaY > 0 ? -0.1 : 0.1);
        if (camera.zoom < 0.5) camera.zoom = 0.5;
        if (camera.zoom > 1.5) camera.zoom = 1.5;
    }, { passive: false });
}
