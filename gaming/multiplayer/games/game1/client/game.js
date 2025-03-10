const WebSocket = require("ws");

const info = {
    name: "game1",
    path: "/game1" // This path must match Apache's proxy path
};

const server = new WebSocket.Server({ noServer: true }); // Do not bind to a specific port

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

// Handle WebSocket upgrade requests forwarded by Apache
const http = require("http");
const serverHttp = http.createServer();

// Handle WebSocket upgrade requests forwarded by Apache
serverHttp.on("upgrade", (request, socket, head) => {
    if (request.url === info.path) { // Match the path `/game1`
        server.handleUpgrade(request, socket, head, (ws) => {
            server.emit("connection", ws, request);
        });
    } else {
        socket.destroy();
    }
});

// This server does not need to listen on a specific port
serverHttp.listen(10000, () => {
    console.log(`${info.name} WebSocket server running on wss://gaming.gangdev.co${info.path}`);
});
