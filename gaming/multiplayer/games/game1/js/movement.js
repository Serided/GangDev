import { sendData } from "./utils.js";
import { drawGame } from "./render.js";
import { camera } from "./camera.js";

export const keys = {};
export const players = {};

// localPlayer in world coordinates (meters)
export const localPlayer = {
    x: 500, // starting at 500,500
    y: 500,
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

    // Sprint multiplier: if Control is pressed, add 50% speed.
    const sprintMultiplier = keys["Control"] ? 1.5 : 1.0;
    const effectiveSpeed = speed * sprintMultiplier;

    // Update local player position.
    if (keys["ArrowUp"] || keys["w"]) localPlayer.y -= effectiveSpeed * delta;
    if (keys["ArrowDown"] || keys["s"]) localPlayer.y += effectiveSpeed * delta;
    if (keys["ArrowLeft"] || keys["a"]) localPlayer.x -= effectiveSpeed * delta;
    if (keys["ArrowRight"] || keys["d"]) localPlayer.x += effectiveSpeed * delta;

    // Update crouch state.
    localPlayer.crouching = !!keys["Shift"];

    // Send movement update (including crouching state).
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