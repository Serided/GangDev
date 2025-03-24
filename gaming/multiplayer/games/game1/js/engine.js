// engine.js
import { drawGame } from "./render.js";
import { camera } from "./camera.js";

export const keys = {};
export const players = {};

// Server-authoritative localPlayer; position updates come from the server.
export const localPlayer = {
    x: 100,
    y: 100,
    displayName: window.displayName,
    userId: window.userId,
    crouching: false
};
players[localPlayer.userId] = localPlayer;
window.localPlayer = localPlayer;

export const speed = 4; // meters per second
let lastTime = performance.now();

// Optionally throttle movement messages (in milliseconds).
const MOVE_COMMAND_INTERVAL = 50;
let lastMoveCommandTime = 0;

export function gameLoop(timestamp, canvas, mapCanvas) {
    const delta = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    // Check input state and calculate movement intent.
    let dx = 0, dy = 0;
    if (keys["ArrowUp"] || keys["w"]) dy -= 1;
    if (keys["ArrowDown"] || keys["s"]) dy += 1;
    if (keys["ArrowLeft"] || keys["a"]) dx -= 1;
    if (keys["ArrowRight"] || keys["d"]) dx += 1;
    const isCrouching = !!keys["Shift"];

    // Only send a movement command if some time has elapsed (throttling)
    if (timestamp - lastMoveCommandTime > MOVE_COMMAND_INTERVAL && (dx || dy || localPlayer.crouching !== isCrouching)) {
        let effectiveSpeed = speed;
        if (keys["Shift"] && !keys["Control"]) effectiveSpeed = speed * 0.5;
        else if (keys["Control"] && !keys["Shift"]) effectiveSpeed = speed * 1.5;
        else if (keys["Shift"] && keys["Control"]) effectiveSpeed = speed * 0.5;

        // Calculate movement delta.
        const moveX = dx * effectiveSpeed * delta;
        const moveY = dy * effectiveSpeed * delta;

        // Send movement command to the server.
        if (window.activeSocket && window.sendData) {
            window.sendData(window.activeSocket, "movement", { moveX, moveY, crouching: isCrouching },
                localPlayer.userId, localPlayer.username, localPlayer.displayName);
        }
        lastMoveCommandTime = timestamp;
    }

    // Render the game based on players positions updated from the server.
    const ctx = canvas.getContext("2d");
    drawGame(ctx, canvas, camera, players, localPlayer.userId, mapCanvas);

    requestAnimationFrame(ts => gameLoop(ts, canvas, mapCanvas));
}

export function updatePlayerMovement(data) {
    // Ignore movement updates for the local player if needed,
    // or always update if server is authoritative.
    if (data?.user?.userId) {
        const id = data.user.userId;
        const current = players[id] || {};
        // Update the player's position and crouch state based on the server update.
        players[id] = {
            ...current,
            ...data,
            displayName: data.user.displayName || current.displayName,
            user: { ...current.user, ...data.user }
        };
    }
}
window.handleMovementUpdate = updatePlayerMovement;
