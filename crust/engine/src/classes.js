import fs from 'fs';
import { Noise } from 'https://esm.sh/noisejs@2.1.0';

import { getUserIcon } from "./render/imageCache.js";

export class Player {
    /**
     * Creates a new Player instance.
     *
     * @param {string|number} userId - The player's unique identifier.
     * @param {string} username - The player's username.
     * @param {string} displayName - The player's display name.
     * @param {number} [x=0] - The player's initial x-coordinate.
     * @param {number} [y=0] - The player's initial y-coordinate.
     */
    constructor(userId, username, displayName, x = 0, y = 0) {
        this.userId = userId;
        this.username = username;
        this.displayName = displayName;
        this.x = x;
        this.y = y;
        this.iconUrl = `https://user.gangdev.co/${userId}/icon/user-icon.jpg`;
    }

    /**
     * Updates the player's position.
     *
     * @param {number} newX - The new x-coordinate.
     * @param {number} newY - The new y-coordinate.
     */

    updatePosition(newX, newY) {
        this.x = newX;
        this.y = newY;
    }

    /**
     * Draw the player.
     *
     * @param {CanvasRenderingContext2D} ctx - The drawing context.
     * @param {number} size - The size of the player cube.
     */

    draw(ctx, size = (window.player)) {
        // determine color
        const color = this.userId === window.userId ? "green" : "red";
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, size, size);

        // get font

        // draw player's display name
        ctx.fillStyle = "black";
        ctx.font = ctx.font || "14px Arial"; // use current font if set, or default
        ctx.textAlign = "center";
        ctx.fillText(this.displayName, this.x + (size / 2), this.y - 5);

        const icon = getUserIcon(this.userId);
        if (icon && icon.complete && icon.naturalWidth > 0) {
            const iconSize = size * 0.8;
            const offset = (size - iconSize) / 2;
            ctx.drawImage(icon, this.x + offset, this.y + offset, iconSize, iconSize);
        }
    }
}

export class Map {
    /**
     * @param {number} tileSize - The size of each tile.
     * @param {number} min - The minimum coordinate (both x and y).
     * @param {number} max - The maximum coordinate (both x and y).
     * @param {number} [seed] - Optional seed for noise generation.
     */
    constructor(tileSize, min, max, seed) {
        this.tileSize = tileSize;
        this.min = min;
        this.max = max;
        this.width = Math.ceil((max - min) / tileSize);
        this.height = Math.ceil((max - min) / tileSize);
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