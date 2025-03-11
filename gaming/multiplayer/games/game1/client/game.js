// First connect to the gateway
const gatewaySocket = new WebSocket("wss://gaming.gangdev.co/socket");

gatewaySocket.onopen = () => {
    console.log("Connected to gateway");
    updateStatus("Connected to gateway");

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
        }
    } catch (err) {
        console.error("Error parsing gateway message:", err);
    }
};

function connectToGame(gameUrl, gameName) {
    console.log(`Connecting to game server: ${gameUrl}`); // Debug log

    if (!gameUrl.startsWith("wss://")) { // ensure url formatted properly
        gameUrl = `wss://${window.location.host}${gameUrl}`;
    }
    const gameSocket = new WebSocket(gameUrl);

    gameSocket.onopen = () => {
        console.log(`Connected to ${gameName} server!`);
        gameSocket.send("Hello from client!");
        updateStatus(`Connected to ${gameName}`);
    };

    gameSocket.onmessage = (event) => {
        console.log("Message from server:", event.data);
        appendMessage(event.data);
    };

    gameSocket.onerror = (event) => {
        console.error("WebSocket error:", event);
        updateStatus("Game server connection failed. Check if the server is running.");
    };

    gameSocket.onclose = () => {
        console.log(`Disconnected from ${gameName} server.`);
        updateStatus("Disconnected");
    };
}

function updateStatus(status) {
    const statusElement = document.getElementById("status");
    statusElement.textContent = status;
}

function appendMessage(msg) {
    const messagesElement = document.getElementById("messages");
    const messageElement = document.createElement("p");
    messageElement.textContent = msg;
    messagesElement.appendChild(messageElement);
}