const WebSocket = require("ws");

// setup websocket server
const PORT = process.env.PORT || 10000;
const gatewayServer = new WebSocket.Server({ port: PORT });

console.log(`Gateway running on wss://localhost:${PORT} (or wss://gaming.gangdev.co in production);`);

// define games and their ports
const games = {
    game1: { port: 10001 },
    game2: { port: 10002 },
    game3: { port: 10003 },
    game4: { port: 10004 },
    game5: { port: 10005 }
};

// handle incoming websocket connections
gatewayServer.on("connection", (ws) => {
    console.log("New client connected to gateway.");

    ws.on("message", (message) => {
        try {
            const data = JSON.parse(message);
            if (data.game && games[data.game]) {
                ws.send(JSON.stringify({ redirect: `wss://${process.env.DOMAIN || "localhost"}:${games[data.game].port}` }));
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