import { gameState } from "../gameState.js";
import { Player } from "../classes/clientClasses.js";

export function drawPlayers(ctx) {
    // draw each player
    Object.values(gameState.players).forEach(player => {
        player.draw(ctx);
    });
}

export function drawMap(ctx, mapData, camera) {
    const { tileSize, minX, minY, width, height, map } = mapData;
    const overlapFactor = 0.1;
    const drawSize = tileSize * (1 + overlapFactor);
    const offset = (drawSize - tileSize) / 2;

    const tileColors = {
        water: "#00BFFF",    // light blue water
        sand: "#FFD700",     // gold sand
        grass: "#32CD32",    // lime green grass
        forest: "#228B22",   // dark green forest
        mountain: "#A9A9A9"  // gray mountains
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

    // visible boundaries as indices (extra margin from extra tiles)
    const extraTiles = 3;

    const rawStartCol = Math.floor((visibleLeft - minX) / tileSize);
    const rawEndCol = Math.floor((visibleRight - minX) / tileSize);
    const rawStartRow = Math.floor((visibleTop - minY) / tileSize);
    const rawEndRow = Math.floor((visibleBottom - minY) / tileSize);

    const startCol = Math.max(0, rawStartCol - extraTiles);
    const endCol = Math.min(width, rawEndCol + extraTiles);
    const startRow = Math.max(0, rawStartRow - extraTiles);
    const endRow = Math.min(height, rawEndRow + extraTiles);

    // determine LOD block size
    const lodThreshold = 0.8;
    let blockSize = 1;
    if (camera.zoom < lodThreshold) {
        blockSize = 4;
    }

    const snappedStartCol = Math.floor(startCol / blockSize) * blockSize;
    const snappedStartRow = Math.floor(startRow / blockSize) * blockSize;

    // loop through visible region
    for (let row = snappedStartRow; row < endRow; row += blockSize) {
        for (let col = snappedStartCol; col < endCol; col += blockSize) {
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