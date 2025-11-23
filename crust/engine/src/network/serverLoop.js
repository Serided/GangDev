export function startServerLoop(wss) {
    const tickRate = 60;                     // ticks per second
    const tickInterval = 1000 / tickRate;    // ms per tick

    setInterval(() => {
        updateGameState(wss.gameState);      // process all queued inputs
        broadcastGameState(wss);             // send updated state to all clients
    }, tickInterval);
}

function updateGameState(gameState) {
    for (const uid in gameState.players) {
        const player = gameState.players[uid];
        if (!player || !player.inputQueue || player.inputQueue.length === 0) continue;

        let totalDx = 0;
        let totalDy = 0;

        // just apply EVERYTHING we received since last tick
        for (const input of player.inputQueue) {
            totalDx += input.dx;
            totalDy += input.dy;
        }

        player.x += totalDx;
        player.y += totalDy;

        // remember the latest timestamp for client-side reconciliation if you want
        const lastInput = player.inputQueue[player.inputQueue.length - 1];
        player.lastProcessedTs = lastInput?.ts ?? player.lastProcessedTs;

        // clear processed inputs
        player.inputQueue.length = 0;
    }
}

function broadcastGameState(wss) {
    const stateMessage = JSON.stringify({
        type: 'gameState',
        data: wss.gameState.players,
    });

    wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
            client.send(stateMessage);
        }
    });
}
