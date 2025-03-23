import { sendData } from "./utils.js";
import { drawGame } from "./map.js";
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
    if (keys["ArrowUp"] || keys["w"]) localPlayer.y -= speed * delta;
    if (keys["ArrowDown"] || keys["s"]) localPlayer.y += speed * delta;
    if (keys["ArrowLeft"] || keys["a"]) localPlayer.x -= speed * delta;
    if (keys["ArrowRight"] || keys["d"]) localPlayer.x += speed * delta;

    // Use window.activeSocket (set in connection.js)
    sendData(window.activeSocket, "movement", { x: localPlayer.x, y: localPlayer.y }, userId, username, displayName);
    drawGame(window.ctx, window.canvas, camera, players, userId);
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