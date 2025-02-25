const express = require("express");
const fs = require("fs");
const https = require("https");
const http = require("http");  // Ensure you're using http for WebSocket server
const { WebSocketServer } = require("ws");

const app = express();

// SSL certificate paths
const privateKey = fs.readFileSync("/etc/letsencrypt/live/gaming.gangdev.co/privkey.pem", "utf8");
const certificate = fs.readFileSync("/etc/letsencrypt/live/gaming.gangdev.co/cert.pem", "utf8");
const ca = fs.readFileSync("/etc/letsencrypt/live/gaming.gangdev.co/chain.pem", "utf8");

const credentials = { key: privateKey, cert: certificate, ca: ca };

// Create the HTTP server that will handle the WebSocket traffic
const server = http.createServer(app); // Use HTTP server to handle WebSocket connections

// Set up express to serve static files and handle routing
app.use(express.static(__dirname));
app.get("/", (req, res) => { res.sendFile("index.html", {root: __dirname}) });

// WebSocket server attached to HTTP server (to match reverse proxy)
const sockserver = new WebSocketServer({ server });

sockserver.on("connection", (ws) => {
    console.log("New client connected!");
    ws.send("connection established");

    ws.on("close", () => console.log("Client has disconnected!"));
    ws.on("message", (data) => {
        sockserver.clients.forEach((client) => {
            console.log(`distributing message: ${data}`);
            client.send(`${data}`);  // Send message to all clients
        });
    });

    ws.onerror = function () {
        console.log("WebSocket error");
    };
});

// Start the HTTP server (Apache is handling SSL termination)
server.listen(10001, () => console.log("WebSocket server running on port 10001"));
