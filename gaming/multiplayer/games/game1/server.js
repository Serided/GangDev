const WebSocket = require('ws');
const https = require('https');

const server = https.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Client connected to test server');

    // Send a welcome message
    ws.send('Connected to test server');

    ws.on('message', (message) => {
        console.log('Received:', message.toString());
        ws.send(`Echo: ${message}`);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Listen on IPv4 explicitly
server.listen(10001, '0.0.0.0', () => {
    console.log('Test WebSocket server running on port 10001 (IPv4 and IPv6)');
});