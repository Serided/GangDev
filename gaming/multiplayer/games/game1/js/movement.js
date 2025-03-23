import { sendData } from "./utils.js";
import { drawGame } from "./render.js";
import { camera } from "./camera.js";

export const keys = {};
export const players = {};

export const localPlayer = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    displayName: displayName, // global from index.php
    userId: userId            // global from index.php
};
players[userId] = localPlayer;

export const speed = 200;
export let lastTime = performance.now();

export function gameLoop(timestamp, canvas, heightMap, tileSize) {
    const delta = (timestamp - lastTime) / 1000;
    lastTime = timestamp;
    const effectiveSpeed = speed / camera.zoom;
    if (keys["ArrowUp"] || keys["w"]) localPlayer.y -= effectiveSpeed * delta;
    if (keys["ArrowDown"] || keys["s"]) localPlayer.y += effectiveSpeed * delta;
    if (keys["ArrowLeft"] || keys["a"]) localPlayer.x -= effectiveSpeed * delta;
    if (keys["ArrowRight"] || keys["d"]) localPlayer.x += effectiveSpeed * delta;
    sendData(window.activeSocket, "movement", { x: localPlayer.x, y: localPlayer.y }, userId, username, displayName);
    drawGame(window.ctx, canvas, camera, players, userId, heightMap, tileSize);
    requestAnimationFrame((ts) => gameLoop(ts, canvas, heightMap, tileSize));
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
