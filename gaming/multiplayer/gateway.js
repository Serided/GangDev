require('dotenv').config({ path: '/var/www/gangdev/shared/.env' });
const WebSocket = require("ws");
const http = require("http");
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

const p = 10000;
const server = http.createServer();
const gatewayServer = new WebSocket.Server({ server });

const game1 = { path: "/game1", port: 10001 };

// Global object to track active connections per userId.
const activeSockets = {};

gatewayServer.on("connection", (ws) => {
    console.log("New client connected to gateway.");
    let authenticated = false;
    let joined = false; // Flag to ensure join is processed only once

    ws.on("message", (message) => {
        try {
            const data = JSON.parse(message.toString());
            console.log("Gateway received:", data);

            // Process authentication message first.
            if (!authenticated && data.type === "auth") {
                try {
                    const decoded = jwt.verify(data.token, secretKey);
                    ws.user = { username: data.username, userId: data.userId };
                    authenticated = true;
                    console.log(`Authenticated user: ${data.username}`);

                    // Enforce one active connection per user.
                    if (activeSockets[ws.user.userId]) {
                        console.log(`Existing connection for user ${ws.user.userId} found. Closing it.`);
                        activeSockets[ws.user.userId].close();
                    }
                    activeSockets[ws.user.userId] = ws;

                    // Send back an authentication acknowledgment.
                    ws.send(JSON.stringify({ type: "authAck" }));
                } catch (err) {
                    ws.send(JSON.stringify({ error: "Authentication failed." }));
                    console.error("Authentication failed:", err);
                    return ws.close();
                }
                return; // Do not process further; wait for next message.
            }

            // Reject any message if not authenticated.
            if (!authenticated) {
                ws.send(JSON.stringify({ error: "Not authenticated." }));
                return ws.close();
            }

            // Process join request for game1, but only once per connection.
            if (data.game) {
                if (!joined) {
                    if (data.game.trim() === "game1") {
                        joined = true;
                        const domain = process.env.DOMAIN || "gaming.gangdev.co";
                        ws.send(JSON.stringify({
                            redirect: `wss://${domain}${game1.path}`,
                            game: "game1"
                        }));
                        console.log(`Redirecting authenticated client to ${game1.path}`);
                    } else {
                        ws.send(JSON.stringify({ error: "Invalid game requested." }));
                        console.log("Invalid game requested:", data.game);
                        return ws.close();
                    }
                } else {
                    // If a join message is received again, log and ignore it.
                    console.log("Duplicate join request received. Ignoring:", data.game);
                }
            }
        } catch (err) {
            ws.send(JSON.stringify({ error: "Invalid message format." }));
            console.error("Error processing message:", err);
        }
    });

    ws.on("close", () => {
        console.log("Client disconnected from gateway.");
        if (ws.user && activeSockets[ws.user.userId] === ws) {
            delete activeSockets[ws.user.userId];
        }
    });
});

server.listen(p, "127.0.0.1", () => {
    console.log(`Gateway running on port ${p}`);
});
