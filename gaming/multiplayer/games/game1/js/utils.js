export function sendData(activeSocket, type, data, userId, username, displayName) {
    if (activeSocket && activeSocket.readyState === WebSocket.OPEN) {
        let payload;
        if (typeof data === "string" || data instanceof String) {
            payload = { text: data };
        } else {
            payload = data;
        }
        const enrichedData = {
            ...payload,
            user: {
                userId: userId,
                username: username,
                displayName: displayName
            }
        };
        const message = JSON.stringify({ type, data: enrichedData });
        const blob = new Blob([message], { type: 'application/json' });
        activeSocket.send(blob);
    } else {
        console.warn("Cannot send data. WebSocket closed.");
    }
}

export function sendMessage(chatInput, activeSocket, userId, username, displayName) {
    const message = chatInput.value.trim();
    if (message) {
        sendData(activeSocket, 'chatMessage', message, userId, username, displayName);
        chatInput.value = "";
    }
}

export function updateStatus(status) {
    const statusElement = document.getElementById("status");
    statusElement.style.color = status ? 'green' : 'red';
    statusElement.textContent = status ? "Online" : "Offline";
}

export function updatePlayerCount(count) {
    const playerCountElement = document.getElementById("players");
    playerCountElement.textContent = count.toString();
}

export function appendMessage(msg, userId) {
    const messagesElement = document.getElementById("messages");
    const messageElement = document.createElement("p");
    let messageText = "";
    let color = "red";
    if (typeof msg === "object" && msg !== null) {
        if (msg.text && msg.user && msg.user.displayName) {
            messageText = `${msg.user.displayName}: ${msg.text}`;
            if (msg.user.userId === userId) color = "green";
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
