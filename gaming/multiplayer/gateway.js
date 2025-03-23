require('dotenv').config({ path: '/var/www/gangdev/shared/.env' });
const WebSocket = require("ws");
const http = require("http");
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

const p = 10000;
const server = http.createServer();
const gatewayServer = new WebSocket.Server({ server });

const game1 = { path: "/game1", port: 10001 };
// Track active connections per user ID.
const activeSockets = {};

gatewayServer.on("connection", (ws) => {
    console.log("Gateway: New client connected.");
    let authenticated = false;
    let joined = false;

    ws.on("message", (message) => {
        try {
            const data = JSON.parse(message.toString());
            // Process auth message.
            if (!authenticated && data.type === "auth") {
                try {
                    jwt.verify(data.token, secretKey);
                    ws.user = { username: data.username, userId: data.userId };
                    authenticated = true;
                    console.log(`Gateway: Authenticated user ${data.username}.`);

                    // Enforce one connection per user.
                    if (activeSockets[ws.user.userId]) {
                        activeSockets[ws.user.userId].close();
                    }
                    activeSockets[ws.user.userId] = ws;
                    ws.send(JSON.stringify({ type: "authAck" }));
                } catch (err) {
                    ws.send(JSON.stringify({ error: "Authentication failed." }));
                    console.error("Gateway: Authentication failed.", err);
                    return ws.close();
                }
                return;
            }

            if (!authenticated) {
                ws.send(JSON.stringify({ error: "Not authenticated." }));
                return ws.close();
            }

            // Process join message.
            if (typeof data.game !== 'undefined') {
                if (!joined) {
                    if (data.game.trim() === "game1") {
                        joined = true;
                        const domain = process.env.DOMAIN || "gaming.gangdev.co";
                        ws.send(JSON.stringify({
                            redirect: `wss://${domain}${game1.path}?userId=${ws.user.userId}`,
                            game: "game1"
                        }));
                        console.log(`Gateway: Redirecting user ${ws.user.userId} to ${game1.path}.`);
                    } else {
                        ws.send(JSON.stringify({ error: "Invalid game requested." }));
                        console.log("Gateway: Invalid game requested:", data.game);
                        return ws.close();
                    }
                } else {
                    // Ignore duplicate join messages.
                }
            }
        } catch (err) {
            ws.send(JSON.stringify({ error: "Invalid message format." }));
            console.error("Gateway: Error processing message.", err);
        }
    });

    ws.on("close", () => {
        console.log("Gateway: Client disconnected.");
        if (ws.user && activeSockets[ws.user.userId] === ws) {
            delete activeSockets[ws.user.userId];
        }
    });
});

server.listen(p, "127.0.0.1", () => {
    console.log(`Gateway running on port ${p}`);
});