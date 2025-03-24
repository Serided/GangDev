export function drawGame(ctx, canvas, camera, players, currentUserId, mapCanvas) {
    // Reset transformation and clear canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update camera (in world coordinates: meters)
    camera.update(players[currentUserId], canvas);

    // Set transform: scale by camera.zoom, and translate by camera.x and camera.y (in meters converted to pixels)
    ctx.setTransform(
        camera.zoom, 0, 0, camera.zoom,
        -camera.x * window.tileSize * camera.zoom,
        -camera.y * window.tileSize * camera.zoom
    );

    // Draw the pre-rendered map. (mapCanvas was created using tileSize in pixels)
    ctx.drawImage(mapCanvas, 0, 0);

    // Draw players. Convert player positions (meters) to pixels.
    for (const id in players) {
        const p = players[id];
        const px = p.x * window.tileSize;
        const py = p.y * window.tileSize;
        const playerSize = 2 * window.tileSize; // 2 meters tall
        ctx.fillStyle = p.userId === currentUserId ? "green" : "red";
        ctx.fillRect(px - playerSize / 2, py - playerSize / 2, playerSize, playerSize);
        ctx.fillStyle = "gray";
        ctx.font = `${16}px Arial`;
        const nameToDisplay = p.displayName || (p.user && p.user.displayName) || "Unknown";
        ctx.fillText(nameToDisplay, px - playerSize / 2, py - playerSize / 2 - 5);
    }
}