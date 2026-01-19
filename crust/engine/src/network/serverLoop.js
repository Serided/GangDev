import { applyTerrainToDelta } from "../world/terrain.js";
import { getPlayerCenter } from "../tools";
import { spawnProjectile, updateProjectiles } from "../gameplay/projectiles";

export function startServerLoop(wss) {
    const tickRate = 60;                  // ticks per second
    const tickInterval = 1000 / tickRate; // ms per tick

    setInterval(() => {
        updateGameState(wss.gameState);   // process queued inputs, apply terrain
        broadcastGameState(wss);          // send updated players to all clients
    }, tickInterval);
}

function updateGameState(gameState) {
    if (!gameState || !gameState.players) return;

    const mapData = gameState.mapData || null;
    const tileSize = mapData?.tileSize ?? 0;

    for (const uid in gameState.players) {
        const player = gameState.players[uid];
        if (!player) continue;

        const queue = player.inputQueue;
        if (!queue || queue.length === 0) continue;

        let lastProcessedTs = player.lastProcessedTs || 0;

        // process inputs in order
        for (const input of queue) {
            if (!input) continue;
            const { dx, dy, ts } = input;

            // ignore already-processed inputs
            if (ts <= lastProcessedTs) continue;

            let adjDx = dx;
            let adjDy = dy;

            // server side terrain
            if (mapData && tileSize > 0) {
                const center = getPlayerCenter(player, mapData);

                const adjusted = applyTerrainToDelta(
                    mapData,
                    center.x,
                    center.y,
                    dx,
                    dy
                );
                adjDx = adjusted.dx;
                adjDy = adjusted.dy;
            }

            // apply movement to server-authoritative position
            player.x += adjDx;
            player.y += adjDy;

            lastProcessedTs = ts;
        }

        player.lastProcessedTs = lastProcessedTs;
        // clear queue now that we've consumed the inputs
        player.inputQueue.length = 0;
    }
}

function broadcastGameState(wss) {
    const stateMessage = JSON.stringify({
        type: "gameState",
        data: wss.gameState.players,
    });

    wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
            client.send(stateMessage);
        }
    });
}