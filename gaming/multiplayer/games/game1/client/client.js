// client.js
import { createGameClient } from "/var/www/gangdev/gaming/multiplayer/engine/game/client.js";
import { initConnection } from "../js/network.js";
import { setupUI, setupInputListeners } from "../js/ui.js";
import { globalMap, createMapCanvas } from "../js/map.js";
import { camera } from "../js/camera.js";
import { keys } from "../js/engine.js";

// Wait for DOM to be loaded.
document.addEventListener("DOMContentLoaded", () => {
    createGameClient()
        .then(({ canvas, ctx, authDetails }) => {
            // Set a tile size for your game.
            const tileSize = 20;
            window.tileSize = tileSize;

            // Generate the global map and offscreen map canvas.
            window.heightMap = globalMap.heightMap;
            const mapCanvas = createMapCanvas(globalMap.heightMap, tileSize);
            window.heightMapCanvas = mapCanvas;

            // Set up UI and input listeners.
            // Note: Ensure sendMessage is defined or imported in your UI module.
            const chatInput = setupUI(sendMessage);
            if (chatInput) {
                setupInputListeners(keys, chatInput, camera);
            }

            // Set auth globals (optional, but useful for other parts of your game).
            window.authToken = authDetails.authToken;
            window.username = authDetails.username;
            window.userId = authDetails.userId;
            window.displayName = authDetails.displayName;

            // Initialize connection to the game server using the canvas and offscreen map canvas.
            initConnection(authDetails.authToken, authDetails.username, authDetails.userId, authDetails.displayName, canvas, mapCanvas);
        })
        .catch(err => {
            console.error("Error initializing game client:", err);
        });
});
