import { initConnection } from "../js/connection.js";
import { sendMessage } from "../js/message.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.canvas = canvas;
window.ctx = ctx;

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
chatInput.addEventListener("keypress", (event) => { if (event.key === "Enter") sendMessage(); });

// Initialize connection to gateway
initConnection(authToken, username, userId, displayName, canvas);