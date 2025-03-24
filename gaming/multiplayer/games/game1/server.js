const { createGameServer } = require('/engine/src/server.js');
const path = require("path");

createGameServer(10001, "Crust", path.join(__dirname, 'client')); // create server