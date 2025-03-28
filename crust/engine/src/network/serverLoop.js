export function startServerLoop(wss) {
    const tickRate = 60; // ticks per second
    const tickInterval = 1000 / tickRate; // ms per tick
    const simulationDelay = 1000; // ms delay to compensate for latency

    setInterval(() => { // process all queued inputs
        updateGameState(wss.gameState, tickInterval / 1000, simulationDelay); // process game state updates (physics, inputs, etc)
        broadcastGameState(wss) // broadcast updated state to all connected clients
    }, tickInterval);
}

function updateGameState(gameState, deltaTime, simulationDelay ) {
    const now = Date.now();
    Object.keys(gameState.players).forEach((uid) => {
        const player = gameState.players[uid];
        if (player.inputQueue && player.inputQueue.length > 0) {
            const inputsToProcess = player.inputQueue.filter(input => (now - input.ts) >= simulationDelay);
            if (inputsToProcess.length > 0) {
                inputsToProcess.forEach(input => {
                    player.x += input.dx;
                    player.y += input.dy;
                });
                player.lastProcessedTs = inputsToProcess[inputsToProcess.length - 1].ts;
                player.inputQueue = player.inputQueue.filter(input => (now - input.ts) < simulationDelay);
            }
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