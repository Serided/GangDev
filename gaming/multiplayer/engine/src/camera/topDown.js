export function lerp(a, b, t) {
    return a + (b - a) * t;
}

export const camera = {
    x: 0,
    y: 0,
    zoom: 1,
    smoothingFactor: 0.01,
    /**
     * Update the camera so that it smoothly follows the player.
     * @param {Player} player - The player instance to follow.
     * @param {HTMLCanvasElement} canvas - The canvas element.
     */
    update(player, canvas) {
        const targetX = (player.x + window.scaling) - canvas.width / 2 / this.zoom;
        const targetY = (player.y + window.scaling) - canvas.height / 2 / this.zoom;
        this.x = lerp(this.x, targetX, this.smoothingFactor);
        this.y = lerp(this.y, targetY, this.smoothingFactor);
    }
};
window.camera = camera;