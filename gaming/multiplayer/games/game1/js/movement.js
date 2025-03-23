import {sendData} from "./utils";
import {drawGame} from "./map";
import {camera} from "./camera";

export const keys = {};
export const players = {};

// Set up local player starting position.
export const localPlayer = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    displayName: displayName, // Assume displayName is defined globally (from PHP)
    userId: userId            // Assume userId is defined globally (from PHP)
};
players[userId] = localPlayer;

export const speed = 200;
export let lastTime = performance.now();

function gameLoop(timestamp) {
    const delta = (timestamp - lastTime) / 1000;
    lastTime = timestamp;
    if (keys["ArrowUp"] || keys["w"]) localPlayer.y -= speed * delta;
    if (keys["ArrowDown"] || keys["s"]) localPlayer.y += speed * delta;
    if (keys["ArrowLeft"] || keys["a"]) localPlayer.x -= speed * delta;
    if (keys["ArrowRight"] || keys["d"]) localPlayer.x += speed * delta;

    sendData("movement", { x: localPlayer.x, y: localPlayer.y });
    drawGame(ctx, canvas, camera, players, userId);
    requestAnimationFrame(gameLoop);
}

export function handleMovementUpdate(data) {
    if (data && data.user && data.user.userId) {
        const current = players[data.user.userId] || {};
        // Preserve displayName if not provided in the update.
        players[data.user.userId] = {
            ...current,
            ...data,
            displayName: data.user.displayName || current.displayName,
            user: { ...current.user, ...data.user }
        };
    }
}