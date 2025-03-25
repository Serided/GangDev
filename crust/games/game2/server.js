import { createGameServer } from '../../engine/game/server.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

createGameServer(10002, "Crust", path.join(__dirname, 'client')); // create server