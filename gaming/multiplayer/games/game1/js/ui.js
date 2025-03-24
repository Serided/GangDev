// ui.js
export function setupCanvas() {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    window.canvas = canvas;
    window.ctx = ctx;
    return { canvas, ctx };
}

export function setupUI(sendMessage) {
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
    return chatInput;
}

export function setupInputListeners(keys, chatInput, camera) {
    document.addEventListener("keydown", (event) => {
        if (document.activeElement === chatInput) return;
        keys[event.key] = true;
    });
    document.addEventListener("keyup", (event) => {
        if (document.activeElement === chatInput) return;
        keys[event.key] = false;
    });
    window.addEventListener("wheel", (event) => {
        event.preventDefault();
        camera.zoom += (event.deltaY > 0 ? -0.1 : 0.1);
        if (camera.zoom < 0.5) camera.zoom = 0.5;
        if (camera.zoom > 1.5) camera.zoom = 1.5;
    }, { passive: false });
}

export function updateStatus(status) {
    const statusElement = document.getElementById("status");
    statusElement.style.color = status ? "green" : "red";
    statusElement.textContent = status ? "Online" : "Offline";
}

export function updatePlayerCount(count) {
    const playerCountElement = document.getElementById("players");
    playerCountElement.textContent = count.toString();
}

export function appendMessage(msg, currentUserId) {
    const messagesElement = document.getElementById("messages");
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

// Expose sendMessage wrapper that calls sendData from network.
export function sendMessage() {
    const chatInput = document.getElementById("chatInput");
    if (!chatInput) return;
    const message = chatInput.value.trim();
    if (message) {
        window.sendData(window.activeSocket, "chatMessage", message, window.userId, window.username, window.displayName);
        chatInput.value = "";
    }
}