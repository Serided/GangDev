import { getUserIcon } from "../render/imageCache.js";

export class Player {
    constructor(userId, username, displayName, x = 0, y = 0) {
        this.userId = userId;
        this.username = username;
        this.displayName = displayName;
        this.x = x;
        this.y = y;
        this.renderX = x;
        this.renderY = y;
        this.iconUrl = `https://user.gangdev.co/${userId}/icon/user-icon.jpg`;
    }

    updatePosition(newX, newY) {
        this.x = newX;
        this.y = newY;
    }

    draw(ctx, size = (window.player)) {
        // smooth render position toward server position
        const smoothing = 0.9;
        this.renderX += (this.x - this.renderX) * smoothing;
        this.renderY += (this.y - this.renderY) * smoothing;

        const drawX = this.renderX;
        const drawY = this.renderY;

        // determine color
        const color = this.userId === window.userId ? "lightgreen" : "red";
        ctx.fillStyle = color;
        ctx.fillRect(drawX, drawY, size, size);

        // draw player's display name
        ctx.fillStyle = "black";
        ctx.font = ctx.font || "14px Arial"; // use current font if set, or default
        ctx.textAlign = "center";
        ctx.fillText(this.displayName, drawX + (size / 2), drawY - 5);

        const icon = getUserIcon(this.userId);
        if (icon && icon.complete && icon.naturalWidth > 0) {
            const iconSize = size * 0.8;
            const offset = (size - iconSize) / 2;
            ctx.drawImage(icon, drawX + offset, drawY + offset, iconSize, iconSize);
        }
    }
}