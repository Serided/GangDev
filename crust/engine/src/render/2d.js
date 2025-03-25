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
        water: "#74C0FC",
        sand: "#F2C57C",
        grass: "#95D5B2",
        forest: "#2D6A4F",
        mountain: "#6E6E6E"
    };

    const viewWidth = ctx.canvas.width / camera.zoom;
    const viewHeight = ctx.canvas.height / camera.zoom;
    const halfViewWidth = viewWidth / 2;
    const halfViewHeight = viewHeight / 2;

    // visible world boundaries
    const visibleLeft = camera.x - halfViewWidth;
    const visibleRight = camera.x + halfViewWidth;
    const visibleTop = camera.y - halfViewHeight;
    const visibleBottom = camera.y + halfViewHeight;

    // visible boundaries as indices
    const startCol = Math.max(0, Math.floor((visibleLeft - minX) / tileSize));
    const endCol = Math.min(width, Math.floor((visibleRight - minX) / tileSize));
    const startRow = Math.max(0, Math.floor((visibleTop - minY) / tileSize));
    const endRow = Math.min(height, Math.floor((visibleBottom - minY) / tileSize));

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
            // LOD: blockSize > 1, check if similar (some might even say homogeneous)
            let dominantTile = map[row][col];
            let homogenous = true;
            if (blockSize > 1) {
                for (let r = row; r < Math.min(row + blockSize, endRow); r++) {
                    for (let c = col; c < Math.min(col + blockSize, endCol); c++) {
                        if (map[r][c] !== dominantTile) {
                            homogenous = false;
                            break;
                        }
                    }
                    if (!homogenous) break;
                }
            }

            // compute drawing position in world coords
            const tileX = minX + col * tileSize;
            const tileY = minY + row * tileSize;

            if (blockSize > 1 && homogenous) { // if homo, draw larger rect for block
                const blockWidth = tileSize * blockSize;
                const blockHeight = tileSize * blockSize;
                // adjust drawSize we want big block to overlap
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

/**
 * Returns the color for a given tile type.
 * @param {string} tileType
 * @returns {string} Hex color code.
 */