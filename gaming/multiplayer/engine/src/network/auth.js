import { sendData } from "../tools.js"
import { gameLoop } from "../../game/game.js"

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
                console.log("Gateway full response:", data);

                if (data.type === "authAck") {
                    const joinPayload = JSON.stringify({ game });
                    gatewaySocket.send(joinPayload);
                } else if (data.redirect) {
                    gatewaySocket.close();
                    resolve({gameURL: data.redirect, gameName: data.game });
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