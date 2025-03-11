// First connect to the gateway
const gatewaySocket = new WebSocket("wss://gaming.gangdev.co/socket");

gatewaySocket.onopen = () => {
    console.log("Connected to gateway");
    // Request game connection
    gatewaySocket.send(JSON.stringify({ game: "game1" }));
};

gatewaySocket.onmessage = (event) => {
    try {
        const data = JSON.parse(event.data);
        console.log("Gateway response:", data);

        if (data.redirect) {
            // Close gateway connection
            gatewaySocket.close();

            // Connect to game server
            connectToGame(data.redirect, data.game);
        } else if (data.error) {
            console.error("Gateway error:", data.error);
        }
    } catch (err) {
        console.error("Error parsing gateway message:", err);
    }
};

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
