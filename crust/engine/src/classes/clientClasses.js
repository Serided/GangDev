import { getUserIcon } from "../render/imageCache.js";

export class Player {
    constructor(userId, username, displayName, x = 0, y = 0) {
        this.userId = userId;
        this.username = username;
        this.displayName = displayName;
        this.x = x;
        this.y = y;
        this.iconUrl = `https://user.gangdev.co/${userId}/icon/user-icon.jpg`;
    }

    updatePosition(newX, newY) {
        this.x = newX;
        this.y = newY;
    }

    draw(ctx, size = (window.player)) {
        // determine color
        const color = this.userId === window.userId ? "lightgreen" : "red";
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, size, size);

        // get font

        // draw player's display name
        ctx.fillStyle = "black";
        ctx.font = ctx.font || "14px Arial"; // use current font if set, or default
        ctx.textAlign = "center";
        ctx.fillText(this.displayName, this.x + (size / 2), this.y - 5);

        const icon = getUserIcon(this.userId);
        if (icon && icon.complete && icon.naturalWidth > 0) {
            const iconSize = size * 0.8;
            const offset = (size - iconSize) / 2;
            ctx.drawImage(icon, this.x + offset, this.y + offset, iconSize, iconSize);
        }
    }
}