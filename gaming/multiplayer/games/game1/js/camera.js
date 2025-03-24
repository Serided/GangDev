// camera.js
export function lerp(a, b, t) {
    return a + (b - a) * t;
}

export const camera = {
    x: 0,
    y: 0,
    zoom: 1,
    smoothingFactor: 0.1,
    update(player, canvas) {
        const worldWidth = canvas.width / window.tileSize;
        const worldHeight = canvas.height / window.tileSize;
        const targetX = player.x - worldWidth / 2;
        const targetY = player.y - worldHeight / 2;
        this.x = lerp(this.x, targetX, this.smoothingFactor);
        this.y = lerp(this.y, targetY, this.smoothingFactor);
    }
};
window.camera = camera;
