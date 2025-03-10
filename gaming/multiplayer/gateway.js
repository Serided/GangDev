const WebSocket = require("ws");

// setup websocket server
const PORT = process.env.PORT || 10000;
const gatewayServer = new WebSocket.Server({ port: PORT });

console.log(`Gateway running on wss://localhost:${PORT} (or wss://gaming.gangdev.co in production);`);

// define games and their paths
const games = {
    game1: { path: "/game1" },
    game2: { path: "/game2" },
    game3: { path: "/game3" },
    game4: { path: "/game4" },
    game5: { path: "/game5" }
};

// handle incoming websocket connections
gatewayServer.on("connection", (ws) => {
    console.log("New client connected to gateway.");

    ws.on("message", (message) => {
        try {
            const data = JSON.parse(message);
            if (data.game && games[data.game]) {
                ws.send(JSON.stringify({ redirect: `wss://${process.env.DOMAIN || "localhost"}:${games[data.game].path}` }));
            } else {
                ws.send(JSON.stringify({ error: "Invalid game requested." }));
            }
        } catch (err) {
            ws.send(JSON.stringify({ error: "Invalid message format." }));
        }
    });

    ws.on("close", () => {
        console.log("Client disconnected from gateway.");
    })
})