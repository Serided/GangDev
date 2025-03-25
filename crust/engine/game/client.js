import { authUser } from "../src/network/auth.js";
import { setupCanvas } from "../src/canvas/2d.js";

export function createGameClient() {
    return new Promise((resolve, reject) => {
        document.addEventListener("DOMContentLoaded", () => {
            const canvasData = setupCanvas();
            if (!canvasData) {
                return reject(new Error("Canvas setup failed."));
            }
            const { canvas, ctx } = canvasData;

            authUser()
                .then((authDetails) => {
                    window.authToken = authDetails.authToken;
                    window.username = authDetails.username;
                    window.userId = authDetails.userId;
                    window.displayName = authDetails.displayName;

                    resolve({ canvas, ctx, authDetails });
                })
                .catch((err) => {
                    reject(err);
                });
        });
    })
}