import { initConnection } from "../js/network.js";
import { setupCanvas, setupUI, setupInputListeners, updateStatus, appendMessage, updatePlayerCount, sendMessage } from "../js/ui.js";
import { globalMap, createMapCanvas } from "../js/map.js";

// Set up canvas.
const { canvas, ctx } = setupCanvas();
const tileSize = 20;
window.tileSize = tileSize;

// Generate the global map and offscreen map canvas.
window.heightMap = globalMap.heightMap;
window.heightMapCanvas = createMapCanvas(globalMap.heightMap, tileSize);

// Set up UI and input listeners.
const chatInput = setupUI(sendMessage);
setupInputListeners(window.keys, chatInput, window.camera);

// Expose global networking variables (assumed to be set from index.php).
window.authToken = authToken;
window.username = username;
window.userId = userId;
window.displayName = displayName;

// Initialize connection to the gateway and pass canvas and mapCanvas.
initConnection(authToken, username, userId, displayName, canvas, window.heightMapCanvas);
