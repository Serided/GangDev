const sendButton = document.getElementById("sendButton");
const chatInput = document.getElementById("chatInput");

sendButton.addEventListener("click", sendMessage);
chatInput.addEventListener("keypress", (event) => { if (event.key === "Enter") sendMessage(); });

export function appendMessage(msg) {
    const messagesElement = document.getElementById("messages");
    const messageElement = document.createElement("p");

    if (typeof msg === "object" && msg.text) {
        messageElement.textContent = msg.text;
    } else {
        messageElement.textContent = msg.toString();
    }

    messagesElement.appendChild(messageElement);
}

export function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
        sendData(activeSocket, "chatMessage", message, window.userId, window.username, window.displayName);
        chatInput.value = "";
    }
}