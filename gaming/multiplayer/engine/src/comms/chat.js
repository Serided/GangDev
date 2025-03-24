import { sendData } from "../tools.js"

const sendButton = document.getElementById("sendButton");
const chatInput = document.getElementById("chatInput");

sendButton.addEventListener("click", sendMessage);
chatInput.addEventListener("keypress", (event) => { if (event.key === "Enter") sendMessage(); });

export function appendMessage(msg) {
    const messagesElement = document.getElementById("messages");
    const messageElement = document.createElement("p");

    let text = "";
    let color = "red";

    if (typeof msg === "object" && msg.text && msg.user) {
        text = `${msg.user.displayName}: ${msg.text}`;
        if (msg.user.userId === window.userId) {
            color = "green"
        }
    } else {
        text = msg.toString();
    }

    messageElement.textContent = text;
    messageElement.style.color = color;
    messagesElement.appendChild(messageElement);
}

export function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
        sendData(activeSocket, "chatMessage", message, window.userId, window.username, window.displayName);
        chatInput.value = "";
    }
}