import { drawPlayers, drawMap } from "../src/render/2d.js"
import { topDownInput } from "../src/input/topDown.js"
import { sendData } from "../src/tools.js";
import { camera } from "../src/camera/topDown.js";

let lastTimeStamp = 0;

window.gameState = {
    players: {}
};

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

    if (localPlayer) {
        if (movement.dx !== 0 || movement.dy !== 0) {
            localPlayer.updatePosition(localPlayer.x + movement.dx, localPlayer.y + movement.dy);
            sendData(window.activeSocket, "playerMovement", localPlayer, window.userId, window.username, window.displayName);
        }
        camera.update(localPlayer, canvas)
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height); // CLEAR THE CANVAS

    ctx.save();
    ctx.scale(camera.zoom, camera.zoom);
    ctx.translate(-camera.x, -camera.y);

    if (window.sharedMap) {
        drawMap(ctx, window.sharedMap);
    }

    drawPlayers(ctx);

    ctx.restore();

    requestAnimationFrame((ts) => gameLoop(ts, canvas, ctx, gameState));
}