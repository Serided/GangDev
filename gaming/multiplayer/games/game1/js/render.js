export function drawGame(ctx, canvas, camera, players, currentUserId, mapCanvas) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update camera to center on local player.
    camera.update(players[currentUserId], canvas);

    const localPlayer = players[currentUserId];
    const playerPixelX = localPlayer.x * window.tileSize;
    const playerPixelY = localPlayer.y * window.tileSize;
    const translateX = canvas.width / 2 - playerPixelX * camera.zoom;
    const translateY = canvas.height / 2 - playerPixelY * camera.zoom;

    ctx.setTransform(
        camera.zoom, 0, 0, camera.zoom,
        translateX, translateY
    );

    ctx.drawImage(mapCanvas, 0, 0);

    for (const id in players) {
        const p = players[id];
        const px = p.x * window.tileSize;
        const py = p.y * window.tileSize;
        const baseSize = 2 * window.tileSize;
        const playerSize = p.crouching ? baseSize * 0.5 : baseSize;
        ctx.fillStyle = p.userId === currentUserId ? "green" : "red";
        ctx.fillRect(px - playerSize / 2, py - playerSize / 2, playerSize, playerSize);
        if (!p.crouching) {
            ctx.fillStyle = "gray";
            ctx.font = `${16 * camera.zoom}px Arial`;
            const nameToDisplay = p.displayName || (p.user && p.user.displayName) || "Unknown";
            ctx.fillText(nameToDisplay, px - playerSize / 2, py - playerSize / 2 - 5);
        }
    }
}
