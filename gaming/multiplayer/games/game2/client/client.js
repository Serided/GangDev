// game engine
import { authUser, connectToGame } from "/multiplayer/engine/src/network/network.js";
import { sendData } from "/multiplayer/engine/src/tools.js";
import { appendMessage, sendMessage } from "/multiplayer/engine/src/comms/chat.js";
import { updateStatus, updatePlayerCount } from "/multiplayer/engine/src/ui/header.js";
import { setup2dCanvas } from "/multiplayer/engine/src/canvas.js";
import { gameLoop } from "/multiplayer/engine/game/game.js";
import { Player } from "/multiplayer/engine/src/classes.js";

// local libraries
import { chatButton, chatPanel } from "../src/ui.js"

let activeSocket = null;

const { canvas, ctx } = setup2dCanvas();
const gameState = {
    players: []
};

const localPlayer = new Player(window.userId, window.username, window.displayName, 100, 100);
gameState.players.push(localPlayer);

function startGameLoop() {
    requestAnimationFrame((ts) => gameLoop(ts, canvas, ctx, gameState));
}

authUser(window.authToken, window.username, window.userId, "game2")
    .then(({ gameUrl, gameName }) => {
        console.log("Authenticated! Received game server details:", gameUrl, gameName);
        activeSocket = connectToGame(gameUrl, gameName);
        startGameLoop();
    })
    .catch(err => {
        console.error("Authentication failed:", err);
    });0