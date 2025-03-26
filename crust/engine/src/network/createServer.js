import { WebSocketServer } from 'ws';
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
    const gameState = {
        players: {} //  key: userId, value: { userId, x, y, username, displayName }
    };
    wss.gameState = gameState;
    wss.user = { userId: 0, username: 'server', displayName: 'Server' };

    let playerCount = 0;
    const activeGameSockets = {};

    wss.on('connection', (ws, request) => {
        ws.on('message', (msg) => {
            if (msg instanceof Buffer) msg = msg.toString();
            let data;
            try {
                data = JSON.parse(msg);
            } catch (e) {
                console.error("Error parsing message", e);
                return;
            }

            if (data.type !== 'auth' && !ws.user) {
                ws.send(JSON.stringify({ error: "Not authenticated." }));
                return
            }
            if (data.type === 'auth') {
                const { userId, username, displayName } = data.data;
                if (!userId || !displayName) {
                    ws.send(JSON.stringify({ error: "Missing authentication fields." }));
                    return ws.close();
                }
                ws.user = { userId, username, displayName };
                const uid = ws.user.userId;

                if (activeGameSockets[uid]) activeGameSockets[uid].close();
                activeGameSockets[uid] = ws;

                ws.send(JSON.stringify({ type: 'chatMessage', data: `Welcome to ${name}!` }));
                playerCount++;
                console.log(`[${name}] Connection established. Player count: ${playerCount}`);
                distributeData(wss, { type: 'playerCount', data: playerCount })
                distributeData(wss, { type: 'chatMessage', data: { text: `${ws.user.displayName} connected!` }, userId: wss.user.userId, username: wss.user.username, displayName: wss.user.displayName});
                return;
            }

            const uid = ws.user.userId;
            switch (data.type) {
                case 'playerSpawn': {
                    gameState.players[uid] = data.data;
                    break;
                }
                case 'playerMovement': {
                    const { x, y, username, displayName} = data.data;
                    if (gameState.players[uid]) {
                        gameState.players[uid].x = x;
                        gameState.players[uid].y = y;
                    } else {
                        gameState.players[uid] = { userId: uid, x, y, username, displayName};
                    }
                    break;
                }
                default: {
                    distributeData(wss, data);
                }
            }
        });

        ws.on('close', () => {
            if (ws.userId && activeGameSockets[ws.userId] === ws) {
                delete activeGameSockets[ws.userId]; // remove from active sockets
                delete gameState.players[ws.userId]; // remove from gamestate
            }
            playerCount--;
            distributeData(wss, { type: 'playerCount', data: playerCount });
            const displayName = gameState.players[ws.user?.userId]?.displayName || 'Unknown';
            distributeData(wss, { type: 'chatMessage', data: { text: `${ws.user.displayName} disconnected.` }, user: { userId: wss.user.userId, username: wss.user.username, displayName: wss.user.displayName} });
            console.log(`[${name}] Connection closed. Player count: ${playerCount}`);
        });
    });

    function distributeData(wss, data) {
        const serverData = JSON.stringify(data);
        wss.clients.forEach(client => {
            if (client.readyState === client.OPEN) {
                client.send(serverData);
            }
        });
    }

    server.listen(port, '127.0.0.1', () => {
        console.log(`[${name}] WebSocket server running on port ${port} (IPv4)`);
    });

    return wss;
}