import { sendData } from '../tools.js';
import { appendMessage } from '../comms/chat.js';
import { updateStatus, updatePlayerCount } from '../ui/header.js';
import { Player } from '../classes/clientClasses.js';
import { gameState } from '../gameState.js';

export function authUser(authToken, username, userId, displayName, game) {
    return new Promise((resolve, reject) => {
        const gatewaySocket = new WebSocket("wss://crust.gangdev.co/socket");

        gatewaySocket.onopen = () => {
            const authPayload = JSON.stringify({
                type: "auth",
                token: authToken,
                data: { username, userId, displayName }
            });
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
                    resolve({ gameUrl: data.redirect, gameName: data.game });
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

export function connectToGame(gameUrl, gameName, username, userId, displayName, canvas, mapCanvas) {
    console.log(`Connecting to game server: ${gameUrl}`);
    if (!gameUrl.startsWith("wss://")) {
        gameUrl = `wss://${window.location.host}${gameUrl}`;
    }

    const gameSocket = new WebSocket(gameUrl);

    gameSocket.onopen = () => {
        window.activeSocket = gameSocket;
        sendData(gameSocket, "auth", { userId, username, displayName });
        sendData(gameSocket, "playerSpawn", {
            userId,
            username,
            displayName,
            x: 0 - (window.player / 2),
            y: 0 - (window.player / 2)
        });
        updateStatus(true);
    };

    gameSocket.onmessage = async (event) => {
        let data;
        if (event.data instanceof Blob) {
            data = JSON.parse(await event.data.text());
        } else {
            data = JSON.parse(event.data);
        }

        switch (data.type) {
            case 'gameState': {
                const serverPlayers = data.data;
                if (!window.inputBuffer) window.inputBuffer = [];

                Object.keys(serverPlayers).forEach(uid => {
                    const serverPlayer = serverPlayers[uid];
                    let clientPlayer = gameState.players[uid];

                    // create Player instance if needed
                    if (!clientPlayer) {
                        clientPlayer = new Player(
                            serverPlayer.userId,
                            serverPlayer.username,
                            serverPlayer.displayName,
                            serverPlayer.x,
                            serverPlayer.y
                        );
                        gameState.players[uid] = clientPlayer;
                    }

                    if (uid === String(window.userId)) {
                        // local player prediction + reconciliation

                        const targetX = serverPlayer.x;
                        const targetY = serverPlayer.y;

                        // ensure predictedPosition exists
                        if (!clientPlayer.predictedPosition) {
                            clientPlayer.predictedPosition = { x: targetX, y: targetY };
                        }

                        // gently pull prediction toward server state
                        const snapFactor = 0.35; // 0 = never correct, 1 = hard snap
                        clientPlayer.predictedPosition.x += (targetX - clientPlayer.predictedPosition.x) * snapFactor;
                        clientPlayer.predictedPosition.y += (targetY - clientPlayer.predictedPosition.y) * snapFactor;

                        // drop already-processed inputs using lastProcessedTs
                        const lastProcessedTs = serverPlayer.lastProcessedTs || 0;
                        const pendingInputs = window.inputBuffer.filter(input => input.ts > lastProcessedTs);

                        // reapply only unprocessed inputs on top of server state
                        pendingInputs.forEach(input => {
                            clientPlayer.predictedPosition.x += input.dx;
                            clientPlayer.predictedPosition.y += input.dy;
                        });

                        window.inputBuffer = pendingInputs;

                        // keep server truth stored on the player
                        clientPlayer.x = targetX;
                        clientPlayer.y = targetY;
                    } else {
                        // ---- REMOTE PLAYERS: pure server positions ----
                        clientPlayer.updatePosition(serverPlayer.x, serverPlayer.y);
                    }
                });
                break;
            }

            case 'chatMessage': {
                appendMessage(data.data);
                break;
            }

            case 'playerCount': {
                updatePlayerCount(data.data);
                break;
            }

            default: {
                console.error("Invalid data:", data);
            }
        }
    };

    gameSocket.onerror = (e) => {
        console.error("WebSocket error: ", e);
        updateStatus(false);
    };

    gameSocket.onclose = () => {
        console.log(`Disconnected from ${gameName}.`);
        updateStatus(false);
    };

    return gameSocket;
}
