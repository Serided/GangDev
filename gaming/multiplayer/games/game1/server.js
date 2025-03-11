const { createGameServer } = require('../shared/gameServer.js');
const path = require("path");

createGameServer(10001, "Game 1", path.join(__dirname, 'client')); // create server