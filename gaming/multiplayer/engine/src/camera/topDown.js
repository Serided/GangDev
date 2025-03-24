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
        const targetX = player.x + playerSize / 2;
        const targetY = player.y + playerSize / 2;
        this.x = lerp(this.x, targetX, this.smoothFactor); // move camera to player center x
        this.y = lerp(this.y, targetY, this.smoothFactor); // move camera to player center y
        this.zoom = lerp(this.zoom, this.targetZoom, this.smoothFactor);
    },
    setZoom(newZoom) {
        this.targetZoom = Math.max(0.5, Math.min(newZoom, 1.5))
    }
};
window.camera = camera;