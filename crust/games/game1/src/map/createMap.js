import { Map } from '../../../../engine/src/classes/serverClasses.js';

const myMap = new Map(15, -12000, 12000);

myMap.saveToFile("games/game1/src/map/map.json");