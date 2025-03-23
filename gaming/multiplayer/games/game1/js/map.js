import noisejs from "https://esm.sh/noisejs@2.1.0";

const fixedSeed = 12345; // Fixed seed for consistency
const noise = new noisejs.Noise(fixedSeed);

export function generateHeightMap(width, height, scale) {
    const map = new Array(height);
    for (let y = 0; y < height; y++) {
        map[y] = new Array(width);
        for (let x = 0; x < width; x++) {
            let value = noise.perlin2(x / scale, y / scale);
            map[y][x] = (value + 1) / 2; // Normalize to [0,1]
        }
    }
    return map;
}

export function generateMap(width, height, scale, collisionThreshold = 0.7) {
    const heightMap = generateHeightMap(width, height, scale);
    // For collision map: (not used here, but available)
    const collisionMap = heightMap.map(row => row.map(val => val >= collisionThreshold));
    return { heightMap, collisionMap };
}

// Generate a global map once (1km x 1km)
export const globalMap = generateMap(1000, 1000, 1000);
