import { initConnection } from "../js/connection.js";

// Set up canvas and attach globals to window for use in modules.
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.canvas = canvas;
window.ctx = ctx;

// UI event listeners
window.addEventListener("keydown", (event) => { window.keys[event.key] = true; });
window.addEventListener("keyup", (event) => { window.keys[event.key] = false; });
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
sendButton.addEventListener("click", () => { window.sendMessage(); });
chatInput.addEventListener("keypress", (event) => { if (event.key === "Enter") window.sendMessage(); });

// Initialize connection to gateway
initConnection(authToken, username, userId, displayName, canvas);