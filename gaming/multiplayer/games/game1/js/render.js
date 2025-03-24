export function drawGame(ctx, canvas, camera, players, currentUserId, mapCanvas) {
    // Reset the transform and clear the canvas.
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update the camera using the local player's world coordinates.
    camera.update(players[currentUserId], canvas);

    // Compute the translation so that the local player is at the center.
    // Convert the player's world coordinates (meters) to pixels.
    const localPlayer = players[currentUserId];
    const playerPixelX = localPlayer.x * window.tileSize;
    const playerPixelY = localPlayer.y * window.tileSize;
    // The translation is chosen so that after scaling, the player's pixel coordinate falls at canvas center.
    const translateX = canvas.width / 2 - playerPixelX * camera.zoom;
    const translateY = canvas.height / 2 - playerPixelY * camera.zoom;

    // Set the transformation: scale uniformly and translate.
    ctx.setTransform(
        camera.zoom, 0, 0, camera.zoom,
        translateX, translateY
    );

    // (Optional) Debug: draw a yellow rectangle at (0,0) to verify transform.
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, 100, 100);

    // Draw the pre-rendered map (created at zoom=1 in pixel units).
    ctx.drawImage(mapCanvas, 0, 0);

    // Draw players in world coordinates.
    for (const id in players) {
        const p = players[id];
        const px = p.x * window.tileSize;
        const py = p.y * window.tileSize;
        const playerSize = 2 * window.tileSize; // Player is 2 meters tall.
        ctx.fillStyle = p.userId === currentUserId ? "green" : "red";
        ctx.fillRect(px - playerSize / 2, py - playerSize / 2, playerSize, playerSize);
        ctx.fillStyle = "gray";
        // Font size scales with camera.zoom if desired; here we keep it fixed.
        ctx.font = `${16 * camera.zoom}px Arial`;
        const nameToDisplay = p.displayName || (p.user && p.user.displayName) || "Unknown";
        ctx.fillText(nameToDisplay, px - playerSize / 2, py - playerSize / 2 - 5);
    }
}
