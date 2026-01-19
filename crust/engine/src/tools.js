export function sendData(activeSocket, type, data, userId, username, displayName) {
    if (activeSocket && activeSocket.readyState === WebSocket.OPEN) {
        let payload = (typeof data === "string" || data instanceof String) ? { text: data } : data;
        const enrichedData = { ...payload, user: { userId, username, displayName } };
        const message = JSON.stringify({ type, data: enrichedData });
        const blob = new Blob([message], { type: "application/json" });
        activeSocket.send(blob);
    } else {
        console.warn("Cannot send data. WebSocket closed.");
    }
}

export function lerp(a, b, t) {
    return a + (b - a) * t;
}

export function getPlayerHalfSize(mapData) {
    const tileSize = mapData?.tileSize ?? 16;
    return tileSize * 2;
}

export function getPlayerCenter(player, mapData) {
    const half = getPlayerHalfSize(mapData);
    return {
        x: player.x + half,
        y: player.y + half
    };
}

export function getPlayerHitbox(player, mapData) {
    const half = getPlayerHalfSize(mapData);
    const size = half * 2;

    return {
        x: player.x,
        y: player.y,
        w: size,
        h: size
    };
}