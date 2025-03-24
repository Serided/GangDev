// engine.js
import { drawGame } from "./render.js";
import { camera } from "./camera.js";

// State: keys, players, and localPlayer
export const keys = {};
export const players = {};

// Initialize localPlayer in world coordinates (meters)
export const localPlayer = {
    x: 100, // Starting position (must be within the map bounds)
    y: 100,
    displayName: window.displayName, // from index.php
    userId: window.userId,           // from index.php
    crouching: false
};
players[localPlayer.userId] = localPlayer;

export const speed = 4; // meters per second
let lastTime = performance.now();

export function gameLoop(timestamp, canvas, mapCanvas) {
    const delta = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    // Calculate effective speed:
    // If only Shift is held, reduce speed to 50%; if only Control, increase to 150%; if both, crouch mode takes precedence.
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

    // Update localPlayer position
    if (keys["ArrowUp"] || keys["w"]) localPlayer.y -= effectiveSpeed * delta;
    if (keys["ArrowDown"] || keys["s"]) localPlayer.y += effectiveSpeed * delta;
    if (keys["ArrowLeft"] || keys["a"]) localPlayer.x -= effectiveSpeed * delta;
    if (keys["ArrowRight"] || keys["d"]) localPlayer.x += effectiveSpeed * delta;

    // Update crouch state.
    localPlayer.crouching = !!keys["Shift"];

    // Call render.
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