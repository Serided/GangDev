const fs = require('fs');
const { Noise } = require('noisejs')
const noise = new Noise(42);

const path = "games/game2/src/map/"

// configuration
tileSize = 15; // is relative to scaling so make sure you change if scaling changes
const mapMin = -600;
const mapMax = 600;
const width = Math.ceil((mapMax - mapMin) / tileSize); // width tile count
const height = Math.ceil((mapMax - mapMin) / tileSize); // height tile count

// generate 2d array representing map
const map = [];
for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
        const nx = x / width - 0.5;
        const ny = y / height - 0.5;
        const elevation = noise.perlin2(nx * 5, ny * 5);

        let tileType = "water";
        if (elevation > 0.35) tileType = "mountain";
        else if (elevation > 1.5) tileType = "forest";
        else if (elevation > -0.25) tileType = "grass";
        else if (elevation > -0.325) tileType = "sand";

        row.push(tileType);
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