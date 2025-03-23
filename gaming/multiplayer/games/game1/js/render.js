import { Noise } from "https://unpkg.com/noisejs@2.0.0/index.js";
const noise = new Noise(Math.random());

export function drawGame(ctx, canvas, camera, players, currentUserId) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    camera.update(players[currentUserId], canvas);

    const scaledTileSize = tileSize * camera.zoom;

    const rows = heightMap.length;
    const cols = heightMap[0].length;
    const startCol = Math.floor(camera.x / scaledTileSize);
    const endCol = Math.min(cols, Math.ceil((camera.x + canvas.width) / scaledTileSize));
    const startRow = Math.floor(camera.y / scaledTileSize);
    const endRow = Math.min(rows, Math.ceil((camera.y + canvas.height) / scaledTileSize));

    for (let r = startRow; r < endRow; r++) {
        for (let c = startCol; c < endCol; c++) {
            const value = heightMap[r][c];
            let color;
            if (value < 0.3) color = "#2D70B3"; // water
            else if (value < 0.5) color = "#88C070"; // plains
            else if (value < 0.7) color = "#66A050"; // hills
            else color = "#7D7D7D"; // cliffs
            const screenX = c * scaledTileSize - camera.x;
            const screenY = r * scaledTileSize - camera.y;
            ctx.fillStyle = color;
            ctx.fillRect(screenX, screenY, scaledTileSize, scaledTileSize);
        }
    }

    for (const id in players) {
        const p = players[id];
        const screenX = p.x - camera.x;
        const screenY = p.y - camera.y;
        ctx.fillStyle = p.userId === currentUserId ? "green" : "red";
        ctx.fillRect(screenX - 25 * camera.zoom, screenY - 25 * camera.zoom, 50 * camera.zoom, 50 * camera.zoom);
        ctx.fillStyle = "gray";
        ctx.font = `${16 * camera.zoom}px Arial`;
        const nameToDisplay = p.displayName || (p.user && p.user.displayName) || "Unknown";
        ctx.fillText(nameToDisplay, screenX - 25 * camera.zoom, screenY - 30 * camera.zoom);
    }
}

export function generateHeightMap(width, height, scale) {
    const map = [];
    for (let y = 0; y < height; y++) {
        const row = [];
        for (let x = 0; x < width; x++) {
            let value = noise.perlin2(x / scale, y / scale);
            value = (value + 1) / 2; // Normalize to [0,1]
            row.push(value);
        }
        map.push(row);
    }
    return map;
}