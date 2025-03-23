import { initConnection, connectToGame, activeSocket } from "../js/connection.js";
import { gameLoop, keys, localPlayer, players, speed, handleMovementUpdate } from "../js/movement.js";
import { camera } from "../js/camera.js";
import { sendData, sendMessage, updateStatus, updatePlayerCount, appendMessage } from "../js/utils.js";
import { drawGame } from "../js/map.js";

// Set up canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Attach event listeners for movement and chat
window.addEventListener("keydown", (event) => { keys[event.key] = true; });
window.addEventListener("keyup", (event) => { keys[event.key] = false; });
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
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

function gameLoop(timestamp) {
    const delta = (timestamp - lastTime) / 1000;
    lastTime = timestamp;
    if (keys["ArrowUp"] || keys["w"]) localPlayer.y -= speed * delta;
    if (keys["ArrowDown"] || keys["s"]) localPlayer.y += speed * delta;
    if (keys["ArrowLeft"] || keys["a"]) localPlayer.x -= speed * delta;
    if (keys["ArrowRight"] || keys["d"]) localPlayer.x += speed * delta;

    // Send movement update.
    sendData("movement", { x: localPlayer.x, y: localPlayer.y });
    // Use the imported drawGame to render the map.
    drawGame(ctx, canvas, camera, players, userId);
    requestAnimationFrame(gameLoop);
}