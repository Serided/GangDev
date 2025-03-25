import { gameState } from "../gameState.js";
import { Player } from "../classes/clientClasses.js";

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

/**
 * Draws the map onto the canvas with spatial culling, LOD, and batch drawing.
 * @param {CanvasRenderingContext2D} ctx - The 2D context.
 * @param {Object} mapData - The map data (tileSize, minX, minY, width, height, map array).
 * @param {Object} camera - The camera object with x, y, and zoom.
 */

export function drawMap(ctx, mapData, camera) {
    const { tileSize, minX, minY, width, height, map } = mapData;
    const overlapFactor = 0.1;
    const drawSize = tileSize * (1 + overlapFactor);
    const offset = (drawSize - tileSize) / 2;

    const tileColors = {
        water: "#00BFFF",    // Deep Sky Blue for vivid water
        sand: "#FFD700",     // Gold for bright, vibrant sand
        grass: "#32CD32",    // Lime Green for fresh, lively grass
        forest: "#228B22",   // Forest Green for dense, rich forest
        mountain: "#A9A9A9"  // Dark Gray for rugged mountains
    };

    // world boundaries in world coords
    const viewWidth = ctx.canvas.width / camera.zoom;
    const viewHeight = ctx.canvas.height / camera.zoom;
    const halfViewWidth = viewWidth / 2;
    const halfViewHeight = viewHeight / 2;
    const visibleLeft = camera.x - halfViewWidth;
    const visibleRight = camera.x + halfViewWidth;
    const visibleTop = camera.y - halfViewHeight;
    const visibleBottom = camera.y + halfViewHeight;

    // visible boundaries as indices
    const extraTiles = 3; // make edge seamless
    const startCol = Math.max(0, Math.floor((visibleLeft - minX) / tileSize) - extraTiles);
    const endCol = Math.min(width, Math.floor((visibleRight - minX) / tileSize) + extraTiles);
    const startRow = Math.max(0, Math.floor((visibleTop - minY) / tileSize) - extraTiles);
    const endRow = Math.min(height, Math.floor((visibleBottom - minY) / tileSize) + extraTiles);

    // LOD (level of detail) threshold (zoom out beyond this value, batch tiles)
    const lodThreshold = 0.8;

    // determine LOD block size
    let blockSize = 1;
    if (camera.zoom < lodThreshold) {
        blockSize = 4;
    }

    // loop through visible region
    for (let row = startRow; row < endRow; row += blockSize) {
        for (let col = startCol; col < endCol; col += blockSize) {
            let counts = {};
            let dominantTile = null;
            let maxCount = 0;

            for (let r = row; r < Math.min(row + blockSize, endRow); r++) {
                for (let c = col; c < Math.min(col + blockSize, endCol); c++) {
                    const tile = map[r][c];
                    counts[tile] = ( counts[tile] || 0 ) + 1;
                    if (counts[tile] > maxCount) {
                        maxCount = counts[tile];
                        dominantTile = tile;
                    }
                }
            }

            // compute drawing position in world coords
            const tileX = minX + col * tileSize;
            const tileY = minY + row * tileSize;

            if (blockSize > 1) { // if homo, draw larger rect for block
                const blockWidth = tileSize * blockSize;
                const blockDrawSize = drawSize * blockSize;
                const blockOffset = (blockDrawSize - blockWidth) / 2;

                ctx.fillStyle = tileColors[dominantTile] || "#FF00FF";
                ctx.fillRect(tileX - blockOffset, tileY - blockOffset, blockDrawSize, blockDrawSize);
            } else { // else draw tiles individually
                const tileType = map[row][col];
                ctx.fillStyle = tileColors[tileType] || "#FF00FF";
                ctx.fillRect(tileX - offset, tileY - offset, drawSize, drawSize);
            }
        }
    }
}