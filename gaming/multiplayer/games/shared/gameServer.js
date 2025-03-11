const WebSocket = require('ws');
const http = require('http');

function createGameServer(port, name) {
    const server = http.createServer((req, res) => {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(`WebSocket server for ${name} running\n`);
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

/*const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('WebSocket server running\n');
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Client connected to game1 server');

    ws.send('Connected to game1 server');

    ws.on('message', (message) => {
        console.log('Received:', message.toString());
        ws.send(`Echo: ${message}`);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Listen on IPv4 explicitly
server.listen(10001, '127.0.0.1', () => {
    console.log('Game1 WebSocket server running on port 10001 (IPv4)');
});*/
