// network.js
import { gameLoop } from "./engine.js";

export function sendData(activeSocket, type, data, userId, username, displayName) {
    if (activeSocket && activeSocket.readyState === WebSocket.OPEN) {
        let payload = (typeof data === "string" || data instanceof String)
            ? { text: data }
            : data;
        const enrichedData = { ...payload, user: { userId, username, displayName } };
        const message = JSON.stringify({ type, data: enrichedData });
        const blob = new Blob([message], { type: "application/json" });
        activeSocket.send(blob);
    } else {
        console.warn("Cannot send data. WebSocket closed.");
    }
}

window.sendData = sendData;

export let activeSocket;

export function initConnection(authToken, username, userId, displayName, canvas, mapCanvas) {
    const gatewaySocket = new WebSocket("wss://gaming.gangdev.co/socket");
    gatewaySocket.onopen = () => {
        console.log("Connected to gateway");
        const authPayload = JSON.stringify({ type: "auth", token: authToken, username, userId });
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
                connectToGame(data.redirect, data.game, username, userId, displayName, canvas, mapCanvas);
            } else if (data.error) {
                console.error("Gateway error:", data.error);
            } else if (data.message) {
                import("./ui.js").then(ui => ui.appendMessage(data.message, userId));
            }
        } catch (err) {
            console.error("Error parsing gateway message:", err);
        }
    };
    gatewaySocket.onerror = (event) => {
        console.error("Gateway socket error:", event);
    };
}

export function connectToGame(gameUrl, gameName, username, userId, displayName, canvas, mapCanvas) {
    console.log(`Connecting to game server: ${gameUrl}`);
    if (!gameUrl.startsWith("wss://")) {
        gameUrl = `wss://${window.location.host}${gameUrl}`;
    }
    const gameSocket = new WebSocket(gameUrl);
    gameSocket.onopen = () => {
        console.log(`Connected to ${gameName} server`);
        activeSocket = gameSocket;
        window.activeSocket = gameSocket;
        sendData(activeSocket, "chatMessage", "Player connected!", userId, username, displayName);

        // Force an initial movement update using the global localPlayer.
        if (window.localPlayer) {
            sendData(
                activeSocket,
                "movement",
                {
                    x: window.localPlayer.x,
                    y: window.localPlayer.y,
                    crouching: window.localPlayer.crouching
                },
                userId,
                username,
                displayName
            );
        } else {
            console.warn("localPlayer is not defined globally.");
        }

        import("./ui.js").then(ui => ui.updateStatus(true));
        requestAnimationFrame((ts) => gameLoop(ts, canvas, mapCanvas));
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
                import("./ui.js").then(ui => ui.appendMessage(data.data, userId));
                break;
            case "playerCount":
                import("./ui.js").then(ui => ui.updatePlayerCount(data.data));
                break;
            case "movement":
                window.handleMovementUpdate(data.data);
                break;
            default:
                console.error("Invalid data:", data);
        }
    };
    gameSocket.onerror = (event) => {
        console.error("Game socket error:", event);
        import("./ui.js").then(ui => ui.updateStatus(false));
    };
    gameSocket.onclose = () => {
        console.log(`Disconnected from ${gameName} server`);
        import("./ui.js").then(ui => ui.updateStatus(false));
    };
}