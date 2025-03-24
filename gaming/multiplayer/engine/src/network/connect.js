import { sendData } from "../tools.js"
import { appendMessage } from "../comms/chat.js"
import { updateStatus, updatePlayerCount } from "../ui/header.js"

/**
 * Connects to a game server given a URL and game name.
 * This universal function sets up the WebSocket connection and its handlers.
 *
 * @param {string} gameUrl - The game server URL (will be corrected to wss:// if needed)
 * @param {string} gameName - The name of the game.
 * @returns {WebSocket} The connected game socket.
 */

export function connectToGame(gameUrl, gameName) {
    console.log(`COnnecting to game server: ${gameUrl}`);
    if (!gameUrl.startsWith("wss://")) { // ensure URL formatted properly
        gameUrl = `wss://${window.location.host}${gameUrl}`;
    }
    const gameSocket = new WebSocket(gameUrl);

    gameSocket.onopen = () => {
        console.log(`Connected to ${gameName}!`);
        window.activeSocket = gameSocket;
        // initial chat message
        sendData(gameSocket, "chatMessage", "Player connected!", window.userId, window.username, window.displayName);
        updateStatus(true);
    };

    gameSocket.onmessage = async (event) => {
        console.log(`Message from server:`, event.data);
        let data;
        if (event.data instanceof Blob) {
            data.JSON.parse(await event.data.text());
        } else {
            data = JSON.parse(event.data);
        }
        switch (data.type) {
            case "chatMessage": // add message to chat if it's a chat message
                appendMessage(data.data);
                break;
            case "playerCount": // update player count if it's player count data
                updatePlayerCount(data.data);
                break;
            case "playerMovement": // update player positions if it's player movement data
                break;
            default:
                console.error("Invalid data:", data)
        }
    };

    gameSocket.onerror = (e) => {
        console.error("WebSocket error: ", e);
        updateStatus(false);
    };

    gameSocket.onclose = () => {
        console.log(`Disconnected from ${gameName}.`)
        updateStatus(false);
    };

    return gameSocket;
}