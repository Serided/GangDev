export function drawGame(ctx, canvas, camera, players, currentUserId, mapCanvas) {
    // Reset transformation and clear canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update camera based on the local player's position.
    camera.update(players[currentUserId], canvas);

    // Set the transform: scale by zoom and translate so that the camera.x,y
    // becomes the top-left corner of the viewport.
    ctx.setTransform(camera.zoom, 0, 0, camera.zoom, -camera.x * camera.zoom, -camera.y * camera.zoom);

    // Draw the pre-rendered map.
    ctx.drawImage(mapCanvas, 0, 0);

    // Draw players (in world coordinates)
    for (const id in players) {
        const p = players[id];
        ctx.fillStyle = p.userId === currentUserId ? "green" : "red";
        // Assuming player is 2 meters tall; tileSize represents 1 meter at zoom 1.
        const playerSize = 2;
        ctx.fillRect(p.x - (playerSize * 0.5), p.y - (playerSize * 0.5), playerSize, playerSize);
        ctx.fillStyle = "gray";
        ctx.font = `${16}px Arial`;
        const nameToDisplay = p.displayName || (p.user && p.user.displayName) || "Unknown";
        ctx.fillText(nameToDisplay, p.x - (playerSize * 0.5), p.y - (playerSize * 0.5) - 5);
    }
}