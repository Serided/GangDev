import { drawPlayers, drawMap } from "../src/render/2d.js"
import { computeMovement } from "../src/movement/topDown.js"
import { sendData } from "../src/tools.js";
import { camera } from "../src/camera/topDown.js";
import { updateStats, drawStats } from "../src/debug/stats.js";

let firstFrame = true;
let lastFrameTime = null; // track last frame timestamp
const playerSpeedMultiplier = 6;

export function gameLoop(ts, canvas, ctx, gameState) {
    // ----- deltaTime -----
    if (lastFrameTime === null) {
        lastFrameTime = ts;
    }

    let deltaTime = (ts - lastFrameTime) / 1000; // ms to seconds
    lastFrameTime = ts;

    if (deltaTime < 0.0001) deltaTime = 0.0001;
    if (deltaTime > 0.05)   deltaTime = 0.05;

    const movement = computeMovement(deltaTime, (playerSpeedMultiplier * window.scaling));
    const localPlayer = gameState.players[window.userId];
    window.inputBuffer = window.inputBuffer || [];

    if (localPlayer) {
        // we do NOT touch predictedPosition anymore
        // we only send inputs to the server

        const input = { dx: movement.dx, dy: movement.dy, ts: Date.now() };
        sendData(window.activeSocket, "movementInput", input, window.userId, window.username, window.displayName);
        window.inputBuffer.push(input);

        // camera follows the SMOOTHED render position
        const followX = localPlayer.renderX + window.player / 2;
        const followY = localPlayer.renderY + window.player / 2;

        if (firstFrame) {
            camera.x = followX;
            camera.y = followY;
            firstFrame = false;
        } else {
            camera.update({ x: followX, y: followY });
        }
    }

    // ----- draw world -----
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(camera.zoom, camera.zoom);
    ctx.translate(-camera.x, -camera.y);

    if (window.sharedMap) drawMap(ctx, window.sharedMap, camera);
    drawPlayers(ctx);

    ctx.restore();

    // ----- stats -----
    updateStats(ts);
    drawStats(ctx);

    requestAnimationFrame((ts) => gameLoop(ts, canvas, ctx, gameState));
}