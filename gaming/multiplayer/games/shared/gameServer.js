const WebSocket = require('ws');
const http = require('http');
const path = require('path');
const fs = require('fs');

function createGameServer(port, name, clientPath) {
    const server = http.createServer((req, res) => {
        // serve static files (HTML, CSS, JS) from the game's client folder
        let filePath = path.join(clientPath, req.url === '/' ? 'index.html' : req.url);

        // get file extension
        const ext = path.extname(filePath);
        let contentType = 'text/html';

        // map file extensions to content types
        const mimeTypes = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml'
        };

        if (mimeTypes[ext]) {
            contentType = mimeTypes[ext];
        }

        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data);
            }
        });
    });

    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        console.log(`Client connected to ${name} server`);

        ws.send(`Welcome to ${name} server`);

        ws.on('message', (msg) => {
            console.log(`[${name}] Received: `, msg.toString());
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