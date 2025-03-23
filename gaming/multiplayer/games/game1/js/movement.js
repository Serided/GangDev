import { sendData } from "./utils.js";
import { drawGame } from "./render.js";
import { camera } from "./camera.js";

export const keys = {};
export const players = {};

// localPlayer is created using global variables from index.php.
export const localPlayer = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    displayName: displayName,
    userId: userId
};
players[userId] = localPlayer;

export const speed = 200;
export let lastTime = performance.now();

export function gameLoop(timestamp) {
    const delta = (timestamp - lastTime) / 1000;
    lastTime = timestamp;
    const effectiveSpeed = speed / camera.zoom;

    if (keys["ArrowUp"] || keys["w"]) localPlayer.y -= effectiveSpeed * delta;
    if (keys["ArrowDown"] || keys["s"]) localPlayer.y += effectiveSpeed * delta;
    if (keys["ArrowLeft"] || keys["a"]) localPlayer.x -= effectiveSpeed * delta;
    if (keys["ArrowRight"] || keys["d"]) localPlayer.x += effectiveSpeed * delta;

    // Send movement update using current global activeSocket, userId, etc.
    sendData(window.activeSocket, "movement", { x: localPlayer.x, y: localPlayer.y }, userId, username, displayName);

    // drawGame uses camera.zoom when scaling everything, so it will redraw the map and players accordingly.
    drawGame(window.ctx, window.canvas, camera, players, userId, window.heightMap, window.tileSize);
    requestAnimationFrame(gameLoop);
}

export function handleMovementUpdate(data) {
    if (data && data.user && data.user.userId) {
        const current = players[data.user.userId] || {};
        players[data.user.userId] = {
            ...current,
            ...data,
            displayName: data.user.displayName || current.displayName,
            user: { ...current.user, ...data.user }
        };
    }
}