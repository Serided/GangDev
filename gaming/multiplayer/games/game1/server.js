const { createGameServer } = require('../shared/gameServer.js');
const path = require("path");

const port = 10001;
const name = "Crust";
const clientPath = path.join(__dirname, 'client');

console.log(`Serving static files from: ${clientPath}`);  // Debugging output

createGameServer(port, name, clientPath)