import { initConnection } from "../js/connection.js";
import { gameLoop, keys, localPlayer, players, speed } from "../js/movement.js";
import { camera } from "../js/camera.js";
import { sendData, sendMessage, updateStatus, updatePlayerCount, appendMessage } from "../js/utils.js";
import { drawGame } from "../js/render.js";
import { globalMap } from "../js/map.js";

// Set up canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.canvas = canvas;
window.ctx = ctx;

// Define tile size (in pixels per meter at zoom 1)
const tileSize = 4;
window.tileSize = tileSize;

// Set up event listeners for movement
window.addEventListener("keydown", (event) => { keys[event.key] = true; });
window.addEventListener("keyup", (event) => { keys[event.key] = false; });
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Set up wheel listener to control zoom
window.addEventListener("wheel", (event) => {
    event.preventDefault();
    camera.zoom += (event.deltaY > 0 ? -0.1 : 0.1);
    if (camera.zoom < 0.5) camera.zoom = 0.5;
    if (camera.zoom > 1.5) camera.zoom = 1.5;
}, { passive: false });

// Set up chat UI event listeners
const chatButton = document.getElementById("chatButton");
const chatPanel = document.getElementById("chatPanel");
const sendButton = document.getElementById("sendButton");
const chatInput = document.getElementById("chatInput");
chatButton.addEventListener("click", () => {
    chatPanel.style.right = (chatPanel.style.right === "0vw") ? "-30vw" : "0vw";
});
sendButton.addEventListener("click", sendMessage);
chatInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") sendMessage();
});

// Initialize connection to the gateway
initConnection(authToken, username, userId, displayName, canvas);

// Start the game loop after connection is established via connection.js (which calls requestAnimationFrame(gameLoop))
// We'll override the imported gameLoop here with our localGameLoop that uses our pre-generated map.
let lastTime = performance.now();
function localGameLoop(timestamp) {
    const delta = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    // Adjust local player movement based on keys (movement speed relative to zoom)
    const effectiveSpeed = speed / camera.zoom;
    if (keys["ArrowUp"] || keys["w"]) localPlayer.y -= effectiveSpeed * delta;
    if (keys["ArrowDown"] || keys["s"]) localPlayer.y += effectiveSpeed * delta;
    if (keys["ArrowLeft"] || keys["a"]) localPlayer.x -= effectiveSpeed * delta;
    if (keys["ArrowRight"] || keys["d"]) localPlayer.x += effectiveSpeed * delta;

    // Send updated movement info
    sendData(window.activeSocket, "movement", { x: localPlayer.x, y: localPlayer.y }, userId, username, displayName);

    // Draw the map (background) and players
    drawGame(ctx, canvas, camera, players, userId, globalMap.heightMap, tileSize);

    requestAnimationFrame(localGameLoop);
}
requestAnimationFrame(localGameLoop);