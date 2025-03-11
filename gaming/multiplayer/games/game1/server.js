const { createGameServer } = require('../shared/gameServer.js');
const path = require("path");

const port = 10001;
const name = "Crust";
const clientPath = path.join(__dirname, 'client');

createGameServer(port, name, clientPath)