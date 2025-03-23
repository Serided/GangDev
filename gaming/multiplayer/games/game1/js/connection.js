import { gameLoop } from "./movement.js";
import { updateStatus, updatePlayerCount, sendData, appendMessage, sendMessage } from "./utils.js";

export let activeSocket;

export function initConnection(authToken, username, userId, displayName, canvas) {
    const gatewaySocket = new WebSocket("wss://gaming.gangdev.co/socket");
    gatewaySocket.onopen = () => {
        console.log("Connected to gateway");
        updateStatus(true);
        const authPayload = JSON.stringify({
            type: "auth",
            token: authToken,
            username: username,
            userId: userId
        });
        console.log("Sending auth payload:", authPayload);
        gatewaySocket.send(authPayload);
    };

    gatewaySocket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            console.log("Gateway response:", data);
            if (data.type === "authAck") {
                const joinPayload = JSON.stringify({ game: "game1" });
                console.log("Sending join payload:", joinPayload);
                gatewaySocket.send(joinPayload);
            } else if (data.redirect) {
                gatewaySocket.close();
                connectToGame(data.redirect, data.game, username, userId, displayName, canvas);
            } else if (data.error) {
                console.error("Gateway error:", data.error);
            } else if (data.message) {
                appendMessage(data.message, userId);
            }
        } catch (err) {
            console.error("Error parsing gateway message:", err);
        }
    };

    gatewaySocket.onerror = (event) => {
        console.error("Gateway socket error:", event);
    };
}

export function connectToGame(gameUrl, gameName, username, userId, displayName, canvas) {
    console.log(`Connecting to game server: ${gameUrl}`);
    if (!gameUrl.startsWith("wss://")) {
        gameUrl = `wss://${window.location.host}${gameUrl}`;
    }
    const gameSocket = new WebSocket(gameUrl);
    gameSocket.onopen = () => {
        console.log(`Connected to ${gameName} server`);
        activeSocket = gameSocket;
        window.activeSocket = gameSocket; // Attach to window for global access.
        sendData(activeSocket, 'chatMessage', 'Player connected!', userId, username, displayName);
        updateStatus(true);
        requestAnimationFrame(gameLoop);
    };
    gameSocket.onmessage = async (event) => {
        let data;
        if (event.data instanceof Blob && typeof event.data.text === "function") {
            data = JSON.parse(await event.data.text());
        } else {
            data = JSON.parse(event.data);
        }
        switch (data.type) {
            case "chatMessage":
                appendMessage(data.data, userId);
                break;
            case "playerCount":
                updatePlayerCount(data.data);
                break;
            case "movement":
                handleMovementUpdate(data.data);
                break;
            default:
                console.error("Invalid data:", data);
        }
    };
    gameSocket.onerror = (event) => {
        console.error("Game socket error:", event);
        updateStatus(false);
    };
    gameSocket.onclose = () => {
        console.log(`Disconnected from ${gameName} server`);
        updateStatus(false);
    };
}