import { getUserIcon } from "../render/imageCache.js";

export class Player {
    constructor(userId, username, displayName, x = 0, y = 0) {
        this.userId = userId;
        this.username = username;
        this.displayName = displayName;

        // authoritative server position
        this.x = x;
        this.y = y;

        // client prediction for local player (used on window.userId only)
        this.predictedPosition = null;

        this.iconUrl = `https://user.gangdev.co/${userId}/icon/user-icon.jpg`;
    }

    updatePosition(newX, newY) {
        this.x = newX;
        this.y = newY;
    }

    draw(ctx, size = (window.player)) {
        let drawX = this.x;
        let drawY = this.y;

        // For LOCAL player, use predicted position if available
        if (this.userId === window.userId && this.predictedPosition) {
            drawX = this.predictedPosition.x;
            drawY = this.predictedPosition.y;
        }

        // body
        const color = this.userId === window.userId ? "lightgreen" : "red";
        ctx.fillStyle = color;
        ctx.fillRect(drawX, drawY, size, size);

        // name
        ctx.fillStyle = "black";
        ctx.font = ctx.font || "14px Arial";
        ctx.textAlign = "center";
        ctx.fillText(this.displayName, drawX + (size / 2), drawY - 5);

        // icon
        const icon = getUserIcon(this.userId);
        if (icon && icon.complete && icon.naturalWidth > 0) {
            const iconSize = size * 0.8;
            const offset = (size - iconSize) / 2;
            ctx.drawImage(icon, drawX + offset, drawY + offset, iconSize, iconSize);
        }
    }
}
