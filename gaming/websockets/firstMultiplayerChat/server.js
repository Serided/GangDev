const express = require("express");
const http = require("http");  // Ensure you're using http for WebSocket server
const { WebSocketServer } = require("ws");

const app = express();

const server = http.createServer(app); // Use HTTP server to handle WebSocket connections

let clientCount = 0;

// Set up express to serve static files and handle routing
app.use(express.static(__dirname));
app.get("/", (req, res) => { res.sendFile("index.html", {root: __dirname}) });

// WebSocket server attached to HTTP server (to match reverse proxy)
const sockserver = new WebSocketServer({ server });

sockserver.on("connection", (ws) => {
    clientCount++;
    console.log("client connected - clients: ", clientCount)
    broadcastClientCount();

    ws.send("connection established!");

    ws.on("close", () => {
        clientCount--;
        console.log("client disconnected - clients: ", clientCount)
        broadcastClientCount();
    });

    ws.on("message", (data) => {
        sockserver.clients.forEach((client) => {
            console.log(`distributing message: ${data}`);
            client.send(data);  // Send message to all clients
        });
    });

    ws.onerror = function () {
        console.log("websocket error");
    };
});

function broadcastClientCount() {
    sockserver.clients.forEach((client) => {
        client.send(`client count: ${clientCount}`);
    });
}

// Start the HTTP server (Apache is handling SSL termination)
server.listen(10001, () => console.log("websocket server running on port 10001"));
