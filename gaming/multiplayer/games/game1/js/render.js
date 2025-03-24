export function drawGame(ctx, canvas, camera, players, currentUserId, heightMap, tileSize) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    camera.update(players[currentUserId], canvas);

    ctx.setTransform(camera.zoom, 0, 0, camera.zoom, -camera.x * camera.zoom, -camera.y * camera.zoom);

    const rows = heightMap.length;
    const cols = heightMap[0].length;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const value = heightMap[r][c];
            let color;
            if (value < 0.3) color = "#2D70B3";     // water
            else if (value < 0.5) color = "#88C070";  // plains
            else if (value < 0.7) color = "#66A050";  // hills
            else color = "#7D7D7D";                  // cliffs
            // Each cell is tileSize in world coordinates.
            const screenX = c * tileSize;
            const screenY = r * tileSize;
            ctx.fillStyle = color;
            ctx.fillRect(screenX, screenY, tileSize, tileSize);
        }
    }

    for (const id in players) {
        const p = players[id];
        const size = 2 * tileSize;
        ctx.fillStyle = p.userId === currentUserId ? "green" : "red";
        ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);
        ctx.fillStyle = "gray";
        ctx.font = "16px Arial"; // Font size will scale with zoom automatically.
        const nameToDisplay = p.displayName || (p.user && p.user.displayName) || "Unknown";
        ctx.fillText(nameToDisplay, p.x - size / 2, p.y - size / 2 - 5);
    }
}
