const { createGameServer } = require('../shared/gameServer.js');
const path = require("path");

const port = 10002;
const name = "Game 2";
const clientPath = path.join(__dirname, 'client');

createGameServer(port, name, clientPath)