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

    ws.on("message", (message) => {
        try {
            const data = JSON.parse(message.toString());

            // Process authentication first.
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
                } catch (err) {
                    ws.send(JSON.stringify({ error: "Authentication failed." }));
                    console.error("Authentication failed:", err);
                    return ws.close();
                }
                return; // Stop further processing; wait for next message.
            }

            // If not authenticated, ignore any join request.
            if (!authenticated) {
                ws.send(JSON.stringify({ error: "Not authenticated." }));
                return ws.close();
            }

            // Process join request for game1.
            if (data.game) {
                if (data.game === "game1") {
                    const domain = process.env.DOMAIN || "gaming.gangdev.co";
                    ws.send(JSON.stringify({
                        redirect: `wss://${domain}${game1.path}`,
                        game: "game1"
                    }));
                    console.log(`Redirecting authenticated client to ${game1.path}`);
                } else {
                    // Instead of throwing an error, just log and ignore the message.
                    console.log("Ignoring unrecognized game request:", data.game);
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