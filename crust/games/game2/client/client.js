// game engine
import { authUser, connectToGame } from "/engine/src/network/network.js";
import { sendData } from "/engine/src/tools.js";
import { appendMessage, sendMessage } from "/engine/src/comms/chat.js";
import { updateStatus, updatePlayerCount } from "/engine/src/ui/header.js";
import { setup2dCanvas } from "/engine/src/canvas.js";
import { gameLoop } from "/engine/game/game.js";
import { Player } from "/engine/src/classes.js";
import { gameState } from "/engine/src/gameState.js";
import { topDownInput } from "/engine/src/input/topDown.js";
import { drawMap } from "/engine/src/render/2d.js";

// local libraries (none rn)

let activeSocket = null;

window.gameWindow = setup2dCanvas();
topDownInput.setupInputListeners();

function startGameLoop() {
    requestAnimationFrame((ts) => gameLoop(ts, window.gameWindow.canvas, window.gameWindow.ctx, gameState));
}

authUser(window.authToken, window.username, window.userId, "game2")
    .then(({ gameUrl, gameName }) => {
        console.log("Authenticated! Received game server details:", gameUrl, gameName);
        activeSocket = connectToGame(gameUrl, gameName);
        startGameLoop();
    })
    .catch(err => {
        console.error("Authentication failed:", err);
    });

const mapUrl = `/games/game2/src/map/map.json?t=${Date.now()}`
fetch(mapUrl)
    .then(res => res.json())
    .then(mapData => {
        window.sharedMap = mapData;
        requestAnimationFrame((ts) => gameLoop(ts, window.gameWindow.canvas, window.gameWindow.ctx, gameState));
    })
    .catch(err => {
        console.error("Failed to load map:", err)
    })