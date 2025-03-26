import { drawPlayers, drawMap } from "../src/render/2d.js"
import { topDownInput } from "../src/input/topDown.js"
import { sendData } from "../src/tools.js";
import { camera } from "../src/camera/topDown.js";

let lastTimeStamp = 0;
let firstFrame = true;
let fixedDeltaTime = 1 / 60; // fps

/**
 * A basic game loop that updates and renders the game.
 *
 * @param {number} ts - The current time from requestAnimationFrame.
 * @param {HTMLCanvasElement} canvas - The canvas element.
 * @param {CanvasRenderingContext2D} ctx - The 2D rendering context.
 * @param {Object} gameState - An object representing your game state (e.g., players, etc.).
 */

export function gameLoop(ts, canvas, ctx, gameState) {
    const movement = topDownInput.computeMovement(fixedDeltaTime, (8 * window.scaling));
    const localPlayer = gameState.players[window.userId];

    if (localPlayer) {
        localPlayer.updatePosition(localPlayer.x + movement.dx, localPlayer.y + movement.dy);
        console.log(localPlayer);
        sendData(window.activeSocket, "playerMovement", localPlayer, window.userId, window.username, window.displayName);

        if (firstFrame) {
            camera.x = localPlayer.x + window.player / 2;
            camera.y = localPlayer.y + window.player / 2;
            firstFrame = false;
        } else {
            camera.update(localPlayer)
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
}