const { createGameServer } = require('../shared/gameServer.js');
const path = require("path");

const port = 10001;
const name = "Game 1";
const clientPath = path.join(__dirname, 'client');

createGameServer(port, name, clientPath)