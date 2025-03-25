const { createGameServer } = require('/var/www/gangdev/crust/engine/game/server.js');
const path = require("path");

createGameServer(10001, "Crust", path.join(__dirname, 'client')); // create server