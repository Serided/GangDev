import { Map } from '../../../../engine/src/classes/serverClasses.js';

const myMap = new Map(16, 0.1);

myMap.saveToFile("games/game1/src/map/map.json");