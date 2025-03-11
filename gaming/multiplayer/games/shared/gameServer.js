const WebSocket = require('ws');
const http = require('http');
const path = require('path');
const fs = require('fs');

function createGameServer(port, name, clientPath) {
    const server = http.createServer((req, res) => {
        if (!clientPath) {
            console.error(`[${name}] ERROR: clientPath is undefined!`);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('500 Internal Server Error');
            return;
        }

        let filePath = path.resolve(clientPath, "." + req.url);
        if (!filePath.startsWith(clientPath)) {
            res.writeHead(403, { 'Content-Type': 'text/plain' });
            return res.end('403 Forbidden');
        }

        const ext = path.extname(filePath);
        const mimeTypes = {
            '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
            '.png': 'image/png', '.jpg': 'image/jpeg', '.gif': 'image/gif', '.svg': 'image/svg+xml'
        };

        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                return res.end('404 Not Found');
            }
            res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
            res.end(data);
        });
    });

    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        console.log(`Client connected to ${name} server`);
        ws.send(`Welcome to ${name} server`);

        ws.on('message', (msg) => ws.send(`[${name}] Echo: ${msg}`));
        ws.on('close', () => console.log(`Client disconnected from ${name} server`));
    });

    server.listen(port, '127.0.0.1', () => console.log(`${name} WebSocket server running on ${port}`));
    return wss;
}

module.exports = { createGameServer };