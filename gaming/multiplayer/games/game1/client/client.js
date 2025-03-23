import { initConnection } from "../js/connection.js";
import { keys } from "../js/movement.js";
import { camera } from "../js/camera.js";
import { sendMessage } from "../js/utils.js";
import { globalMap } from "../js/map.js";
import { setupUI, setupCanvas } from "../js/ui.js";
import { setupInputListeners } from "../js/input.js";

const { canvas, ctx } = setupCanvas();
const tileSize = 20; // pixels per meter at zoom 1
window.tileSize = tileSize;

window.heightMap = globalMap.heightMap;

const chatInput = setupUI(sendMessage);

setupInputListeners(keys, chatInput, camera);

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

initConnection(authToken, username, userId, displayName, canvas);
