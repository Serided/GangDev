const WebSocket = require("ws");
const info = {
    name: "game1",
    path: "/game1"
};

// Use "noServer" to handle WebSocket upgrades via Apache proxy
const server = new WebSocket.Server({ noServer: true });

server.on("connection", (ws) => {
    console.log(`Player connected to ${info.name}`);

    ws.on("message", (msg) => {
        console.log(`Received: ${msg}`);
        ws.send(`Echo from ${info.name}: ${msg}`);
    });

    ws.on("close", () => {
        console.log(`Player disconnected from ${info.name}`);
    });
});

// Don't listen on port 10000 manually; Apache will forward WebSocket upgrades to this server
const http = require("http");
const serverHttp = http.createServer();

// Handle WebSocket upgrade requests forwarded by Apache
serverHttp.on("upgrade", (request, socket, head) => {
    if (request.url === info.path) {
        server.handleUpgrade(request, socket, head, (ws) => {
            server.emit("connection", ws, request);
        });
    } else {
        socket.destroy();
    }
});

serverHttp.listen(10000, () => {
    console.log(`${info.name} WebSocket server running on wss://gaming.gangdev.co${info.path}`);
});