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
            gatewaySocket.close();
            connectToGame(data.redirect, data.game);
        } else if (data.error) {
            updateStatus(`Error: ${data.error}`);
        }
    } catch (err) {
        console.error("Error parsing gateway message:", err);
        updateStatus("Error");
    }
};

// Handle game connection
function connectToGame(gameUrl, gameName) {
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

    gameSocket.onerror = (error) => {
        console.error("WebSocket error:", error);
        updateStatus("Error");
    };

    gameSocket.onclose = () => {
        console.log(`Disconnected from ${gameName} server.`);
        updateStatus("Disconnected");
    };

    // Handle cube movement
    let cubePosition = { x: 250, y: 250 };

    // Update the cube position based on keyboard input
    document.addEventListener("keydown", (event) => {
        const moveSpeed = 10;

        if (event.key === "ArrowUp") {
            cubePosition.y -= moveSpeed;
        } else if (event.key === "ArrowDown") {
            cubePosition.y += moveSpeed;
        } else if (event.key === "ArrowLeft") {
            cubePosition.x -= moveSpeed;
        } else if (event.key === "ArrowRight") {
            cubePosition.x += moveSpeed;
        }

        // Send updated position to the server
        gameSocket.send(JSON.stringify({ type: 'move', position: cubePosition }));
    });
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

// Check stored login token
console.log(localStorage.getItem("userToken"));
