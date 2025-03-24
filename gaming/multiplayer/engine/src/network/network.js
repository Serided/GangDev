import { sendData } from "../tools.js"
import { gameLoop } from "../../game/game.js"
import { appendMessage } from "../comms/chat.js"
import { updateStatus, updatePlayerCount } from "../ui/header.js"
import { Player } from "../classes.js";
import { gameState } from "../gameState/clientGameState.js"

/**
 * Authenticates the user with the gateway server and requests to join a specified game.
 *
 * This function establishes a WebSocket connection to the gateway, sends an authentication
 * payload (including the JWT token, username, and userId), and then waits for the gateway's
 * response. Once an "authAck" is received, it sends a join request for the specified game.
 * When the gateway responds with a redirect URL, it closes the gateway connection and resolves
 * the Promise with an object containing the game server URL and game name.
 *
 * @param {string} authToken - The JWT token used for authentication.
 * @param {string} username - The user's username.
 * @param {string|number} userId - The user's unique identifier.
 * @param {string} game - The name of the game to join (e.g. "game1" or "game2").
 * @returns {Promise<Object>} A Promise that resolves with { gameUrl, gameName } on success.
 */

export function authUser(authToken, username, userId, game) {
    return new Promise((resolve, reject) => {
        const gatewaySocket = new WebSocket("wss://gaming.gangdev.co/socket");

        gatewaySocket.onopen = () => {
            const authPayload = JSON.stringify({ type: "auth", token: authToken, username, userId });
            gatewaySocket.send(authPayload);
        };

        gatewaySocket.onmessage = (e) => {
            try {
                const data = JSON.parse(e.data);

                if (data.type === "authAck") {
                    const joinPayload = JSON.stringify({ game });
                    gatewaySocket.send(joinPayload);
                } else if (data.redirect) {
                    gatewaySocket.close();
                    resolve({gameUrl: data.redirect, gameName: data.game });
                } else if (data.error) {
                    reject(new Error(data.error));
                }
            } catch (err) {
                reject(err);
            }
        };

        gatewaySocket.onerror = () => {
            reject(new Error("Gateway socket error"));
        };
    });
}

/**
 * Connects to a game server given a URL and game name.
 * This universal function sets up the WebSocket connection and its handlers.
 *
 * @param {string} gameUrl - The game server URL (will be corrected to wss:// if needed)
 * @param {string} gameName - The name of the game.
 * @returns {WebSocket} The connected game socket.
 */

export function connectToGame(gameUrl, gameName) {
    console.log(`Connecting to game server: ${gameUrl}`);
    if (!gameUrl.startsWith("wss://")) { // ensure URL formatted properly
        gameUrl = `wss://${window.location.host}${gameUrl}`;
    }
    const gameSocket = new WebSocket(gameUrl);

    gameSocket.onopen = () => {
        console.log(`Connected to ${gameName}!`);
        window.activeSocket = gameSocket;
        sendData(gameSocket, "chatMessage", "Player connected!", window.userId, window.username, window.displayName);
        sendData(gameSocket, "playerSpawn", { userId: window.userId, username: window.username, displayName: window.displayName, x: 200, y: 200}, window.userId, window.username, window.displayName);
        updateStatus(true);
    };

    gameSocket.onmessage = async (event) => {
        console.log(`Message from server:`, event.data);
        let data;
        if (event.data instanceof Blob) {
            data = JSON.parse(await event.data.text());
        } else {
            data = JSON.parse(event.data);
        }
        switch (data.type) {
            case 'gameState': {
                gameState.players = data.data;
                return;
            } case 'chatMessage': {// add message to chat if it's a chat message
                appendMessage(data.data);
                break;
            } case 'playerCount': { // update player count if it's player count data
                updatePlayerCount(data.data);
                break;
            } case 'playerSpawn': { // spawn player and add to game state
                const {userId, x, y, username, displayName} = data.data;
                gameState.players[userId] = new Player(userId, username, displayName, x, y);
                console.log(gameState);
                break;
            } case 'playerMovement': { // update player positions if it's player movement data
                const {userId, x, y, username, displayName} = data.data;
                if (gameState.players[userId]) {
                    gameState.players[userId].updatePosition(x, y);
                } else {
                    gameState.players[userId] = new Player(userId, username, displayName, x, y);
                }
                break;
            } default: {
                console.error("Invalid data:", data)
            }
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