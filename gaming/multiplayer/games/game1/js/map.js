import Noise from "https://esm.sh/noisejs@2.1.0";

// Create a noise instance once using a fixed seed for reproducibility
const noise = new Noise(Math.random());

// Generates a height map as a 2D array of normalized values [0,1]
export function generateHeightMap(width, height, scale) {
    const map = new Array(height);
    for (let y = 0; y < height; y++) {
        map[y] = new Array(width);
        for (let x = 0; x < width; x++) {
            let value = noise.perlin2(x / scale, y / scale);
            // Normalize from [-1,1] to [0,1]
            map[y][x] = (value + 1) / 2;
        }
    }
    return map;
}

// Generates a simple collision map as a 2D array of booleans.
// A cell is "collidable" (true) if its height is above the collisionThreshold.
export function generateCollisionMap(heightMap, collisionThreshold = 0.7) {
    const rows = heightMap.length;
    const cols = heightMap[0].length;
    const collisionMap = new Array(rows);
    for (let y = 0; y < rows; y++) {
        collisionMap[y] = new Array(cols);
        for (let x = 0; x < cols; x++) {
            collisionMap[y][x] = heightMap[y][x] >= collisionThreshold;
        }
    }
    return collisionMap;
}

// Generates and returns both height and collision maps.
export function generateMap(width, height, scale, collisionThreshold = 0.7) {
    const heightMap = generateHeightMap(width, height, scale);
    const collisionMap = generateCollisionMap(heightMap, collisionThreshold);
    return { heightMap, collisionMap };
}

// Create a global map instance on module load.
// For a 1km x 1km map (1000 x 1000 cells), with a noise scale of 100.
export const globalMap = generateMap(1000, 1000, 100, 0.7);