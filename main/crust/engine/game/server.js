import { createGameServer } from '../src/network/createServer.js';
import { startServerLoop } from '../src/network/serverLoop.js';

import path from 'path';

/* potential future use
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
*/

export function server(port, name, game) {
    const clientPath = path.join('/var/www/gangdev/crust/games/', game, 'client')
    const wss = createGameServer(port, name, clientPath); // create server
    startServerLoop(wss);
}

