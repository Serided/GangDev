import { sendData } from "../tools.js"

const chatButton = document.getElementById("chatButton");
export const chatPanel = document.getElementById("chatPanel");
const sendButton = document.getElementById("sendButton");
export const chatInput = document.getElementById("chatInput");

chatButton.addEventListener("click", (event) => {
    if (chatPanel.style.right === "0vw") {
        chatPanel.style.right = "-30vw";
    } else {
        chatPanel.style.right = "0vw";
    }
});

sendButton.addEventListener("click", sendMessage);
chatInput.addEventListener("keypress", (event) => { if (event.key === "Enter") sendMessage(); });

export function appendMessage(msg) {
    const messagesElement = document.getElementById("messages");
    const messageElement = document.createElement("p");

    let text = "";
    let color = "red";

    if (typeof msg === "object" && msg.text && msg.user) {
        if (msg.user.userId === 0) {
            text = msg.text;
            color = "gray"
        } else if (msg.user.userId === window.userId) {
            text = `${msg.user.displayName}: ${msg.text}`;
            color = "green"
        }
    } else {
        text = msg.toString();
    }

    messageElement.textContent = text;
    messageElement.style.color = color;
    messagesElement.appendChild(messageElement);

    messagesElement.scrollTop = messagesElement.scrollHeight;
}

export function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
        sendData(activeSocket, "chatMessage", message, window.userId, window.username, window.displayName);
        chatInput.value = "";
    }
}