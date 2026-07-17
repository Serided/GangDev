export function getTileAtWorldPos(mapData, x, y) {
    if (!mapData || !mapData.map) return null;

    const { tileSize, minX, minY, width, height, map } = mapData;

    const col = Math.floor((x - minX) / tileSize);
    const row = Math.floor((y - minY) / tileSize);

    if (row < 0 || row >= height || col < 0 || col >= width) return null;

    return map[row][col]; // "water", "sand", "grass", etc.
}

const SPEED_MULTIPLIERS = {
    water: 0.45,
    sand: 1.0,
    grass: 1.0,
    forest: 1.0,
    mountain: 1.0
};

export function getTerrainSpeedMultiplier(mapData, x, y) {
    const tile = getTileAtWorldPos(mapData, x, y);
    if (!tile) return 1;
    return SPEED_MULTIPLIERS[tile] ?? 1;
}

export function applyTerrainToDelta(mapData, x, y, dx, dy) {
    const m = getTerrainSpeedMultiplier(mapData, x, y);
    return {
        dx: dx * m,
        dy: dy * m,
    };
}