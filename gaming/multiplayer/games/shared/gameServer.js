const WebSocket = require('ws');
const http = require('http');
const path = require('path');
const fs = require('fs');

function createGameServer(port, name, clientPath) {
    const server = http.createServer((req, res) => {
        let resolvedPath = path.resolve(clientPath, "." + req.url);

        if (!resolvedPath.startsWith(clientPath)) {
            console.error(`[${name}] 403 Forbidden: ${resolvedPath}`);
            res.writeHead(403, { 'Content-Type': 'text/plain' });
            return res.end('403 Forbidden');
        }

        let requestedFile = req.url === '/' ? 'index.html' : req.url;
        let filePath = path.join(clientPath, requestedFile);

        const ext = path.extname(filePath); // get file extension
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
                return res.end('404 Not Found');
            }
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        });
    });

    const wss = new WebSocket.Server({ server });

    let playerCount = 0;

    wss.on('connection', (ws) => {
        playerCount++;
        console.log(`Client connected to ${name}. Player count: ${playerCount}`);

        broadcastPlayerCount(wss);

        ws.send(JSON.stringify({ type: 'chatMessage', data: `Welcome to ${name}!`}));

        ws.on('message', (msg) => {
            if (msg instanceof Buffer) {
                msg = msg.toString();
            }
            console.log(`[${name}] Received: `, msg.toString());
            distributeData(msg);
        });

        ws.on('close', () => {
            playerCount--;
            console.log(`Client disconnected from ${name} server`);
            broadcastPlayerCount(wss);
            distributeData(JSON.stringify({ type: 'chatMessage', data: 'Player disconnected.' }));
        });
    });

    function distributeData(data) {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        })
    }

    function broadcastPlayerCount(wss) {
        distributeData(JSON.stringify({ type: 'playerCount', data: playerCount }));
    }

    server.listen(port, '127.0.0.1', () => {
        console.log(`${name} WebSocket server running on port ${port} (IPv4)`);
    });

    return wss;
}

module.exports = { createGameServer };