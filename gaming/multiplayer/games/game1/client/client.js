import { initConnection } from "../js/connection.js";
import { keys } from "../js/movement.js";
import { camera } from "../js/camera.js";
import { sendMessage } from "../js/utils.js";
import { setupUI, setupCanvas } from "../js/ui.js";
import { setupInputListeners } from "../js/input.js";
import { globalMap, createMapCanvas } from "../js/map.js";

const { canvas, ctx } = setupCanvas();
const tileSize = 20;
window.tileSize = tileSize;

// Generate the global map and create offscreen map canvas.
window.heightMap = globalMap.heightMap;
window.heightMapCanvas = createMapCanvas(globalMap.heightMap, tileSize);

// Set up UI and input.
const chatInput = setupUI(sendMessage);
setupInputListeners(keys, chatInput, camera);

// Initialize connection to gateway.
initConnection(authToken, username, userId, displayName, canvas);