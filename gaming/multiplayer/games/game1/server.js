const WebSocket = require("ws");
const http = require("http");

const info = {
    name: "game1",
    path: "/game1"
};

// Create HTTP server first
const httpServer = http.createServer();

// Create WebSocket server attached to the HTTP server
const wsServer = new WebSocket.Server({
    noServer: true  // Important! Don't bind directly to a port
});

wsServer.on("connection", (ws) => {
    console.log(`Player connected to ${info.name}`);

    ws.on("message", (msg) => {
        console.log(`Received: ${msg}`);
        ws.send(`Echo from ${info.name}: ${msg}`);
    });

    ws.on("close", () => {
        console.log(`Player disconnected from ${info.name}`);
    });
});

// Handle upgrade requests
httpServer.on("upgrade", (request, socket, head) => {
    // Check if this is a request for this game's path
    if (request.url === info.path) {
        wsServer.handleUpgrade(request, socket, head, (ws) => {
            wsServer.emit("connection", ws, request);
        });
    } else {
        socket.destroy();
    }
});

// Listen on a different port than your gateway
const PORT = 10001;
httpServer.listen(PORT, () => {
    console.log(`${info.name} WebSocket server running on port ${PORT}`);
});