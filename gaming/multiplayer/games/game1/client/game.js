const gatewaySocket = new WebSocket("wss://gaming.gangdev.co/socket");

gatewaySocket.onopen = () => {
    console.log("Connected to gateway");
    gatewaySocket.send(JSON.stringify({ game: "game1" }));
};

gatewaySocket.onmessage = (event) => {
    try {
        const data = JSON.parse(event.data);
        if (data.redirect) {
            gatewaySocket.close();
            connectToGame(data.redirect);
        }
    } catch (err) {
        console.error("Error parsing gateway message:", err);
    }
};

function connectToGame(gameUrl) {
    console.log(`Connecting to game server: ${gameUrl}`);
    const gameSocket = new WebSocket(gameUrl);

    gameSocket.onopen = () => {
        console.log("Connected to game server!");
        gameSocket.send("Hello from client!");
    };

    gameSocket.onmessage = (event) => console.log("Message from server:", event.data);
    gameSocket.onerror = () => console.error("WebSocket error");
    gameSocket.onclose = () => console.log("Disconnected from game server.");
}