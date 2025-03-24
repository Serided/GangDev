import { drawPlayer } from "../src/render/2d.js"

/**
 * A basic game loop that updates and renders the game.
 *
 * @param {number} timestamp - The current time from requestAnimationFrame.
 * @param {HTMLCanvasElement} canvas - The canvas element.
 * @param {CanvasRenderingContext2D} ctx - The 2D rendering context.
 * @param {Object} gameState - An object representing your game state (e.g., players, etc.).
 */

export function gameLoop(timestamp, canvas, ctx, gameState) {
    drawPlayer(ctx, gameState.players);
    requestAnimationFrame((ts) => gameLoop(ts, canvas, ctx, gameState));
}