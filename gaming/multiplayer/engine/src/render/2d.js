import { gameState } from "../gameState.js"
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

export function drawMap(ctx, mapData) {
    const { tileSize, minX, minY, width, height, map } = mapData;
    // loop through each row and column
    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            // compute world coordinates
            const tileX = minX + col * tileSize;
            const tileY = minY + row * tileSize;

            let color;
            switch (map[row][col]) {
                case "water":
                    color = "#2D70B3";
                    break;
                default:
                    color = "#000"; // default fallback color
            }

            ctx.fillStyle = color;
            ctx.fillRect(tileX, tileY, tileSize, tileSize);
        }
    }
}