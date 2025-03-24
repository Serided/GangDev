const fs = require('fs');

// configuration
tileSize = 15;
const mapMin = -600;
const mapMax = 600;

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

fs.writeFileSync("map.json", JSON.stringify(mapData, null, 2));

console.log("Mag generated and saved to map.json");
console.log(mapData);