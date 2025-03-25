import { gameState } from "../gameState.js";
import { Player } from "../classes.js";

/**
 * Draws all players on the canvas.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas 2D context.
 * @param {Player[]} players - An array of Player objects to be drawn.
 */

export function drawPlayers(ctx) {
    // draw each player
    Object.values(gameState.players).forEach(player => {
        player.draw(ctx);
    });
}

export function drawMap(ctx, mapData) {
    const { tileSize, minX, minY, width, height, map } = mapData;
    const overlapFactor = 0.2;
    const drawSize = tileSize * (1 + overlapFactor);
    const offset = (drawSize - tileSize) / 2;

    const tileColors = {
        water: "#74C0FC",
        sand: "#F2C57C",
        grass: "#95D5B2",
        forest: "#2D6A4F",
        mountain: "#6E6E6E"
    };

    // loop through each row and column
    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            // compute world coordinates
            const tileX = minX + col * tileSize;
            const tileY = minY + row * tileSize;
            const tileType = map[row][col]

            ctx.fillStyle = tileColors[tileType] || "#FF00FF";
            ctx.fillRect(tileX - offset, tileY - offset, drawSize, drawSize);
        }
    }
}