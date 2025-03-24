// Global document-level listener to prevent default actions when Control is pressed.
document.addEventListener(
    "keydown",
    (event) => {
        if (event.ctrlKey) {
            event.preventDefault();
            // Optionally, you can log or handle control-key events here.
        }
    },
    { capture: true }
);

export function setupInputListeners(keys, chatInput, camera) {
    // Listen for keydown events
    document.addEventListener("keydown", (event) => {
        // When the chat input is focused, ignore game controls.
        if (document.activeElement === chatInput) return;
        // Record the key state
        keys[event.key] = true;
    }, { capture: false });

    // Listen for keyup events
    document.addEventListener("keyup", (event) => {
        if (document.activeElement === chatInput) return;
        keys[event.key] = false;
    }, { capture: false });

    // Handle wheel events for zoom
    window.addEventListener(
        "wheel",
        (event) => {
            event.preventDefault();
            camera.zoom += (event.deltaY > 0 ? -0.1 : 0.1);
            if (camera.zoom < 0.5) camera.zoom = 0.5;
            if (camera.zoom > 1.5) camera.zoom = 1.5;
        },
        { passive: false }
    );
}
