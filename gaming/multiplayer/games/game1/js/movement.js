import { sendData } from "./utils.js";
import { drawGame } from "./render.js";
import { camera } from "./camera.js";

export const keys = {};
export const players = {};

// Initialize localPlayer in world coordinates (meters).
export const localPlayer = {
    x: 100, // Starting position (adjust as needed)
    y: 100,
    displayName: displayName, // from index.php
    userId: userId,           // from index.php
    crouching: false
};
players[userId] = localPlayer;

export const speed = 4; // meters per second
export let lastTime = performance.now();

export function gameLoop(timestamp, canvas, mapCanvas) {
    const delta = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    let effectiveSpeed;
    // Calculate effective speed:
    if (keys["Shift"] && !keys["Control"]) {
        effectiveSpeed = speed * 0.5;
    } else if (keys["Control"] && !keys["Shift"]) {
        effectiveSpeed = speed * 1.5;
    } else if (keys["Shift"] && keys["Control"]) {
        // Prioritize crouch if both are pressed.
        effectiveSpeed = speed * 0.5;
    } else {
        effectiveSpeed = speed;
    }

    if (keys["ArrowUp"] || keys["w"]) localPlayer.y -= effectiveSpeed * delta;
    if (keys["ArrowDown"] || keys["s"]) localPlayer.y += effectiveSpeed * delta;
    if (keys["ArrowLeft"] || keys["a"]) localPlayer.x -= effectiveSpeed * delta;
    if (keys["ArrowRight"] || keys["d"]) localPlayer.x += effectiveSpeed * delta;

    // Update crouch state.
    localPlayer.crouching = !!keys["Shift"];

    // Send movement update including crouch state.
    sendData(window.activeSocket, "movement", {
        x: localPlayer.x,
        y: localPlayer.y,
        crouching: localPlayer.crouching
    }, userId, username, displayName);

    // Draw the game.
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