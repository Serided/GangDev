export function lerp(a, b, t) {
    return a + (b - a) * t;
}

export const camera = {
    x: 0,
    y: 0,
    zoom: 1,
    smoothingFactor: 0.02,
    update(player, canvas) {
        const targetX = player.x - (canvas.width / (2 * this.zoom));
        const targetY = player.y - (canvas.height / (2 * this.zoom));
        this.x = lerp(this.x, targetX, this.smoothingFactor);
        this.y = lerp(this.y, targetY, this.smoothingFactor);
    }
};