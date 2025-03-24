import { authUser } from "/multiplayer/engine/src/network/auth.js";
import { sendData } from "/multiplayer/engine/src/tools.js";
import { appendMessage, sendMessage } from "/multiplayer/engine/src/chat/chat.js";

let activeSocket = null;

authUser(window.authToken, window.username, window.userId, "game2")
    .then(({ gameURL, gameName }) => {
        console.log("Authenticated! Received game server details:", gameURL, gameName);
        connectToGame(gameURL, gameName);
    })
    .catch(err => {
        console.error("Authentication failed:", err);
    });

function connectToGame(gameUrl, gameName) {
    console.log(`Connecting to game server: ${gameUrl}`);
    if (!gameUrl.startsWith("wss://")) {
        gameUrl = `wss://${window.location.host}${gameUrl}`;
    }
    const gameSocket = new WebSocket(gameUrl);

    gameSocket.onopen = () => {
        console.log(`Connected to ${gameName} server!`);
        activeSocket = gameSocket;
        sendData(activeSocket, "chatMessage", "Player connected!", window.userId, window.username, window.displayName);
        updateStatus(true);
    };

    gameSocket.onmessage = async (event) => {
        console.log("Message from server:", event.data);
        let data;
        if (event.data instanceof Blob) {
            data = JSON.parse(await event.data.text());
            console.log("its a blob");
        } else {
            data = JSON.parse(event.data);
        }
        switch (data.type) {
            case "chatMessage":
                appendMessage(data.data);
                break;
            case "playerCount":
                updatePlayerCount(data.data);
                break;
            default:
                console.error("Invalid data:", data);
        }
    };

    gameSocket.onerror = (event) => {
        console.error("WebSocket error:", event);
        updateStatus(false);
    };

    gameSocket.onclose = () => {
        console.log(`Disconnected from ${gameName} server.`);
        updateStatus(false);
    };
}

function updateStatus(status) {
    const statusElement = document.getElementById("status");
    statusElement.style.color = status ? "green" : "red";
    statusElement.textContent = status ? "Online" : "Offline";
}

function updatePlayerCount(count) {
    const playerCountElement = document.getElementById("players");
    playerCountElement.textContent = count.toString();
}

window.addEventListener("resize", () => {
    const gameCanvas = document.getElementById("gameCanvas");
    gameCanvas.width = window.innerWidth;
    gameCanvas.height = window.innerHeight;
});
