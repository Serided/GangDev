export function drawGame(ctx, canvas, camera, players, currentUserId, mapCanvas) {
    // Reset transform and clear the canvas.
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update the camera using the local player's world coordinates.
    camera.update(players[currentUserId], canvas);

    // Compute the translation so that the local player is at the center.
    // Convert the player's world coordinates (meters) to pixels.
    const localPlayer = players[currentUserId];
    const playerPixelX = localPlayer.x * window.tileSize;
    const playerPixelY = localPlayer.y * window.tileSize;
    const translateX = canvas.width / 2 - playerPixelX * camera.zoom;
    const translateY = canvas.height / 2 - playerPixelY * camera.zoom;

    // Debug: log translation and zoom values.
    console.log("camera.zoom:", camera.zoom, "translateX:", translateX, "translateY:", translateY);

    // Set the transformation: scale uniformly and translate.
    ctx.setTransform(
        camera.zoom, 0, 0, camera.zoom,
        translateX, translateY
    );

    // Debug: Draw a yellow border around the visible area.
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 3 / camera.zoom; // Adjust border width to remain visible.
    ctx.strokeRect(0, 0, canvas.width / camera.zoom, canvas.height / camera.zoom);

    // Temporary fallback: (Uncomment to see the full map at (0,0) without transform)
    // ctx.setTransform(1, 0, 0, 1, 0, 0);
    // ctx.drawImage(mapCanvas, 0, 0);
    // return;

    // Draw the pre-rendered map with the current transform.
    ctx.drawImage(mapCanvas, 0, 0);

    // Draw players.
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
