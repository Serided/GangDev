export function drawGame(ctx, canvas, camera, players, currentUserId, mapCanvas) {
    // Reset transform and clear canvas.
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update camera to center on the local player.
    camera.update(players[currentUserId], canvas);

    // Compute translation so that the local player's pixel coordinate is centered.
    const localPlayer = players[currentUserId];
    const playerPixelX = localPlayer.x * window.tileSize;
    const playerPixelY = localPlayer.y * window.tileSize;
    const translateX = canvas.width / 2 - playerPixelX * camera.zoom;
    const translateY = canvas.height / 2 - playerPixelY * camera.zoom;
    // console.log("camera.zoom:", camera.zoom, "translateX:", translateX, "translateY:", translateY);

    // Set transform: scale and translate.
    ctx.setTransform(
        camera.zoom, 0, 0, camera.zoom,
        translateX, translateY
    );

    // (Debug) Draw a red border around the visible area.
    ctx.strokeStyle = "red";
    ctx.lineWidth = 3 / camera.zoom;
    ctx.strokeRect(0, 0, canvas.width / camera.zoom, canvas.height / camera.zoom);

    // Draw the pre-rendered map.
    ctx.drawImage(mapCanvas, 0, 0);

    // Draw players.
    for (const id in players) {
        const p = players[id];
        const px = p.x * window.tileSize;
        const py = p.y * window.tileSize;
        const baseSize = 2 * window.tileSize; // 2 meters tall (normal)
        // If crouching, reduce size by 50%.
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