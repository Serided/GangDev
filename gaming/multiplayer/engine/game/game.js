import { drawPlayers } from "../src/render/2d.js"
import { topDownInput } from "../src/input/topDown.js"
import { sendData } from "../src/tools.js";

let lastTimeStamp = 0;

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

    const movement = topDownInput.getMovementVector(deltaTime);
    const localPlayer = gameState.players[window.userId];
    if (localPlayer) localPlayer.updatePosition(localPlayer.x + movement.dx, localPlayer.y + movement.dy);

    sendData(window.activeSocket, "playerMovement", localPlayer, window.userId, window.username, window.displayName);

    drawPlayers(ctx);
    requestAnimationFrame((ts) => gameLoop(ts, canvas, ctx, gameState));
}