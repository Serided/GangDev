import { initConnection } from "../js/connection.js";
import { keys } from "../js/movement.js";
import { camera } from "../js/camera.js";
import { sendMessage } from "../js/utils.js";
import { setupUI, setupCanvas } from "../js/ui.js";
import { setupInputListeners } from "../js/input.js";
import { globalMap, createMapCanvas } from "../js/map.js";

const { canvas, ctx } = setupCanvas();
const tileSize = 20; // pixels per meter at zoom=1
window.tileSize = tileSize;

// Generate the global map and create the offscreen map canvas.
window.heightMap = globalMap.heightMap;
window.heightMapCanvas = createMapCanvas(globalMap.heightMap, tileSize);

// Set up UI (chat, etc.) and input listeners.
const chatInput = setupUI(sendMessage);
setupInputListeners(keys, chatInput, camera);

// Update canvas on window resize.
window.addEventListener("resize", () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
});

// Initialize connection to the gateway.
initConnection(authToken, username, userId, displayName, canvas);