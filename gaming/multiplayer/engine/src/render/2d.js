import { Player } from "../classes.js"

/**
 * Draws all players on the canvas.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas 2D context.
 * @param gameState
 */

export function drawPlayers(ctx, gameState) {
    // clear the canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // draw each player
    Object.values(gameState.players).forEach(player => {
        player.draw(ctx);
    });
}