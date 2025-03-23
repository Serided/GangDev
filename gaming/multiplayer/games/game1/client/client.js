import { initConnection } from "../js/connection.js";
import { gameLoop, keys, localPlayer, players, speed } from "../js/movement.js";
import { camera } from "../js/camera.js";
import { sendData, sendMessage, updateStatus, updatePlayerCount, appendMessage } from "../js/utils.js";
import { drawGame } from "../js/render.js";
import { generateHeightMap, globalMap } from "../js/map.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.canvas = canvas;
window.ctx = ctx;

// Set tile size (e.g., 4 pixels per meter at zoom=1)
const tileSize = 4;
window.tileSize = tileSize;

// Generate the map once
const heightMap = globalMap.heightMap;
window.heightMap = heightMap;

// Attach event listeners for movement and chat
window.addEventListener("keydown", (event) => { keys[event.key] = true; });
window.addEventListener("keyup", (event) => { keys[event.key] = false; });
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
window.addEventListener("wheel", (event) => {
    event.preventDefault();
    camera.zoom += (event.deltaY > 0 ? -0.1 : 0.1);
    if (camera.zoom < 0.5) camera.zoom = 0.5;
    if (camera.zoom > 1.5) camera.zoom = 1.5;
}, { passive: false });

const chatButton = document.getElementById("chatButton");
const chatPanel = document.getElementById("chatPanel");
const sendButton = document.getElementById("sendButton");
const chatInput = document.getElementById("chatInput");
chatButton.addEventListener("click", () => {
    chatPanel.style.right = (chatPanel.style.right === "0vw") ? "-30vw" : "0vw";
});
sendButton.addEventListener("click", sendMessage);
chatInput.addEventListener("keypress", (event) => { if (event.key === "Enter") sendMessage(); });

// Initialize connection to gateway
initConnection(authToken, username, userId, displayName, canvas);