export function drawGame(ctx, canvas, camera, players, currentUserId, mapCanvas) {
    // Reset transformation and clear the canvas.
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update the camera (using world units)
    camera.update(players[currentUserId], canvas);

    // Set the transformation matrix:
    // Scale world coordinates by tileSize and camera.zoom, and translate so that camera.x,y become the top-left.
    ctx.setTransform(
        camera.zoom, 0, 0, camera.zoom,
        -camera.x * window.tileSize * camera.zoom,
        -camera.y * window.tileSize * camera.zoom
    );

    // Draw the pre-rendered map (which was created in pixel units at zoom = 1).
    ctx.drawImage(mapCanvas, 0, 0);

    // Draw players.
    for (const id in players) {
        const p = players[id];
        // Convert world coordinate (meters) to pixels.
        const px = p.x * window.tileSize;
        const py = p.y * window.tileSize;
        // Player is 2 meters tall.
        const playerSize = 2 * window.tileSize;
        ctx.fillStyle = p.userId === currentUserId ? "green" : "red";
        ctx.fillRect(px - playerSize / 2, py - playerSize / 2, playerSize, playerSize);
        ctx.fillStyle = "gray";
        ctx.font = `${16}px Arial`;
        const nameToDisplay = p.displayName || (p.user && p.user.displayName) || "Unknown";
        ctx.fillText(nameToDisplay, px - playerSize / 2, py - playerSize / 2 - 5);
    }
}