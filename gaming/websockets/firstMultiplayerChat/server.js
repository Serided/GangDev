var serverPort = 6000;
var clientPort = 6001;

const express = require("express");
const webserver = express()
    .use((req, res) => res.sendFile("/index.html", { root: __dirname }))
    .listen(15001, () => console.log(`Listening on ${15001}`));

const { WebSocketServer } = require("ws");
const sockserver = new WebSocketServer({ port: 10001 });

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