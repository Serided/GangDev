require('dotenv').config();
const wbSkt = require("ws");
const http = require("http");
const { Client } = require('pg');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Setup PostgreSQL connection
const pgClient = new Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

pgClient.connect()
    .then(() => {
        console.log('PostgreSQL connection successful');
    })
    .catch((err) => {
        console.error('PostgreSQL connection error:', err);
    });

// Function to generate session token
function generateToken() {
    return crypto.randomBytes(16).toString('hex'); // 16-byte token
}

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
    game5: { path: "/game5", port: 10005 }
};

gatewayServer.on("connection", (ws) => {
    console.log("New client connected to gateway.");

    ws.on("message", async (message) => {
        try {
            // Check if the message is a valid JSON string
            if (typeof message !== 'string' || (message[0] !== '{' && message[0] !== '[')) {
                throw new Error('Invalid JSON format');
            }

            // Parse the message to JSON
            const data = JSON.parse(message);
            console.log("Gateway received:", data);

            if (data.type === 'signin') {
                // Handle signin request
                const { username, password } = data;

                try {
                    // Fetch user by username or email
                    const result = await pgClient.query('SELECT * FROM users WHERE username = $1 OR email = $1', [username]);

                    if (result.rows.length === 0) {
                        ws.send(JSON.stringify({ error: 'Invalid username or email' }));
                        return;
                    }

                    const user = result.rows[0];
                    const passwordMatch = await bcrypt.compare(password, user.password);

                    if (passwordMatch) {
                        // Generate a session token
                        const token = generateToken();

                        // Store the token in the database
                        await pgClient.query('INSERT INTO session_tokens (user_id, token) VALUES ($1, $2)', [user.id, token]);

                        // Send success response with the token
                        ws.send(JSON.stringify({ message: 'Logged in', token: token }));

                        // Send the game URL for redirection after successful login
                        const domain = process.env.DOMAIN || "gaming.gangdev.co";
                        const gameInfo = games['game1'];  // Assuming the user wants to play game1
                        ws.send(JSON.stringify({
                            redirect: `wss://${domain}${gameInfo.path}`,
                            game: 'game1'
                        }));
                        console.log(`Redirecting client to ${gameInfo.path}`);
                    } else {
                        ws.send(JSON.stringify({ error: 'Invalid password' }));
                    }
                } catch (err) {
                    console.error('Database error:', err);
                    ws.send(JSON.stringify({ error: 'Internal Server Error' }));
                }
            } else if (data.game && games[data.game]) {
                // Handle game connection request
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
