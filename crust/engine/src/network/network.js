import { sendData } from '../tools.js'
import { appendMessage } from '../comms/chat.js'
import { updateStatus, updatePlayerCount } from '../ui/header.js'
import { Player } from '../classes/clientClasses.js';
import { gameState } from '../gameState.js'

export function authUser(authToken, username, userId, displayName, game) {
    return new Promise((resolve, reject) => {
        const gatewaySocket = new WebSocket("wss://crust.gangdev.co/socket");

        gatewaySocket.onopen = () => {
            const authPayload = JSON.stringify({ type: "auth", token: authToken, data: { username, userId, displayName } });
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

// connect to game server
export function connectToGame(gameUrl, gameName, username, userId, displayName, canvas, mapCanvas) {
    console.log(`Connecting to game server: ${gameUrl}`);
    if (!gameUrl.startsWith("wss://")) { // ensure URL formatted properly
        gameUrl = `wss://${window.location.host}${gameUrl}`;
    }
    const gameSocket = new WebSocket(gameUrl);

    gameSocket.onopen = () => {
        // console.log(`Connected to ${gameName}!`);
        window.activeSocket = gameSocket;
        sendData(gameSocket, "auth", { userId: window.userId, username: window.username, displayName: window.displayName });
        sendData(gameSocket, "playerSpawn", { userId: window.userId, username: window.username, displayName: window.displayName, x: (0 - (window.player / 2)), y: (0 - (window.player / 2)) }, window.userId, window.username, window.displayName);
        console.log(gameState)
        updateStatus(true);
    };

    gameSocket.onmessage = async (event) => {
        // console.log(`Message from server:`, event.data);
        let data;
        if (event.data instanceof Blob) {
            data = JSON.parse(await event.data.text());
        } else {
            data = JSON.parse(event.data);
        }
        switch (data.type) {
            case 'gameState': {
                const newPlayers = {};
                Object.keys(data.data).forEach(id => {
                    const p = data.data[id];
                    newPlayers[id] = new Player(p.userId, p.username, p.displayName, p.x, p.y);
                })
                gameState.players = newPlayers;
                return;
            } case 'chatMessage': {// add message to chat if it's a chat message
                appendMessage(data.data);
                break;
            } case 'playerCount': { // update player count if it's player count data
                updatePlayerCount(data.data);
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