// engine.js
import { drawGame } from "./render.js";
import { camera } from "./camera.js";

export const keys = {};
export const players = {};

// Initialize localPlayer in world coordinates (meters)
export const localPlayer = {
    x: 100, // Starting position (adjust as needed)
    y: 100,
    displayName: window.displayName, // from index.php
    userId: window.userId,           // from index.php
    crouching: false
};
players[localPlayer.userId] = localPlayer;
window.localPlayer = localPlayer;

export const speed = 4; // meters per second
let lastTime = performance.now();

export function gameLoop(timestamp, canvas, mapCanvas) {
    const delta = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    // Calculate effective speed based on modifier keys.
    let effectiveSpeed;
    if (keys["Shift"] && !keys["Control"]) {
        effectiveSpeed = speed * 0.5;
    } else if (keys["Control"] && !keys["Shift"]) {
        effectiveSpeed = speed * 1.5;
    } else if (keys["Shift"] && keys["Control"]) {
        effectiveSpeed = speed * 0.5; // Prioritize crouch when both are held.
    } else {
        effectiveSpeed = speed;
    }

    if (keys["ArrowUp"] || keys["w"]) localPlayer.y -= effectiveSpeed * delta;
    if (keys["ArrowDown"] || keys["s"]) localPlayer.y += effectiveSpeed * delta;
    if (keys["ArrowLeft"] || keys["a"]) localPlayer.x -= effectiveSpeed * delta;
    if (keys["ArrowRight"] || keys["d"]) localPlayer.x += effectiveSpeed * delta;

    // Update crouch state.
    localPlayer.crouching = !!keys["Shift"];

    // Instead of using window.ctx, always get the current 2D context from canvas.
    const ctx = canvas.getContext("2d");
    drawGame(ctx, canvas, camera, players, localPlayer.userId, mapCanvas);

    requestAnimationFrame((ts) => gameLoop(ts, canvas, mapCanvas));
}

export function updatePlayerMovement(data) {
    console.log("Received movement update for other player:", data);
    if (data && data.user && data.user.userId) {
        const current = players[data.user.userId] || {};
        players[data.user.userId] = {
            ...current,
            ...data,
            displayName: data.user.displayName || current.displayName,
            user: { ...current.user, ...data.user }
        };
        console.log("Updated players:", players);
    }
}
window.handleMovementUpdate = updatePlayerMovement;
