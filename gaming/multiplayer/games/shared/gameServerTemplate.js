const WebSocket = require("ws");
const http = require("http");

class GameServer {
    constructor(gameInfo) {
        this.info = gameInfo;
        this.port = gameInfo.port;
        this.path = gameInfo.path;
        this.name = gameInfo.name;

        this.server = http.createServer();
        this.wss = new WebSocket.Server({ server: this.server });

        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.wss.on("connection", (ws) => {
            console.log(`Player connected to ${this.name}`);

            ws.on("message", (message) => {
                console.log(`${this.name} received: ${message}`);
                ws.send(`Echo from ${this.name}: ${message}`);
            });

            ws.on("close", () => {
                console.log(`Player disconnected from ${this.name}`);
            });
        });

        this.server.listen(this.port, () => {
            console.log(`${this.name} server running on port ${this.port}`);
        });
    }
}

// Usage:
// const gameInfo = { name: "Game1", path: "/game1", port: 10001 };
// const game = new GameServer(gameInfo);

module.exports = GameServer;