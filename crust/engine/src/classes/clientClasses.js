import { getUserIcon } from "../render/imageCache.js";

export class Player {
    constructor(userId, username, displayName, x = 0, y = 0) {
        this.userId = userId;
        this.username = username;
        this.displayName = displayName;

        // authoritative server position
        this.x = x;
        this.y = y;

        // previous server position (needed for smoothed transitions)
        this.prevX = x;
        this.prevY = y;

        // smoothed render position
        this.renderX = x;
        this.renderY = y;

        this.lastUpdateTime = performance.now();
        this.iconUrl = `https://user.gangdev.co/${userId}/icon/user-icon.jpg`;
    }

    updatePosition(newX, newY) {
        // keep old server position for snapshot interpolation
        this.prevX = this.x;
        this.prevY = this.y;

        // new server authoritative position
        this.x = newX;
        this.y = newY;

        // mark time of update
        this.lastUpdateTime = performance.now();
    }

    draw(ctx, size = (window.player)) {
        // how long since the last update?
        const now = performance.now();
        const tickMs = 1000 / 60; // matches server tickrate
        let t = (now - this.lastUpdateTime) / tickMs;

        if (t < 0) t = 0;
        if (t > 1) t = 1;

        // snapshot interpolation (prev → current)
        const targetX = this.prevX + (this.x - this.prevX) * t;
        const targetY = this.prevY + (this.y - this.prevY) * t;

        // additional smoothing layer (but much stronger visibility)
        const smoothing = 0.25;
        this.renderX += (targetX - this.renderX) * smoothing;
        this.renderY += (targetY - this.renderY) * smoothing;

        const drawX = this.renderX;
        const drawY = this.renderY;

        // determine color
        const color = this.userId === window.userId ? "lightgreen" : "red";
        ctx.fillStyle = color;
        ctx.fillRect(drawX, drawY, size, size);

        // draw player's display name
        ctx.fillStyle = "black";
        ctx.font = ctx.font || "14px Arial";
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
