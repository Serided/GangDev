require('dotenv').config();
const WebSocket = require('ws');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { Client } = require('pg');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// PostgreSQL Client Setup
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
        return pgClient.query('SELECT NOW()');  // Test the connection
    })
    .then((res) => {
        console.log('Current time in database:', res.rows[0].now);
    })
    .catch((err) => {
        console.error('PostgreSQL connection error:', err);
    });

// Function to generate session token
function generateToken() {
    return crypto.randomBytes(16).toString('hex'); // 16-byte token
}

// Create Game Server
function createGameServer(port, name, clientPath) {
    const server = http.createServer((req, res) => {
        let requestedFile = req.url === '/' ? 'index.html' : req.url;
        let filePath = path.join(clientPath, requestedFile);

        console.log(`[${name}] Request for: ${req.url}, serving file: ${filePath}`);

        if (!filePath.startsWith(clientPath)) {
            res.writeHead(403, { 'Content-Type': 'text/plain' });
            res.end('403 Forbidden');
            return;
        }

        const ext = path.extname(filePath);
        const mimeTypes = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml'
        };

        const contentType = mimeTypes[ext] || 'application/octet-stream';

        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.error(`[${name}] 404 Not Found: ${filePath}`);
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
            } else {
                console.log(`[${name}] 200 OK: ${filePath}`);
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data);
            }
        });
    });

    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        console.log(`Client connected to ${name} server`);

        ws.on('message', async (msg) => {
            console.log(`[${name}] Received raw message:`, msg.toString());  // Log the raw message for debugging

            let data;
            try {
                data = JSON.parse(msg);  // Attempt to parse the incoming message
                console.log(`[${name}] Parsed data:`, data);  // Log the parsed data for debugging
            } catch (err) {
                console.error(`[${name}] Error parsing message:`, err);
                ws.send(JSON.stringify({ error: 'Invalid message format' }));
                return;
            }

            if (data.type === 'signin') {
                const { username, password } = data;

                try {
                    // Fetch user from the database by username or email
                    const result = await pgClient.query('SELECT * FROM users WHERE username = $1 OR email = $1', [username]);

                    if (result.rows.length === 0) {
                        ws.send(JSON.stringify({ error: 'Invalid username or email' }));
                        return;
                    }

                    const user = result.rows[0];

                    // Compare hashed password
                    const passwordMatch = await bcrypt.compare(password, user.password);

                    if (passwordMatch) {
                        const token = generateToken();
                        await pgClient.query('INSERT INTO session_tokens (user_id, token) VALUES ($1, $2)', [user.id, token]);

                        ws.send(JSON.stringify({ message: 'Logged in', token: token }));
                    } else {
                        ws.send(JSON.stringify({ error: 'Invalid password' }));
                    }
                } catch (err) {
                    console.error('Database error:', err);
                    ws.send(JSON.stringify({ error: 'Internal Server Error' }));
                }
            } else {
                ws.send(JSON.stringify({ error: 'Unknown message type' }));
            }
        });

        ws.on('close', () => {
            console.log(`Client disconnected from ${name} server`);
        });
    });

    server.listen(port, '127.0.0.1', () => {
        console.log(`${name} WebSocket server running on port ${port} (IPv4)`);
    });

    return wss;
}

module.exports = { createGameServer };
