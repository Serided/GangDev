const { Map } = require('/engine/src/classes.js');

const myMap = new Map(15, -2400, 2400);

myMap.saveToFile("games/game2/src/map/map.json");