import { setup2dCanvas } from "../canvas.js";
import { chatPanel ,chatInput } from "../comms/chat.js"

export const keys = {};

export const topDownInput = (() => {
    function setupInputListeners() {
        window.addEventListener("keydown", keyDownHandler);
        window.addEventListener("keyup", keyUpHandler);
        window.addEventListener("wheel", (event) => {
            if (chatPanel.contains(document.activeElement)) return;
            event.preventDefault();
            const delta = event.deltaY > 0 ? -0.1 : 0.1
            camera.setZoom(camera.targetZoom + delta);
        }, { passive: false });
        window.addEventListener("resize", () => {
            window.gameWindow = setup2dCanvas();
        });
    }

    function keyDownHandler(event) {
        if (document.activeElement === chatInput) return;
        const key = event.key.toLowerCase();
        if (
            ["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)
        ) {
            keys[key] = true;
        }
    }

    function keyUpHandler(event) {
        if (document.activeElement === chatInput) return;
        const key = event.key.toLowerCase();
        if (
            ["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)
        ) {
            keys[key] = false;
        }
    }

    return {
        setupInputListeners
    };
})();