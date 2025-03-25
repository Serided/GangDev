import { Map } from '../../../../engine/src/classes/serverClasses.js';

const myMap = new Map(15, 100, 100);

myMap.saveToFile("games/game1/src/map/map.json");