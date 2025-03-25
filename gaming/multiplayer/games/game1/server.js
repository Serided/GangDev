const { createGameServer } = require('/var/www/gangdev/gaming/multiplayer/engine/game/server.js');
const path = require("path");

createGameServer(10001, "gaming.gangdev.co", "Crust", path.join(__dirname, 'client')); // create server