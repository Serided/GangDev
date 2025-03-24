import { initConnection } from "../js/connection.js";
import { keys } from "../js/movement.js";
import { camera } from "../js/camera.js";
import { sendMessage } from "../js/utils.js";
import { drawGame } from "../js/render.js";
import { globalMap, createMapCanvas } from "../js/map.js";
import { setupUI, setupCanvas } from "../js/ui.js";
import { setupInputListeners } from "../js/input.js";

// Set up canvas using our UI module.
const { canvas, ctx } = setupCanvas();
const tileSize = 20;
window.tileSize = tileSize;

// Generate and store the pre-generated map.
window.heightMap = globalMap.heightMap;
window.heightMapCanvas = createMapCanvas(globalMap.heightMap, tileSize);

// Set up UI and input (chat UI and key/wheel listeners)
const chatInput = setupUI(sendMessage);
setupInputListeners(keys, chatInput, camera);

// Initialize connection to the gateway (this will trigger the game loop internally).
initConnection(authToken, username, userId, displayName, canvas);