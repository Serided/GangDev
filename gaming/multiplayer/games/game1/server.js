const WebSocket = require("ws");
const info = {
    name: "game1",
    port: 10001
}

const server = new WebSocket.Server({ port: info.port }); // specific port

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

console.log(`${info.name} websocket server running on ws://localhost:${info.port}`);