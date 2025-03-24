require('dotenv').config({ path: '/var/www/gangdev/shared/.env' });
const WebSocket = require("ws");
const http = require("http");
const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY;
const gatewayPort = 10000;
const server = http.createServer();

// Declare the available games.
const games = [
    { name: "game1", path: "/game1", port: 10001 },
    { name: "game2", path: "/game2", port: 10002 }
];

const activeSockets = {};

const gatewayServer = new WebSocket.Server({ server });

gatewayServer.on("connection", (ws) => {
    let authenticated = false;
    let joined = false;

    ws.on("message", (message) => {
        try {
            const data = JSON.parse(message.toString());

            // Authenticate the user.
            if (!authenticated && data.type === "auth") {
                try {
                    jwt.verify(data.token, secretKey);
                    ws.user = { username: data.username, userId: data.userId };
                    authenticated = true;
                    if (activeSockets[ws.user.userId]) {
                        activeSockets[ws.user.userId].close();
                    }
                    activeSockets[ws.user.userId] = ws;
                    ws.send(JSON.stringify({ type: "authAck" }));
                } catch (err) {
                    ws.send(JSON.stringify({ error: "Authentication failed." }));
                    return ws.close();
                }
                return;
            }

            if (!authenticated) {
                ws.send(JSON.stringify({ error: "Not authenticated." }));
                return ws.close();
            }

            // Process game join requests.
            if (typeof data.game !== 'undefined' && !joined) {
                const requestedGameName = data.game.trim();
                const game = games.find(g => g.name === requestedGameName);
                if (game) {
                    joined = true;
                    const domain = process.env.DOMAIN || "gaming.gangdev.co";
                    const redirectUrl = `wss://${domain}${game.path}?userId=${ws.user.userId}`;
                    ws.send(JSON.stringify({
                        redirect: redirectUrl,
                        game: game.name
                    }));
                    console.log(`Redirecting user ${ws.user.userId} to ${game.path}`);
                } else {
                    ws.send(JSON.stringify({ error: "Invalid game requested." }));
                    return ws.close();
                }
            }
        } catch (err) {
            ws.send(JSON.stringify({ error: "Invalid message format." }));
        }
    });

    ws.on("close", () => {
        if (ws.user && activeSockets[ws.user.userId] === ws) {
            delete activeSockets[ws.user.userId];
        }
    });
});

server.listen(gatewayPort, "127.0.0.1", () => {
    console.log(`Gateway running on port ${gatewayPort}`);
});