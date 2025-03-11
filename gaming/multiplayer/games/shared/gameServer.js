const WebSocket = require('ws');
const http = require('http');
const path = require('path');
const fs = require('fs');

function createGameServer(port, name, clientPath) {
    // Create HTTP server to serve static files (HTML, CSS, JS)
    const server = http.createServer((req, res) => {
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

    // Set up WebSocket server to handle real-time communication (but not game-specific logic)
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        console.log(`[${name}] New client connected`);

        // Handle incoming messages (but not game-specific logic)
        ws.on('message', (msg) => {
            console.log(`[${name}] Received message:`, msg.toString());
            // Currently, no game-specific logic in this file
        });

        ws.on('close', () => {
            console.log(`[${name}] Client disconnected`);
        });
    });

    // Start the HTTP server
    server.listen(port, '127.0.0.1', () => {
        console.log(`[${name}] WebSocket server running on port ${port}`);
    });

    return wss;
}

module.exports = { createGameServer };
