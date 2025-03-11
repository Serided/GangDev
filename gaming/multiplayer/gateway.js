const wbSkt = require("ws");
const http = require("http");

// Setup HTTP server with WebSocket server
const p = 10000;
const server = http.createServer();
const gatewayServer = new wbSkt.Server({ server });

// Define games and their ports
const games = {
    game1: { path: "/game1", port: 10001 },
    game2: { path: "/game2", port: 10002 },
    game3: { path: "/game3", port: 10003 },
    game4: { path: "/game4", port: 10004 },
    game5: { path: "/game5", port: 10005 },
};

gatewayServer.on("connection", (ws) => {
    console.log("New client connected to gateway.");

    ws.on("message", (message) => {
        try {
            // Parse the message to JSON
            const data = JSON.parse(message.toString());
            console.log("Gateway received:", data);

            if (data.game && games[data.game]) {
                const domain = process.env.DOMAIN || "gaming.gangdev.co";
                const gameInfo = games[data.game];
                ws.send(JSON.stringify({
                    redirect: `wss://${domain}${gameInfo.path}`,
                    game: data.game
                }));
                console.log(`Redirecting client to ${gameInfo.path}`);
            } else {
                ws.send(JSON.stringify({ error: "Invalid game requested." }));
                console.log("Invalid game requested:", data.game);
            }
        } catch (err) {
            console.error("Error processing message:", err);
            ws.send(JSON.stringify({ error: "Invalid message format." }));
        }
    });

    ws.on("close", () => {
        console.log("Client disconnected from gateway.");
    });
});

server.listen(p, "127.0.0.1", () => {
    console.log(`Gateway running on port ${p}`);
    console.log("Available games:", Object.keys(games).join(", "));
});
