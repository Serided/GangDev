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
        console.log("Raw gateway response:", event.data); // Debugging raw response
        const data = JSON.parse(event.data);
        console.log("Parsed Gateway Response:", data);

        if (data.redirect) {
            // Close gateway connection
            gatewaySocket.close();

            // Connect to the game server
            connectToGame(data.redirect, data.game);
        } else if (data.error) {
            console.error("Gateway error:", data.error);
            updateStatus(`Gateway Error ❌`);
        }
    } catch (err) {
        console.error("Error parsing gateway message:", err);
        updateStatus("Error ❌");
    }
};

// Handle game connection
function connectToGame(gameUrl, gameName) {
    const gameSocket = new WebSocket(gameUrl);

    gameSocket.onopen = () => {
        console.log(`✅ Connected to ${gameName} server!`);
        gameSocket.send("Hello from client!");
        updateStatus(`Connected to ${gameName} ✅`);
    };

    gameSocket.onmessage = (event) => {
        console.log("📩 Message from server:", event.data);
        appendMessage(event.data);
    };

    gameSocket.onerror = (error) => {
        console.error("❌ WebSocket error:", error);
        updateStatus("Error ❌");
    };

    gameSocket.onclose = () => {
        console.log(`🔌 Disconnected from ${gameName} server.`);
        updateStatus("Disconnected 🔌");
    };
}

// Handle login submission
function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!username || !password) {
        updateStatus("⚠️ Enter username and password");
        return;
    }

    const loginData = JSON.stringify({
        type: "signin",
        username,
        password
    });

    console.log("🔄 Sending login request:", loginData);
    gatewaySocket.send(loginData);
}

// Handle login responses from WebSocket
gatewaySocket.onmessage = (event) => {
    try {
        console.log("Raw server response:", event.data);
        const data = JSON.parse(event.data);
        console.log("Parsed Server Response:", data);

        if (data.token) {
            console.log(`✅ Login successful! Token: ${data.token}`);
            localStorage.setItem("userToken", data.token);
            updateStatus("✅ Logged in!");
        } else {
            console.error("❌ Login failed:", data.error);
            updateStatus(`❌ ${data.error}`);
        }
    } catch (err) {
        console.error("Error parsing server response:", err);
        updateStatus("Error ❌");
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
console.log("Stored Token:", localStorage.getItem("userToken"));
