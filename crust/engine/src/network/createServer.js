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
        players: {}, //  key: userId, value: { userId, x, y, username, displayName }
        mapData: null,
        projectiles: []
    };
    wss.gameState = gameState;
    wss.user = { userId: 0, username: 'server', displayName: 'Server' };

    try {
        const mapPath = path.resolve(
            clientPath,
            "../src/map/map.json"
        );
        const raw = fs.readFileSync(mapPath, "utf8");
        gameState.mapData = JSON.parse(raw);
        console.log(`[${name}] Loaded map data from ${mapPath}`);
    } catch (err) {
        console.error(`[${name}] Failed to load map data:`, err);
        gameState.mapData = null;
    }

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
                distributeData(wss, { type: 'chatMessage', data: { text: `${ws.user.displayName} connected!`, user: wss.user } });
                return;
            }

            const uid = ws.user.userId;
            switch (data.type) {
                case 'playerSpawn': {
                    const spawnData = data.data;

                    gameState.players[uid] = {
                        ...spawnData,
                        userId: uid,
                        hp: 100,
                        maxHp: 100,
                        lastAttackTime: 0
                    };

                    break;
                }
                case 'movementInput': {
                    const { dx, dy, ts } = data.data;
                    const player = wss.gameState.players[uid];
                    if (!player) break;

                    if (!player.inputQueue) {
                        player.inputQueue = [];
                    }

                    player.inputQueue.push({ dx, dy, ts })
                    break;
                }
                case 'attack': {
                    const { ts } = data.data;
                    const player = wss.gameState.players[uid];
                    if (!player) break;

                    if (!player.inputQueueAttack) {
                        player.inputQueueAttack = [];
                    }

                    player.inputQueueAttack.push({ ts })
                    break;
                }
                default: {
                    distributeData(wss, data);
                }
            }
        });

        ws.on('close', () => {
            const uid = ws.user.userId;
            if (uid && activeGameSockets[uid] === ws) {
                delete activeGameSockets[uid]; // remove from active sockets
                delete gameState.players[uid]; // remove from gamestate
            }
            playerCount--;
            distributeData(wss, { type: 'playerCount', data: playerCount });
            distributeData(wss, { type: 'chatMessage', data: { text: `${ws.user.displayName} disconnected.`, user: wss.user } });
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