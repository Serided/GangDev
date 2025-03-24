import { drawPlayers } from "../src/render/2d.js"
import { topDownInput } from "../src/input/topDown.js"
import { sendData } from "../src/tools.js";

let lastTimeStamp = 0;
let timeSinceLastSend = 0;
const networkSendInterval = 0.05; // 50ms

/**
 * A basic game loop that updates and renders the game.
 *
 * @param {number} ts - The current time from requestAnimationFrame.
 * @param {HTMLCanvasElement} canvas - The canvas element.
 * @param {CanvasRenderingContext2D} ctx - The 2D rendering context.
 * @param {Object} gameState - An object representing your game state (e.g., players, etc.).
 */

export function gameLoop(ts, canvas, ctx, gameState) {
    const deltaTime = (ts - lastTimeStamp) / 1000;
    lastTimeStamp = ts;
    timeSinceLastSend += deltaTime;

    const movement = topDownInput.getMovementVector(deltaTime);
    const localPlayer = gameState.players[window.userId];

    if (localPlayer) {
        if (movement.dx !== 0 || movement.dy !== 0) localPlayer.updatePosition(localPlayer.x + movement.dx, localPlayer.y + movement.dy);
        if (timeSinceLastSend >= networkSendInterval) {
            sendData(window.activeSocket, "playerMovement", localPlayer, window.userId, window.username, window.displayName);
            timeSinceLastSend = 0;
        }
    }

    drawPlayers(ctx);
    requestAnimationFrame((ts) => gameLoop(ts, canvas, ctx, gameState));
}