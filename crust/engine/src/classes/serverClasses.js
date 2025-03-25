import fs from 'fs';
import pkg from 'noisejs'
const { Noise } = pkg;

export class Map {
    /**
     * @param {number} tileSize - Size of each half meter by half meter tile, in pixels.
     * @param {number} km - Map size in kilometers
     * @param {number} [seed] - Optional seed for noise generation.
     */
    constructor(tileSize, km, seed) {
        this.tileSize = tileSize;
        const totalTiles = 2000 * km;
        this.width = totalTiles;
        this.height = totalTiles;

        const meters = totalTiles * 0.5;
        this.min = -meters / 2;
        this.max = meters / 2;
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
        for (let y = 0; y < this.height; y++) {
            const row = [];
            for (let x = 0; x < this.width; x++) {
                const nx = x / this.width - 0.5;
                const ny = y / this.height - 0.5;
                const elevation = this.noise.perlin2(nx * 5, ny * 5);

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