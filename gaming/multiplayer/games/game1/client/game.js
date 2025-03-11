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
}

// Handle login submission
function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!username || !password) {
        updateStatus("Enter username and password");
        return;
    }

    const loginData = JSON.stringify({
        type: "signin",
        username,
        password
    });

    gatewaySocket.send(loginData);
}

// Handle login responses from WebSocket
gatewaySocket.onmessage = (event) => {
    try {
        const data = JSON.parse(event.data);

        if (data.token) {
            localStorage.setItem("userToken", data.token);
            updateStatus("Logged in successfully!");
        } else {
            updateStatus(`Login failed: ${data.error}`);
        }
    } catch (err) {
        console.error("Error parsing server response:", err);
        updateStatus("Error");
    }
};

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
