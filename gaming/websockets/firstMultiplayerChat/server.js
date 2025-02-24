var serverPort = 6000;
var clientPort = 6001;

const express = require("express");
const fs = require("fs");
const https = require("https");
const http = require("http");
const { WebSocketServer } = require("ws");

const app = express();

const privateKey = fs.readFileSync("/etc/letsencrypt/live/gaming.gangdev.co/privkey.pem", "utf8");
const certificate = fs.readFileSync("/etc/letsencrypt/live/gaming.gangdev.co/cert.pem", "utf8");
const ca = fs.readFileSync("/etc/letsencrypt/live/gaming.gangdev.co/chain.pem", "utf8");

const credentials = { key: privateKey, cert: certificate, ca: ca };
const server = https.createServer(credentials, app);

const httpServer = http.createServer((req, res) => {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
});

httpServer.listen(80, () => console.log('HTTP server redirecting to HTTPS on port 80'))

app.use(express.static(__dirname));
app.get("/", (req, res) => { res.sendFile("index.html", {root: __dirname}) });
server.listen(10001, () => console.log(`HTTPS server running on 10001`));

const sockserver = new WebSocketServer({ server });

sockserver.on("connection", (ws) => {
    console.log("New client connected!");
    ws.send("connection established");
    ws.on("close", () => console.log("Client has disconnected!"));
    ws.on("message", (data) => {
        sockserver.clients.forEach((client) => {
            console.log(`distributing message: ${data}`);
            client.send(`${data}`); // sends the data to users
        });
    });
    ws.onerror = function () {
        console.log("websocket error");
    };
});