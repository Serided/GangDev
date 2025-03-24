const { createGameServer } = require('../../engine/src/gameServer.js');
const path = require("path");

createGameServer(10002, "CrustTest", path.join(__dirname, 'client')); // create server