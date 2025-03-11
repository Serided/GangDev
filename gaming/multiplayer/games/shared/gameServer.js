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

    // Set up WebSocket server to handle real-time communication
    const wss = new WebSocket.Server({ server });

    const clients = {};

    wss.on('connection', (ws) => {
        console.log(`[${name}] New client connected`);

        // Generate a unique client ID
        const clientId = `client_${Date.now()}`;
        clients[clientId] = { id: clientId, x: Math.random() * 500, y: Math.random() * 500 };

        // Send the client their own cube information
        ws.send(JSON.stringify({ type: 'init', clientId, cube: clients[clientId] }));

        // Handle incoming messages from the client
        ws.on('message', (msg) => {
            console.log(`[${name}] Received message:`, msg.toString());

            let data;
            try {
                data = JSON.parse(msg);
            } catch (err) {
                console.error(`[${name}] Error parsing message:`, err);
                ws.send(JSON.stringify({ error: 'Invalid message format' }));
                return;
            }

            // Update client position if move message is received
            if (data.type === 'move' && clients[clientId]) {
                clients[clientId] = { ...clients[clientId], ...data.position };
            }

            // Broadcast the updated client list to all connected clients
            for (let id in clients) {
                ws.send(JSON.stringify({ type: 'update', clients }));
            }
        });

        // Handle client disconnection
        ws.on('close', () => {
            console.log(`[${name}] Client ${clientId} disconnected`);
            delete clients[clientId]; // Clean up the client data
        });
    });

    // Start the HTTP server
    server.listen(port, '127.0.0.1', () => {
        console.log(`[${name}] WebSocket server running on port ${port}`);
    });

    return wss;
}

module.exports = { createGameServer };