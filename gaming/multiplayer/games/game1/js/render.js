export function drawGame(ctx, canvas, camera, players, currentUserId, heightMap, tileSize) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update the camera based on the local player's position.
    camera.update(players[currentUserId], canvas);

    const scaledTileSize = tileSize * camera.zoom;
    const rows = heightMap.length;
    const cols = heightMap[0].length;
    const startCol = Math.max(0, Math.floor(camera.x / scaledTileSize));
    const endCol = Math.min(cols, Math.ceil((camera.x + canvas.width) / scaledTileSize));
    const startRow = Math.max(0, Math.floor(camera.y / scaledTileSize));
    const endRow = Math.min(rows, Math.ceil((camera.y + canvas.height) / scaledTileSize));

    for (let r = startRow; r < endRow; r++) {
        for (let c = startCol; c < endCol; c++) {
            const value = heightMap[r][c];
            let color;
            if (value < 0.3) color = "#2D70B3";
            else if (value < 0.5) color = "#88C070";
            else if (value < 0.7) color = "#66A050";
            else color = "#7D7D7D";
            const screenX = c * scaledTileSize - camera.x;
            const screenY = r * scaledTileSize - camera.y;
            ctx.fillStyle = color;
            ctx.fillRect(screenX, screenY, scaledTileSize, scaledTileSize);
        }
    }

    for (const id in players) {
        const p = players[id];
        const screenX = p.x - camera.x;
        const screenY = p.y - camera.y;
        ctx.fillStyle = p.userId === currentUserId ? "green" : "red";
        ctx.fillRect(screenX - 25 * camera.zoom, screenY - 25 * camera.zoom, 50 * camera.zoom, 50 * camera.zoom);
        ctx.fillStyle = "gray";
        ctx.font = `${16 * camera.zoom}px Arial`;
        const nameToDisplay = p.displayName || (p.user && p.user.displayName) || "Unknown";
        ctx.fillText(nameToDisplay, screenX - 25 * camera.zoom, screenY - 30 * camera.zoom);
    }
}