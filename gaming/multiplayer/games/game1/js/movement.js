import { sendData } from "./utils.js";
import { drawGame } from "./render.js";
import { camera } from "./camera.js";

export const keys = {};
export const players = {};

// localPlayer is initialized in world coordinates.
export const localPlayer = {
    x: 500, // Start at 500 meters (center of 1000m map)
    y: 500,
    displayName: displayName, // from index.php
    userId: userId            // from index.php
};
players[userId] = localPlayer;

export const speed = 4; // meters per second (adjusted for a slower pace)
export let lastTime = performance.now();

export function gameLoop(timestamp, canvas, mapCanvas) {
    const delta = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    if (keys["ArrowUp"] || keys["w"]) localPlayer.y -= speed * delta;
    if (keys["ArrowDown"] || keys["s"]) localPlayer.y += speed * delta;
    if (keys["ArrowLeft"] || keys["a"]) localPlayer.x -= speed * delta;
    if (keys["ArrowRight"] || keys["d"]) localPlayer.x += speed * delta;

    sendData(window.activeSocket, "movement", { x: localPlayer.x, y: localPlayer.y }, userId, username, displayName);
    drawGame(window.ctx, canvas, camera, players, userId, mapCanvas);
    requestAnimationFrame((ts) => gameLoop(ts, canvas, mapCanvas));
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
window.handleMovementUpdate = handleMovementUpdate;
