import { drawPlayers, drawMap } from "../src/render/2d.js";
import { computeMovement } from "../src/movement/topDown.js";
import { sendData } from "../src/tools.js";
import { camera } from "../src/camera/topDown.js";
import { updateTelemetry, drawTelemetry } from "../src/ui/telemetry.js";

let firstFrame = true;
let lastFrameTime = null; // track last frame timestamp
const playerSpeedMultiplier = 6;

export function gameLoop(ts, canvas, ctx, gameState) {
    // deltaTime
    if (lastFrameTime === null) {
        lastFrameTime = ts;
    }

    let deltaTime = (ts - lastFrameTime) / 1000; // ms -> seconds
    lastFrameTime = ts;

    if (deltaTime < 0.0001) deltaTime = 0.0001;
    if (deltaTime > 0.05)   deltaTime = 0.05;

    // basic movement (no terrain slow here)
    let movement = computeMovement(deltaTime, playerSpeedMultiplier * window.scaling);

    const localPlayer = gameState.players[window.userId];
    window.inputBuffer = window.inputBuffer || [];

    if (localPlayer) {
        // init prediction once, starting from server state
        if (!localPlayer.predictedPosition) {
            localPlayer.predictedPosition = { x: localPlayer.x, y: localPlayer.y };
        }

        // apply local movement prediction
        localPlayer.predictedPosition.x += movement.dx;
        localPlayer.predictedPosition.y += movement.dy;

        // send the input to server
        const input = {
            dx: movement.dx,
            dy: movement.dy,
            ts: Date.now()
        };

        sendData(
            window.activeSocket,
            "movementInput",
            input,
            window.userId,
            window.username,
            window.displayName
        );

        window.inputBuffer.push(input);

        // camera follows predicted position
        const followX = localPlayer.predictedPosition.x + window.player / 2;
        const followY = localPlayer.predictedPosition.y + window.player / 2;

        if (firstFrame) {
            camera.x = followX;
            camera.y = followY;
            firstFrame = false;
        } else {
            camera.update({ x: followX, y: followY });
        }
    }

    // draw world
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(camera.zoom, camera.zoom);
    ctx.translate(-camera.x, -camera.y);

    if (window.sharedMap) drawMap(ctx, window.sharedMap, camera);
    drawPlayers(ctx);

    ctx.restore();

    // telemetry
    updateTelemetry(ts);
    drawTelemetry(ctx);

    requestAnimationFrame((ts) => gameLoop(ts, canvas, ctx, gameState));
}