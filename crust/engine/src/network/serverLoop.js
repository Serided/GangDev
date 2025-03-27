export function startServerLoop(wss) {
    const tickRate = 60; // ticks per second
    const tickInterval = 1000 / tickRate; // ms per tick

    setInterval(() => { // process all queued inputs
        updateGameState(wss.gameState, tickInterval / 1000); // process game state updates (physics, inputs, etc)
        broadcastGameState(wss) // broadcast updated state to all connected clients
    }, tickInterval);
}

function updateGameState(gameState, deltaTime) {
    Object.keys(gameState.players).forEach((uid) => {
        const player = gameState.players[uid];
        if (player.inputQueue && player.inputQueue.length > 0) {
            player.inputQueue.forEach(input => {
                player.x += input.dx;
                player.y += input.dy;
            });
            player.inputQueue = [];
        }
    })
}

function broadcastGameState(wss) {
    const stateMessage = JSON.stringify({ type: 'gameState', data: wss.gameState.players});
    wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
            client.send(stateMessage);
        }
    })
}