import { Map } from '/engine/src/classes/serverClasses.js';

const myMap = new Map(15, -2400, 2400);

myMap.saveToFile("games/game1/src/map/map.json");