const { createGameServer } = require('/var/www/gangdev/gaming/multiplayer/engine/game/server.js');
const path = require("path");

createGameServer(10002, "Crust", path.join(__dirname, 'client')); // create server