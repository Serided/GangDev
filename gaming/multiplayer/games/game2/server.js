const { createGameServer } = require('../shared/gameServer.js');
const path = require("path");

createGameServer(10002, "Game 2", path.join(__dirname, 'client')); // create server