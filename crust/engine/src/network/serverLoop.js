export function startServerLoop(wss) {
    const tickRate = 60; // ticks per second
    const tickInterval = 1000 / tickRate; // ms per tick

    setInterval(() => { // process all queued inputs
        updateGameState(wss.gameState, tickInterval / 1000); // process game state updates (physics, inputs, etc)
        broadcastGameState(wss) // broadcast updated state to all connected clients)
    }, tickInterval);
}

function updateGameState(gameState, deltaTime) {
    // TODO: Process queued inputs and update player positions or other state here.
    // Input queue per player:
    // for (const userId in gameState.players) {
    //    const player = gameState.players[userId];
    //    const inputs = inputQueue.get(userId);
    //    inputs.forEach(input => {
    //        // Update player based on input and deltaTime
    //    });
    // }
}

function broadcastGameState(wss) {
    const stateMessage = JSON.stringify({ type: 'gameState', data: wss.gameState.players});
    wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
            client.send(stateMessage);
        }
    })
}