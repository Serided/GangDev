// client.js
import { initConnection } from "../js/network.js";
import { setupCanvas, setupUI, setupInputListeners } from "../js/ui.js";
import { globalMap, createMapCanvas } from "../js/map.js";
import { camera } from "../js/camera.js";
import { keys } from "../js/engine.js";

// Wait for DOM to be loaded.
document.addEventListener("DOMContentLoaded", () => {
    const { canvas, ctx } = setupCanvas();
    if (!canvas || !ctx) return;

    const tileSize = 20; // pixels per meter at zoom=1
    window.tileSize = tileSize;

    // Generate the global map and offscreen map canvas.
    window.heightMap = globalMap.heightMap;
    window.heightMapCanvas = createMapCanvas(globalMap.heightMap, tileSize);

    // Set up UI and input listeners.
    const chatInput = setupUI(sendMessage);
    if (!chatInput) return;
    setupInputListeners(keys, chatInput, camera);

    // Expose globals injected from index.php.
    window.authToken = authToken;
    window.username = username;
    window.userId = userId;
    window.displayName = displayName;

    // Initialize connection; pass canvas and offscreen map canvas.
    initConnection(authToken, username, userId, displayName, canvas, window.heightMapCanvas);
});

// sendMessage is defined in ui.js and is globally exposed.
