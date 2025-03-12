let activeSocket = null;

// First connect to the gateway
const gatewaySocket = new WebSocket("wss://gaming.gangdev.co/socket");

gatewaySocket.onopen = () => {
    console.log("Connected to gateway");
    updateStatus(true);

    const payload = JSON.stringify({ game: "game1" });
    console.log("Sending message to gateway:", payload); // NEW: Log the actual message
    gatewaySocket.send(payload);
};

gatewaySocket.onmessage = (event) => {
    try {
        const data = JSON.parse(event.data);
        console.log("Gateway response:", data);

        if (data.redirect) {
            gatewaySocket.close(); // close gateway connection
            connectToGame(data.redirect, data.game); // connect to game
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

    if (!gameUrl.startsWith("wss://")) { // ensure url formatted properly
        gameUrl = `wss://${window.location.host}${gameUrl}`;
    }
    const gameSocket = new WebSocket(gameUrl);

    gameSocket.onopen = () => {
        console.log(`Connected to ${gameName} server!`);
        activeSocket = gameSocket;
        sendData('chatMessage', 'Player connected!')
        updateStatus(true);
    };

    gameSocket.onmessage = async (event) => {
        console.log("Message from server:", event.data);

        let data;
        if (event.data instanceof Blob) {
            data = JSON.parse(await event.data.text());
        } else {
            data = JSON.parse(event.data);
        }

        if (data.type === 'chatMessage') {
            appendMessage(data.data);
        } else if (data.type === 'playerCount') {
            updatePlayerCount(data.data);
        } else {
            console.error("Invalid data:", data);
        }
    };

    gameSocket.onerror = (event) => {
        console.error("WebSocket error:", event);
        updateStatus(false);
    };

    gameSocket.onclose = () => {
        console.log(`Disconnected from ${gameName} server.`);
        sendData('chatMessage', 'Player disconnected.');
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
    const playerCountElement = document.getElementById("playerCount");
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
        const message = { type: type, data: data }
        console.log("Sending data:", message);
        activeSocket.send(message);
    } else {
        console.warn("Cannot send data. Websocket closed.")
    }
}

function sendMessage() {
    if (chatInput.value.trim()) {
        sendData('chatMessage', chatInput.value.trim())
        chatInput.value = ""; // clear input after sending
    }
}