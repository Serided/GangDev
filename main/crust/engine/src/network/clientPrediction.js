export function reconcileLocalPlayer(clientPlayer, serverPlayer, inputBuffer = []) {
    const targetX = serverPlayer.x;
    const targetY = serverPlayer.y;

    // Make sure we have a prediction state
    if (!clientPlayer.predictedPosition) {
        clientPlayer.predictedPosition = { x: targetX, y: targetY };
    }

    // How hard to pull prediction toward the server
    // 0   = never correct
    // 0.5 = medium correction
    // 1   = hard snap
    const snapFactor = 0.45;

    clientPlayer.predictedPosition.x += (targetX - clientPlayer.predictedPosition.x) * snapFactor;
    clientPlayer.predictedPosition.y += (targetY - clientPlayer.predictedPosition.y) * snapFactor;

    // Use server's lastProcessedTs to drop old inputs
    const lastProcessedTs = serverPlayer.lastProcessedTs || 0;
    const pendingInputs = inputBuffer.filter(input => input.ts > lastProcessedTs);

    // Reapply only the last few unprocessed inputs (prevents huge overshoot)
    pendingInputs.slice(-3).forEach(input => {
        clientPlayer.predictedPosition.x += input.dx;
        clientPlayer.predictedPosition.y += input.dy;
    });

    // Keep server truth stored as well (for remote views, debugging, etc.)
    clientPlayer.x = targetX;
    clientPlayer.y = targetY;

    // Return the trimmed buffer
    return pendingInputs;
}
