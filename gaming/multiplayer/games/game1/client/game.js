// Assuming authToken, username, and userId are embedded by index.php
const gatewaySocket = new WebSocket("wss://gaming.gangdev.co/socket");

gatewaySocket.onopen = () => {
    console.log("Connected to gateway");
    updateStatus(true);

    // Send authentication message immediately
    const authPayload = JSON.stringify({
        type: "authenticate",
        token: authToken,  // token embedded in the PHP page
        username: username,
        userId: userId
    });
    gatewaySocket.send(authPayload);

    // After a short delay (or immediately, if preferred), request to join game1
    const joinPayload = JSON.stringify({ game: "game1" });
    gatewaySocket.send(joinPayload);
};

gatewaySocket.onmessage = (event) => {
    try {
        const data = JSON.parse(event.data);
        if (data.error) {
            console.error("Gateway error:", data.error);
        } else if (data.redirect) {
            console.log("Redirecting to game server:", data.redirect);
            gatewaySocket.close();
            // Connect to the game server (game1) using the provided redirect URL
            connectToGame(data.redirect, "game1");
        }
    } catch (err) {
        console.error("Error parsing gateway message:", err);
    }
};

function connectToGame(gameUrl, gameName) {
    console.log(`Connecting to ${gameName} at ${gameUrl}`);
    const gameSocket = new WebSocket(gameUrl);
    gameSocket.onopen = () => {
        console.log(`Connected to ${gameName} server!`);
        activeSocket = gameSocket;
        updateStatus(true);
        // Optionally send a "Player connected" message here
    };
    gameSocket.onmessage = (event) => {
        console.log("Message from server:", event.data);
        // Handle game server messages (e.g., chat or game updates)
    };
    gameSocket.onerror = (event) => {
        console.error("Game WebSocket error:", event);
        updateStatus(false);
    };
    gameSocket.onclose = () => {
        console.log(`Disconnected from ${gameName} server.`);
        updateStatus(false);
    };
}
