const WebSocket = require("ws");
const http = require("http");

const server = http.createServer();
const gatewayServer = new WebSocket.Server({ server });
const games = { game1: { path: "/game1" } };

gatewayServer.on("connection", (ws) => {
    console.log("Client connected to gateway.");

    ws.on("message", (message) => {
        try {
            const data = JSON.parse(message);
            if (games[data.game]) {
                ws.send(JSON.stringify({ redirect: `wss://gaming.gangdev.co${games[data.game].path}` }));
            }
        } catch {
            ws.send(JSON.stringify({ error: "Invalid message format." }));
        }
    });

    ws.on("close", () => console.log("Client disconnected from gateway."));
});

server.listen(10000, "127.0.0.1", () => console.log("Gateway running on port 10000"));
