export function lerp(a, b, t) {
    return a + (b - a) * t;
}

export const camera = {
    x: 0,
    y: 0,
    zoom: 1,
    targetZoom: 1,
    smoothFactor: 0.02,
    /**
     * Update the camera so that it smoothly follows the player.
     * @param {Player} player - The player instance to follow.
     * @param {HTMLCanvasElement} canvas - The canvas element.
     */
    update(player, canvas) {
        const targetX = (player.x + window.scaling) - canvas.width / 2 / this.zoom;
        const targetY = (player.y + window.scaling) - canvas.height / 2 / this.zoom;
        this.x = lerp(this.x, player.x, this.smoothFactor);
        this.y = lerp(this.y, player.y, this.smoothFactor);
        this.zoom = lerp(this.zoom, this.targetZoom, this.smoothFactor);
    },
    setZoom(newZoom) {
        this.targetZoom = Math.max(0.5, Math.min(newZoom, 1.5))
    }
};
window.camera = camera;