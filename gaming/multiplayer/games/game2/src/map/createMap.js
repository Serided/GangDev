const fs = require('fs');

const path = "games/game2/src/map/"

// configuration
tileSize = 15;
const mapMin = -2400;
const mapMax = 2400;

// calculate how many tiles for each dimension
const width = Math.ceil((mapMax - mapMin) / tileSize);
const height = Math.ceil((mapMax - mapMin) / tileSize);

// generate 2d array representing map
// each cell is water
const map = [];
for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
        row.push("water");
    }
    map.push(row);
}

const mapData = {
    tileSize,
    minX: mapMin,
    minY: mapMin,
    width,
    height,
    map
};

if (fs.existsSync(`${path}/map.json`)) {
    fs.copyFileSync(`${path}/map.json`, `${path}/mapBackup.json`);
}
try {
    fs.writeFileSync(`${path}/map.json`, JSON.stringify(mapData, null, 2));
    console.log("Map saved successfully.");
} catch (err) {
    console.error("Failed to save map:", err);
}

console.log("Mag generated and saved to map.json");
console.log("Saving map to:", fs.realpathSync(`${path}/map.json`));