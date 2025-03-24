// engine.js
import { drawGame } from "./render.js";
import { camera } from "./camera.js";

// Export keys and players for global state.
export const keys = {};
export const players = {};

// Initialize localPlayer (in world coordinates, in meters).
export const localPlayer = {
    x: 100,
    y: 100,
    displayName: window.displayName,
    userId: window.userId,
    crouching: false
};
players[localPlayer.userId] = localPlayer;

export const speed = 4; // meters per second
let lastTime = performance.now();

export function gameLoop(timestamp, canvas, mapCanvas) {
    const delta = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    let effectiveSpeed;
    if (keys["Shift"] && !keys["Control"]) {
        effectiveSpeed = speed * 0.5;
    } else if (keys["Control"] && !keys["Shift"]) {
        effectiveSpeed = speed * 1.5;
    } else if (keys["Shift"] && keys["Control"]) {
        effectiveSpeed = speed * 0.5;
    } else {
        effectiveSpeed = speed;
    }

    if (keys["ArrowUp"] || keys["w"]) localPlayer.y -= effectiveSpeed * delta;
    if (keys["ArrowDown"] || keys["s"]) localPlayer.y += effectiveSpeed * delta;
    if (keys["ArrowLeft"] || keys["a"]) localPlayer.x -= effectiveSpeed * delta;
    if (keys["ArrowRight"] || keys["d"]) localPlayer.x += effectiveSpeed * delta;

    localPlayer.crouching = !!keys["Shift"];

    drawGame(window.ctx, canvas, camera, players, localPlayer.userId, mapCanvas);

    requestAnimationFrame((ts) => gameLoop(ts, canvas, mapCanvas));
}

export function updatePlayerMovement(data) {
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
window.handleMovementUpdate = updatePlayerMovement;
