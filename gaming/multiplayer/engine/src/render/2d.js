import { gameState } from "../gameState/gameState.js"
import { Player } from "../classes.js"

/**
 * Draws all players on the canvas.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas 2D context.
 * @param {Player[]} players - An array of Player objects to be drawn.
 */

export function drawPlayers(ctx) {
    // clear the canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // draw each player
    Object.values(gameState.players).forEach(player => {
        player.draw(ctx);
    });
}