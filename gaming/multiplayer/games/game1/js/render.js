export function drawGame(ctx, canvas, camera, players, currentUserId, mapCanvas) {
    // Reset transform and clear canvas.
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Get the local player.
    const localPlayer = players[currentUserId];

    // Compute translation such that localPlayer is centered.
    // Convert world coordinates (meters) to pixels using tileSize.
    const playerScreenX = localPlayer.x * window.tileSize;
    const playerScreenY = localPlayer.y * window.tileSize;
    const translateX = canvas.width / 2 - playerScreenX * camera.zoom;
    const translateY = canvas.height / 2 - playerScreenY * camera.zoom;

    // Set the transformation: scale by camera.zoom, and translate.
    ctx.setTransform(
        camera.zoom, 0, 0, camera.zoom,
        translateX, translateY
    );

    // Draw the pre-rendered map (which was created at zoom=1 in pixel units).
    ctx.drawImage(mapCanvas, 0, 0);

    // Draw all players.
    for (const id in players) {
        const p = players[id];
        const px = p.x * window.tileSize;
        const py = p.y * window.tileSize;
        const playerSize = 2 * window.tileSize; // 2 meters tall.
        ctx.fillStyle = p.userId === currentUserId ? "green" : "red";
        ctx.fillRect(px - playerSize / 2, py - playerSize / 2, playerSize, playerSize);
        ctx.fillStyle = "gray";
        ctx.font = `${16 * camera.zoom}px Arial`;
        const nameToDisplay = p.displayName || (p.user && p.user.displayName) || "Unknown";
        ctx.fillText(nameToDisplay, px - playerSize / 2, py - playerSize / 2 - 5);
    }
}
