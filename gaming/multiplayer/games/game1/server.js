const WebSocket = require("ws");
const http = require("http");

const info = { name: "game1", path: "/game1" };

// Create WebSocket server and HTTP server for upgrade handling
const wsServer = new WebSocket.Server({ noServer: true });

wsServer.on("connection", (ws) => {
    console.log(`Player connected to ${info.name}`);

    ws.on("message", (msg) => ws.send(`Echo from ${info.name}: ${msg}`));
    ws.on("close", () => console.log(`Player disconnected from ${info.name}`));
});

const httpServer = http.createServer();

httpServer.on("upgrade", (req, socket, head) => {
    if (req.url === info.path) {
        wsServer.handleUpgrade(req, socket, head, (ws) => wsServer.emit("connection", ws, req));
    } else {
        socket.destroy();
    }
});

httpServer.listen(10000, () => {
    console.log(`${info.name} WebSocket server running on wss://gaming.gangdev.co${info.path}`);
});
