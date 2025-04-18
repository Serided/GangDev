import fs from 'fs';
import pkg from 'noisejs'
const { Noise } = pkg;

function smoothStep(edge0, edge1, x) {
    x = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0))); // scale, bias and saturate x to 0..1 range
    return x * x * (3 - 2 * x); // eval polynomial
}

export class Map {
    /**
     * @param {number} tileSize - The size of each tile.
     * @param {number} min - The minimum coordinate (both x and y).
     * @param {number} max - The maximum coordinate (both x and y).
     * @param {number} [seed] - Optional seed for noise generation.
     */
    constructor(tileSize, km, seed) {
        this.tileSize = tileSize;
        const pixels = km * tileSize * 2 * 1000;
        this.min = (-pixels / 2);
        this.max = (pixels / 2);
        this.width = Math.ceil((this.max - this.min) / tileSize);
        this.height = Math.ceil((this.max - this.min) / tileSize);
        this.seed = seed || Math.floor(Math.random() * 100000);
        console.log("Using seed:", this.seed);
        this.noise = new Noise(this.seed);
    }

    /**
     * Generates the 2D map using Perlin noise.
     * @returns {Array<Array<string>>} The generated map as a 2D array of tile types.
     */

    generate() {
        const map = [];
        const factor = 75; // adjust terrain realism
        const frequency = this.width / factor;
        console.log("Using frequency:", frequency);
        for (let y = 0; y < this.height; y++) {
            const row = [];
            for (let x = 0; x < this.width; x++) {
                const nx = x / this.width - 0.5;
                const ny = y / this.height - 0.5;

                const distance = Math.sqrt(nx * nx + ny * ny);
                const falloff = smoothStep(0.3, 0.5, distance);

                const elevation = this.noise.perlin2(nx * frequency, ny * frequency) - falloff;

                let tileType = "water";
                if (elevation > 0.35) tileType = "mountain";
                else if (elevation > 0.15) tileType = "forest";
                else if (elevation > -0.25) tileType = "grass";
                else if (elevation > -0.325) tileType = "sand";

                row.push(tileType);
            }
            map.push(row);
        }
        return map;
    }

    /**
     * Returns the complete map data structure.
     * @returns {Object} An object containing map configuration and the 2D array.
     */

    getMapData() {
        return {
            tileSize: this.tileSize,
            minX: this.min,
            minY: this.min,
            width: this.width,
            height: this.height,
            map: this.generate(),
        }
    }

    /**
     * Saves the generated map data as JSON to the given file path.
     * If the file exists, creates a backup.
     * @param {string} filePath - The file path to save the map (e.g., "games/game2/src/map/map.json").
     */

    saveToFile(filePath) {
        const mapData = this.getMapData();
        if (fs.existsSync(filePath)) {
            fs.copyFileSync(filePath, filePath.replace('map.json', 'mapBackup.json'));
        }
        try {
            fs.writeFileSync(filePath, JSON.stringify(mapData, null, 2));
            console.log("Map saved successfully.")
            console.log("Saving map to:", fs.realpathSync(filePath));
        } catch (err) {
            console.error("Failed to save map:", err);
        }
    }
}