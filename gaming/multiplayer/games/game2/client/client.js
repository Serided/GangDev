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

function startGameLoop() {
    requestAnimationFrame((ts) => gameLoop(ts, canvas, ctx));
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