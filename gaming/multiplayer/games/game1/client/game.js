// Establish the WebSocket connection to the gateway server
const ws = new WebSocket("ws://localhost:10000");  // Connect to the gateway

ws.onopen = () => {
    console.log("Connected to Gateway!");

    // Request to join "game1"
    ws.send(JSON.stringify({ game: "game1" }));
};

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.redirect) {
        // Redirect to the game-specific WebSocket server (game1)
        console.log(`Redirecting to: ${data.redirect}`);
        connectToGameServer(data.redirect);
    } else if (data.error) {
        console.log(`Error: ${data.error}`);
    }
};

ws.onerror = (err) => {
    console.error("WebSocket error:", err);
};

// Connect to the game-specific WebSocket server
function connectToGameServer(url) {
    const gameWS = new WebSocket(url);

    gameWS.onopen = () => {
        console.log("Connected to Game Server!");

        // Send an initial message (e.g., player joining game)
        gameWS.send("Hello from client!");
    };

    gameWS.onmessage = (event) => {
        console.log("Message from game server:", event.data);
    };

    gameWS.onerror = (err) => {
        console.error("Game WebSocket error:", err);
    };
}