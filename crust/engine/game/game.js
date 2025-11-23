import { drawPlayers, drawMap } from "../src/render/2d.js"
import { computeMovement } from "../src/movement/topDown.js"
import { sendData } from "../src/tools.js";
import { camera } from "../src/camera/topDown.js";
import { updateStats, drawStats } from "../src/debug/stats.js";

let firstFrame = true;
let lastFrameTime = null; // track last frame timestamp
const playerSpeedMultiplier = 6;

export function gameLoop(ts, canvas, ctx, gameState) {
    if (lastFrameTime === null) {
        lastFrameTime = ts;
    }

    let deltaTime = (ts - lastFrameTime) / 1000; // ms to seconds
    lastFrameTime = ts;

    if (deltaTime < 0.0001) deltaTime = 0.0001;
    if (deltaTime > 0.05) deltaTime = 0.05;

    const movement = computeMovement(deltaTime, (playerSpeedMultiplier * window.scaling));
    const localPlayer = gameState.players[window.userId];
    window.inputBuffer = window.inputBuffer || [];

    if (localPlayer) {
        if (!localPlayer.predictedPosition) {
            localPlayer.predictedPosition = { x: localPlayer.x, y: localPlayer.y };
        }

        localPlayer.predictedPosition.x += movement.dx;
        localPlayer.predictedPosition.y += movement.dy;

        const input = { dx: movement.dx, dy: movement.dy, ts: Date.now() };
        sendData(window.activeSocket, "movementInput", input, window.userId, window.username, window.displayName);

        window.inputBuffer.push(input);

        if (firstFrame) {
            camera.x = localPlayer.predictedPosition.x + window.player / 2;
            camera.y = localPlayer.predictedPosition.y + window.player / 2;
            firstFrame = false;
        } else {
            camera.update({x: localPlayer.predictedPosition.x, y: localPlayer.predictedPosition.y });
        }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height); // CLEAR THE CANVAS
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2); // set camera x and y to player center
    ctx.scale(camera.zoom, camera.zoom);
    ctx.translate(-camera.x, -camera.y);
    if (window.sharedMap) drawMap(ctx, window.sharedMap, camera);
    drawPlayers(ctx);
    ctx.restore();

    requestAnimationFrame((ts) => gameLoop(ts, canvas, ctx, gameState));
    updateStats(ts);
    drawStats(ctx);
}