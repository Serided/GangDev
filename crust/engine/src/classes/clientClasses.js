import { getUserIcon } from "../render/imageCache.js";

export class Player {
    constructor(userId, username, displayName, x = 0, y = 0) {
        this.userId = userId;
        this.username = username;
        this.displayName = displayName;

        // server positions
        this.x = x;
        this.y = y;

        // previous server positions (for interpolation)
        this.prevX = x;
        this.prevY = y;

        // when we last got a server update for this player
        this.lastUpdateTime = (performance.now ? performance.now() : Date.now());

        this.iconUrl = `https://user.gangdev.co/${userId}/icon/user-icon.jpg`;
    }

    updatePosition(newX, newY) {
        // store previous server state
        this.prevX = this.x;
        this.prevY = this.y;

        // store new server state
        this.x = newX;
        this.y = newY;

        // timestamp of this snapshot
        this.lastUpdateTime = (performance.now ? performance.now() : Date.now());
    }

    draw(ctx, size = (window.player)) {
        // --- interpolate between prev and current server state ---

        const now = (performance.now ? performance.now() : Date.now());
        const serverTickMs = 1000 / 60; // matches your tickRate = 60

        // how far we are between the last two snapshots (0..1)
        let t = (now - this.lastUpdateTime) / serverTickMs;
        if (t < 0) t = 0;
        if (t > 1) t = 1;

        const drawX = this.prevX + (this.x - this.prevX) * t;
        const drawY = this.prevY + (this.y - this.prevY) * t;

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
