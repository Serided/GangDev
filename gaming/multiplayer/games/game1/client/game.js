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
        activeSocket.send("Player connected!");
        updateStatus(true);
    };

    gameSocket.onmessage = (event) => {
        console.log("Message from server:", event.data);
        let message = JSON.parse(event.data);

        if (message instanceof Blob) { // if blob convert to string
            message.text().then((text) => {
                console.log("Message converted from Blob:", text);
                appendMessage(text);
            }).catch((err) => {
                appendMessage(message);
            })
        } else {
            if (message.type === 'playerCount') {
                updatePlayerCount(message.count);
            } else {
                appendMessage(message);
            }
        }
    };

    gameSocket.onerror = (event) => {
        console.error("WebSocket error:", event);
        updateStatus(false);
    };

    gameSocket.onclose = () => {
        console.log(`Disconnected from ${gameName} server.`);
        gameSocket.send("Player disconnected.");
        updateStatus(false);
    };
}

function updateStatus(status) {
    const statusElement = document.getElementById("status");

    if (status) {
        statusElement.style.color = 'green';
        statusElement.textContent = "Online";
    } else {
        statusElement.style.color = 'red';
        statusElement.textContent = 'Offline';
    }
}

function updatePlayerCount(count) {
    const playerCountElement = document.getElementById("playerCount");
    playerCountElement.textContent = count;
}

function appendMessage(msg) {
    const messagesElement = document.getElementById("messages");
    const messageElement = document.createElement("p");
    messageElement.textContent = msg;
    messagesElement.appendChild(messageElement);
}

const chatButton = document.getElementById("chatButton");
const chatPanel = document.getElementById("chatPanel");

chatButton.addEventListener("click", (event) => {
    if (chatPanel.style.right === "0vw") {
        chatPanel.style.right = "-30vw";
    } else {
        chatPanel.style.right = "0vw";
    }
});

const sendButton = document.getElementById("sendButton");
const chatInput = document.getElementById("chatInput");

sendButton.addEventListener("click", sendMessage);
chatInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        sendMessage();
    }
});

function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
        console.log("Sending message:", message);
        activeSocket.send(message);
        chatInput.value = ""; // clear input after sending
    }
}

window.addEventListener("resize", (event) => {
    const gameCanvas = document.getElementById("gameCanvas");
    gameCanvas.width = window.innerWidth;
    gameCanvas.height = window.innerHeight;
})