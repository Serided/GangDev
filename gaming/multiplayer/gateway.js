const WebSocket = require("ws");

// Setup websocket server on a different port than game servers
const PORT = 10000;
const gatewayServer = new WebSocket.Server({ port: PORT });

console.log(`Gateway running on port ${PORT}`);

// Define games and their paths/ports
const games = {
    game1: { path: "/game1", port: 10001 },
    game2: { path: "/game2", port: 10002 },
    // Add other games
};

// Handle incoming websocket connections
gatewayServer.on("connection", (ws) => {
    console.log("New client connected to gateway.");

    ws.on("message", (message) => {
        try {
            const data = JSON.parse(message);
            if (data.game && games[data.game]) {
                const domain = process.env.DOMAIN || "gaming.gangdev.co";
                ws.send(JSON.stringify({
                    redirect: `wss://${domain}${games[data.game].path}`
                }));
            } else {
                ws.send(JSON.stringify({ error: "Invalid game requested." }));
            }
        } catch (err) {
            ws.send(JSON.stringify({ error: "Invalid message format." }));
        }
    });

    ws.on("close", () => {
        console.log("Client disconnected from gateway.");
    });
});