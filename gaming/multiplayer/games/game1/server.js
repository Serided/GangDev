const WebSocket = require("ws");
const info = {
    name: "game1",
    path: "/game1"
}

const server = new WebSocket.Server({ noServer: true }); // dont bind to specific port we rely on apache

server.on("connection", (ws) => {
    console.log(`Player connected to ${info.name}`);

    ws.on("message", (msg) => {
        console.log(`Received ${msg}`);
        ws.send(`Echo from ${info.name}: ${msg}`);
    });

    ws.on("close", () => {
        console.log(`Player disconnected from ${info.name}`)
    });
});

// handle upgrade requests from apache
const http = require("http");
const serverHttp = http.createServer();
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
