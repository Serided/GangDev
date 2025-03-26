const seedArg = process.argv[2];
const seed = seedArg ? parseInt(seedArg, 10) : undefined;

import { Map } from '../../../../engine/src/classes/serverClasses.js';
const myMap = new Map(16, 0.1, seed);
myMap.saveToFile("games/game2/src/map/map.json");