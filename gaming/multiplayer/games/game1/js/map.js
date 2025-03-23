export function drawGame(ctx, canvas, camera, players, currentUserId) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    camera.update(players[currentUserId], canvas);
    for (const id in players) {
        const p = players[id];
        const screenX = p.x - camera.x;
        const screenY = p.y - camera.y;
        ctx.fillStyle = p.userId === currentUserId ? "green" : "red";
        ctx.fillRect(screenX - 25, screenY - 25, 50, 50);
        ctx.fillStyle = "gray";
        ctx.font = "16px Arial";
        const nameToDisplay = p.displayName || (p.user && p.user.displayName) || "Unknown";
        ctx.fillText(nameToDisplay, screenX - 25, screenY - 30);
    }
}