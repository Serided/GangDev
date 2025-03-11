// Connect to the gateway
const gatewaySocket = new WebSocket("wss://gaming.gangdev.co/socket");

gatewaySocket.onopen = () => {
    console.log("Connected to gateway");
    updateStatus("Connected to gateway");

    // Request game connection
    gatewaySocket.send(JSON.stringify({ game: "game1" }));
};

// Handle messages from the gateway
gatewaySocket.onmessage = (event) => {
    try {
        const data = JSON.parse(event.data);

        if (data.redirect) {
            // Close the gateway connection and use the provided URL to connect to the game server
            gatewaySocket.close();
            connectToGame(data.redirect);  // Use the provided game server URL to connect
        } else if (data.error) {
            updateStatus(`Error: ${data.error}`);
        }
    } catch (err) {
        console.error("Error parsing gateway message:", err);
        updateStatus("Error");
    }
};

// Handle the game server connection
function connectToGame(gameUrl) {
    const gameSocket = new WebSocket(gameUrl);

    gameSocket.onopen = () => {
        console.log("Connected to game server!");
        updateStatus("Connected to game server!");

        // Send an initial message to the game server
        gameSocket.send("Hello from client!");
    };

    gameSocket.onmessage = (event) => {
        console.log("Message from server:", event.data);
        appendMessage(event.data);
    };

    gameSocket.onerror = (error) => {
        console.error("WebSocket error:", error);
        updateStatus("Error");
    };

    gameSocket.onclose = () => {
        console.log("Disconnected from game server.");
        updateStatus("Disconnected");
    };
}

// Update status text
function updateStatus(status) {
    const statusElement = document.getElementById("status");
    if (statusElement) statusElement.textContent = status;
}

// Append messages to the chat log
function appendMessage(msg) {
    const messagesElement = document.getElementById("messages");
    const messageElement = document.createElement("p");
    messageElement.textContent = msg;
    messagesElement.appendChild(messageElement);
}
