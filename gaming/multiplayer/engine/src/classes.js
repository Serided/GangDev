import { getUserIcon } from "./render/imageCache.js";

export class Player {
    /**
     * Creates a new Player instance.
     *
     * @param {string|number} userId - The player's unique identifier.
     * @param {string} username - The player's username.
     * @param {string} displayName - The player's display name.
     * @param {number} [x=0] - The player's initial x-coordinate.
     * @param {number} [y=0] - The player's initial y-coordinate.
     */
    constructor(userId, username, displayName, x = 0, y = 0) {
        this.userId = userId;
        this.username = username;
        this.displayName = displayName;
        this.x = x;
        this.y = y;
        this.iconUrl = `https://user.gangdev.co/${userId}/icon/user-icon.jpg`;
    }

    /**
     * Updates the player's position.
     *
     * @param {number} newX - The new x-coordinate.
     * @param {number} newY - The new y-coordinate.
     */

    updatePosition(newX, newY) {
        this.x = newX;
        this.y = newY;
    }

    /**
     * Draw the player.
     *
     * @param {CanvasRenderingContext2D} ctx - The drawing context.
     * @param {number} size - The size of the player cube.
     */

    draw(ctx, size = 50) {
        // determine color
        const color = this.userId === window.userId ? "green" : "red";
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, size, size);

        // get font

        // draw player's display name
        ctx.fillStyle = "black";
        ctx.font = ctx.font || "14px Arial"; // use current font if set, or default
        ctx.fillText(this.displayName, this.x, this.y - 5);

        const icon = getUserIcon(this.userId);
        if (icon && icon.complete) {
            const iconSize = size * 0.9;
            const offset = (size - iconSize) / 2;
            ctx.drawImage(icon, this.x + offset, this.y + offset, iconSize, iconSize);
        }
    }
}