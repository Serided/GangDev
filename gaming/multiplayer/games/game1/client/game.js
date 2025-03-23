let activeSocket;

const gatewaySocket = new WebSocket("wss://gaming.gangdev.co/socket");

gatewaySocket.onopen = () => {
    console.log("Connected to gateway");
    updateStatus(true);
    const authPayload = JSON.stringify({
        type: "auth",
        token: authToken,
        username: username,
        userId: userId
    });
    console.log("Sending auth payload:", authPayload);
    gatewaySocket.send(authPayload);
};

gatewaySocket.onmessage = (event) => {
    try {
        const data = JSON.parse(event.data);
        console.log("Gateway response:", data);
        if (data.type === "authAck") {
            const joinPayload = JSON.stringify({ game: "game1" });
            console.log("Sending join payload to gateway:", joinPayload);
            gatewaySocket.send(joinPayload);
        } else if (data.redirect) {
            gatewaySocket.close();
            connectToGame(data.redirect, data.game);
        } else if (data.error) {
            console.error("Gateway error:", data.error);
        } else if (data.message) {
            appendMessage(data.message);
        }
    } catch (err) {
        console.error("Error parsing gateway message:", err);
    }
};

function connectToGame(gameUrl, gameName) {
    console.log(`Connecting to game server: ${gameUrl}`);
    if (!gameUrl.startsWith("wss://")) {
        gameUrl = `wss://${window.location.host}${gameUrl}`;
    }
    const gameSocket = new WebSocket(gameUrl);
    gameSocket.onopen = () => {
        console.log(`Connected to ${gameName} server!`);
        activeSocket = gameSocket;
        sendData('chatMessage', 'Player connected!');
        updateStatus(true);
    };
    gameSocket.onmessage = async (event) => {
        console.log("Message from server:", event.data);
        let data = JSON.parse(await event.data.text());

        switch (data.type) {
            case "chatMessage":
                appendMessage(data.data);
                break;
            case "playerCount":
                updatePlayerCount(data.data);
                break;
            default:
                console.error("Invalid data:", data);
        }
    };
    gameSocket.onerror = (event) => {
        console.error("WebSocket error:", event);
        updateStatus(false);
    };
    gameSocket.onclose = () => {
        console.log(`Disconnected from ${gameName} server.`);
        updateStatus(false);
    };
}

const chatButton = document.getElementById("chatButton");
const chatPanel = document.getElementById("chatPanel");
const sendButton = document.getElementById("sendButton");
const chatInput = document.getElementById("chatInput");

chatButton.addEventListener("click", (event) => {
    if (chatPanel.style.right === "0vw") {
        chatPanel.style.right = "-30vw";
    } else {
        chatPanel.style.right = "0vw";
    }
});
sendButton.addEventListener("click", sendMessage);
chatInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        sendMessage();
    }
});
window.addEventListener("resize", (event) => {
    const gameCanvas = document.getElementById("gameCanvas");
    gameCanvas.width = window.innerWidth;
    gameCanvas.height = window.innerHeight;
});

function updateStatus(status) {
    const statusElement = document.getElementById("status");
    statusElement.style.color = status ? 'green' : 'red';
    statusElement.textContent = status ? "Online" : "Offline";
}

function updatePlayerCount(count) {
    const playerCountElement = document.getElementById("players");
    playerCountElement.textContent = count.toString();
}

function appendMessage(msg) {
    const messagesElement = document.getElementById("messages");
    const messageElement = document.createElement("p");
    messageElement.textContent = msg.toString();
    messagesElement.appendChild(messageElement);
}

function sendData(type, data) {
    if (activeSocket && activeSocket.readyState === WebSocket.OPEN) {
        const message = JSON.stringify({ type: type, data: data });
        const blob = new Blob([message], { type: 'application/json' });
        console.log("Sending data:", message);
        activeSocket.send(blob);
    } else {
        console.warn("Cannot send data. WebSocket closed.");
    }
}

function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
        sendData('chatMessage', message);
        chatInput.value = "";
    }
}