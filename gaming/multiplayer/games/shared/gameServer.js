const WebSocket = require('ws');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { Client } = require('pg');

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
    })
    .catch((err) => {
        console.error('PostgreSQL connection error:', err);
    });

function createGameServer(port, name, clientPath) {
    const server = http.createServer((req, res) => {
        if (!clientPath) {
            console.error(`[${name}] ERROR: clientPath is undefined!`);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end(`500 Internal Server Error: clientPath is undefined!`);
            return;
        }

        // Serve static files (HTML, CSS, JS) from the game's client folder
        let requestedFile = req.url === '/' ? 'index.html' : req.url;
        let filePath = path.join(clientPath, requestedFile);

        console.log(`[${name}] Request for: ${req.url}, serving file: ${filePath}`);

        // Ensure requested file is inside the client directory
        if (!filePath.startsWith(clientPath)) {
            console.error(`[${name}] 403 Forbidden: ${filePath}`);
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
        ws.send(`Welcome to ${name} server`);

        // Authentication middleware: Validate session token
        ws.on('message', async (msg) => {
            console.log(`[${name}] Received: `, msg.toString());

            let data;
            try {
                data = JSON.parse(msg);  // Try to parse the incoming message
                console.log(`[${name}] Parsed data:`, data);
            } catch (err) {
                console.error(`[${name}] Error parsing message:`, err);
                ws.send(JSON.stringify({ error: 'Invalid message format' }));
                return;
            }

            // Check for a valid session token
            if (data.token) {
                try {
                    const result = await pgClient.query('SELECT * FROM session_tokens WHERE token = $1', [data.token]);

                    if (result.rows.length === 0) {
                        ws.send(JSON.stringify({ error: 'Invalid session token' }));
                        return;
                    }
                    console.log('Session token validated successfully!');
                } catch (err) {
                    console.error('Database error:', err);
                    ws.send(JSON.stringify({ error: 'Internal Server Error' }));
                    return;
                }
            } else {
                ws.send(JSON.stringify({ error: 'No token provided' }));
                return;
            }

            // Handle other game messages (if any)
            ws.send(`[${name}] Echo: ${msg}`);
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
