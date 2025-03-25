import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import path from 'path';
import fs from 'fs';
import url from 'url';

export function createGameServer(port, name, clientPath) {
    const server = http.createServer((req, res) => {
        let resolvedPath = path.resolve(clientPath, "." + req.url);
        if (!resolvedPath.startsWith(clientPath)) {
            console.error(`[${name}] 403 Forbidden: ${resolvedPath}`);
            res.writeHead(403, { 'Content-Type': 'text/plain' });
            return res.end('403 Forbidden');
        }
        let requestedFile = req.url === '/' ? 'index.html' : req.url;
        let filePath = path.join(clientPath, requestedFile);
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
                return res.end('404 Not Found');
            }
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        });
    });

    const wss = new WebSocketServer({ server });
    let playerCount = 0;
    const activeGameSockets = {};
    const gameState = {
        players: {} //  key: userId, value: { userId, x, y, username, displayName }
    };

    wss.on('connection', (ws, request) => {
        const query = url.parse(request.url, true).query;
        const userId = query.userId;
        if (userId) {
            if (activeGameSockets[userId]) {
                activeGameSockets[userId].close();
            }
            activeGameSockets[userId] = ws;
            ws.userId = userId;
        }

        playerCount++;
        console.log(`[${name}] Connection established. Player count: ${playerCount}`);
        broadcastPlayerCount();
        ws.send(JSON.stringify({ type: 'chatMessage', data: `Welcome to ${name}!` }));

        ws.on('message', (msg) => {
            if (msg instanceof Buffer) msg = msg.toString();
            let data;
            try {
                data = JSON.parse(msg);
            } catch (e) {
                console.error("Error parsing message", e);
                return;
            }
            switch (data.type) {
                case 'playerSpawn': {
                    gameState.players[userId] = data.data;
                    broadcastGameState();
                    break;
                } case 'playerMovement': {
                    const {userId, x, y, username, displayName} = data.data;
                    if (gameState.players[userId]) {
                        gameState.players[userId].x = x;
                        gameState.players[userId].y = y;
                    } else {
                        gameState.players[userId] = {userId, x, y, username, displayName};
                    }
                    broadcastGameState();
                    break;
                } default: {
                    distributeData(msg);
                }
            }
        });
        ws.on('close', () => {
            if (ws.userId && activeGameSockets[ws.userId] === ws) {
                delete activeGameSockets[ws.userId];
                delete gameState.players[ws.userId]; // remove from gamestate
            }
            playerCount--;
            console.log(`[${name}] Connection closed. Player count: ${playerCount}`);
            distributeData({ type: 'chatMessage', data: `${userId}: Player disconnected.` }, true);
            broadcastPlayerCount();
            broadcastGameState();
        });
    });

    function distributeData(data, server = false) {
        if (server) data = new Blob([JSON.stringify(data)], { type: 'application/json' });
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    }

    function broadcastPlayerCount() {
        distributeData({ type: 'playerCount', data: playerCount }, true);
    }
    function broadcastGameState() {
        distributeData({ type: 'gameState', data: gameState.players }, true);
    }

    server.listen(port, '127.0.0.1', () => {
        console.log(`[${name}] WebSocket server running on port ${port} (IPv4)`);
    });

    return wss;
}