import noisejs from "https://esm.sh/noisejs@2.1.0";

const fixedSeed = 12345;
const noise = new noisejs.Noise(fixedSeed);

export function generateHeightMap(width, height, scale) {
    const map = new Array(height);
    for (let y = 0; y < height; y++) {
        map[y] = new Array(width);
        for (let x = 0; x < width; x++) {
            const value = noise.perlin2(x / scale, y / scale);
            map[y][x] = (value + 1) / 2;
        }
    }
    return map;
}

export function generateMap(width, height, scale, collisionThreshold = 0.7) {
    const heightMap = generateHeightMap(width, height, scale);
    const collisionMap = heightMap.map(row => row.map(val => val >= collisionThreshold));
    return { heightMap, collisionMap };
}

// For debugging, we generate a 200×200 map (you can change these numbers later).
export const globalMap = generateMap(200, 200, 50);
console.log("Map dimensions (cells):", globalMap.heightMap.length, globalMap.heightMap[0].length);

export function createMapCanvas(heightMap, tileSize) {
    const rows = heightMap.length;
    const cols = heightMap[0].length;
    const offCanvas = document.createElement("canvas");
    offCanvas.width = cols * tileSize;
    offCanvas.height = rows * tileSize;
    const offCtx = offCanvas.getContext("2d");

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const value = heightMap[r][c];
            let color;
            if (value < 0.3) color = "#2D70B3";    // water
            else if (value < 0.5) color = "#88C070"; // plains
            else if (value < 0.7) color = "#66A050"; // hills
            else color = "#7D7D7D";                 // cliffs
            offCtx.fillStyle = color;
            offCtx.fillRect(c * tileSize, r * tileSize, tileSize, tileSize);
        }
    }
    console.log("Offscreen canvas dimensions (pixels):", offCanvas.width, offCanvas.height);
    return offCanvas;
}
