const { createGameServer } = require('../shared/gameServer.js');
const path = require('path');

const port = 10001;
const name = 'Game 1';
const clientPath = path.join(__dirname, 'client');

// Create the basic game server
createGameServer(port, name, clientPath);

// Game-specific logic for Game 1
const WebSocket = require('ws');

const clients = {};

const wss = new WebSocket.Server({ port: 10001 });

wss.on('connection', (ws) => {
    const clientId = `client_${Date.now()}`;
    clients[clientId] = { id: clientId, x: Math.random() * 500, y: Math.random() * 500 };

    // Send initial position for the new client
    ws.send(JSON.stringify({ type: 'init', clientId, cube: clients[clientId] }));

    ws.on('message', (msg) => {
        let data;
        try {
            data = JSON.parse(msg);
        } catch (err) {
            ws.send(JSON.stringify({ error: 'Invalid message format' }));
            return;
        }

        // Update client position if move message is received
        if (data.type === 'move' && clients[clientId]) {
            clients[clientId] = { ...clients[clientId], ...data.position };
        }

        // Broadcast updated clients to all connected clients
        for (let id in clients) {
            ws.send(JSON.stringify({ type: 'update', clients }));
        }
    });

    ws.on('close', () => {
        delete clients[clientId];
    });
});
