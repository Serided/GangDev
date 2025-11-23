import { authUser } from "../src/network/network.js";
import { setup2dCanvas } from "../src/render/canvas.js";

export function createGameClient() {
    return new Promise((resolve, reject) => {
        document.addEventListener("DOMContentLoaded", () => {
            const canvasData = setup2dCanvas();
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