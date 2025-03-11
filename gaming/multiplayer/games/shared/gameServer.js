const WebSocket = require('ws');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { Client } = require('pg');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// PostgreSQL Client Setup
const pgClient = new Client({
    user: 'your_db_user',
    host: 'localhost',
    database: 'gaming_db',
    password: 'your_db_password',
    port: 5432,
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

function generateToken() {
    return crypto.randomBytes(16).toString('hex'); // 16-byte token
}

function createGameServer(port, name, clientPath) {
    const server = http.createServer((req, res) => {
        // Serve static files (HTML, CSS, JS) from the game's client folder
        let requestedFile = req.url === '/' ? 'index.html' : req.url;
        let filePath = path.join(clientPath, requestedFile);

        console.log(`[${name}] Request for: ${req.url}, serving file: ${filePath}`);

        // Ensure requested file is inside the client directory
        if (!filePath.startsWith(clientPath)) {
            res.writeHead(403, { 'Content-Type': 'text/plain' });
            res.end('403 Forbidden');
            return;
        }

        // Get file extension
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
            console.log(`[${name}] Received: `, msg.toString());

            // Parse the incoming message
            const data = JSON.parse(msg);
            console.log('Parsed data:', data);

            if (data.type === 'signin') {
                const { username, password } = data;

                try {
                    // Fetch user by username or email
                    const result = await pgClient.query('SELECT * FROM users WHERE username = $1 OR email = $1', [username]);
                    console.log('User query result:', result.rows);

                    if (result.rows.length === 0) {
                        ws.send(JSON.stringify({ error: 'Invalid username or email' }));
                        return;
                    }

                    const user = result.rows[0];
                    // Check if the password matches
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) {
                            console.error('Error comparing passwords:', err);
                            ws.send(JSON.stringify({ error: 'Internal server error' }));
                        } else if (isMatch) {
                            const token = generateToken();  // Generate session token
                            ws.send(JSON.stringify({ message: 'Logged in', token }));
                        } else {
                            ws.send(JSON.stringify({ error: 'Invalid password' }));
                        }
                    });
                } catch (err) {
                    console.error('Database error:', err);
                    ws.send(JSON.stringify({ error: 'Internal Server Error' }));
                }
            } else {
                // Handle other messages
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
