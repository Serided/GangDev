// ui.js

// Run this code when the DOM is fully loaded.
document.addEventListener("DOMContentLoaded", () => {
    const canvasSetup = initializeCanvas();
    if (!canvasSetup) return;
    const { canvas, ctx } = canvasSetup;
    // Expose globals.
    window.canvas = canvas;
    window.ctx = ctx;
    // Setup UI elements.
    const chatInput = initializeUI();
    if (!chatInput) return;
    // (Optionally, you can set up input listeners here or in a separate module.)
});

/**
 * Initializes the canvas.
 * @returns {{canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D}|null}
 */
function initializeCanvas() {
    const canvas = document.getElementById("gameCanvas");
    if (!canvas) {
        console.error("setupCanvas: 'gameCanvas' element not found.");
        return null;
    }
    const ctx = canvas.getContext("2d");
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    console.log("Canvas initialized:", { width, height });
    return { canvas, ctx };
}

/**
 * Initializes UI elements (chat panel, buttons, input).
 * @returns {HTMLInputElement|null} Returns the chat input element if successful.
 */
function initializeUI() {
    const chatButton = document.getElementById("chatButton");
    const chatPanel = document.getElementById("chatPanel");
    const sendButton = document.getElementById("sendButton");
    const chatInput = document.getElementById("chatInput");

    if (!chatButton) console.error("setupUI: 'chatButton' not found.");
    if (!chatPanel) console.error("setupUI: 'chatPanel' not found.");
    if (!sendButton) console.error("setupUI: 'sendButton' not found.");
    if (!chatInput) console.error("setupUI: 'chatInput' not found.");

    // If any are missing, abort setup.
    if (!chatButton || !chatPanel || !sendButton || !chatInput) return null;

    // Set an initial value for chatPanel.style.right if not defined.
    if (!chatPanel.style.right) {
        chatPanel.style.right = "-30vw";
    }

    chatButton.addEventListener("click", () => {
        // Toggle the chat panel's right property.
        chatPanel.style.right = (chatPanel.style.right === "0vw") ? "-30vw" : "0vw";
        console.log("Chat panel toggled. New right:", chatPanel.style.right);
    });

    sendButton.addEventListener("click", () => {
        if (typeof window.sendMessage === "function") {
            window.sendMessage();
        } else {
            console.warn("sendMessage is not defined.");
        }
    });

    chatInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            if (typeof window.sendMessage === "function") {
                window.sendMessage();
            }
        }
    });

    console.log("UI elements initialized:", { chatButton, chatPanel, sendButton, chatInput });
    return chatInput;
}

/**
 * Updates the status element.
 * @param {boolean} status
 */
export function updateStatus(status) {
    const statusElement = document.getElementById("status");
    if (!statusElement) {
        console.error("updateStatus: 'status' element not found.");
        return;
    }
    statusElement.style.color = status ? "green" : "red";
    statusElement.textContent = status ? "Online" : "Offline";
}

/**
 * Updates the player count element.
 * @param {number} count
 */
export function updatePlayerCount(count) {
    const playerCountElement = document.getElementById("players");
    if (!playerCountElement) {
        console.error("updatePlayerCount: 'players' element not found.");
        return;
    }
    playerCountElement.textContent = count.toString();
}

/**
 * Appends a chat message.
 * @param {object|string} msg
 * @param {number} currentUserId
 */
export function appendMessage(msg, currentUserId) {
    const messagesElement = document.getElementById("messages");
    if (!messagesElement) {
        console.error("appendMessage: 'messages' element not found.");
        return;
    }
    const messageElement = document.createElement("p");
    let messageText = "";
    let color = "red";
    if (typeof msg === "object" && msg !== null) {
        if (msg.text && msg.user && msg.user.displayName) {
            messageText = `${msg.user.displayName}: ${msg.text}`;
            if (msg.user.userId === currentUserId) color = "green";
        } else {
            messageText = JSON.stringify(msg);
        }
    } else {
        messageText = msg.toString();
    }
    messageElement.textContent = messageText;
    messageElement.style.color = color;
    messagesElement.appendChild(messageElement);
}

/**
 * A simple wrapper for sending a chat message.
 */
export function sendMessage() {
    const chatInput = document.getElementById("chatInput");
    if (!chatInput) return;
    const message = chatInput.value.trim();
    if (message) {
        // Assumes sendData is defined globally in network.js.
        if (typeof window.sendData === "function") {
            window.sendData(window.activeSocket, "chatMessage", message, window.userId, window.username, window.displayName);
            chatInput.value = "";
        } else {
            console.warn("sendData is not available.");
        }
    }
}

// Expose sendMessage so network.js or client.js can call it.
window.sendMessage = sendMessage;
