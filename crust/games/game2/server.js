import { createGameServer } from '/engine/game/server.js';
import path from 'path';

createGameServer(10002, "Crust", path.join(__dirname, 'client')); // create server