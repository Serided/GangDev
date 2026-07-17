import { lerp } from '../tools.js'

export const camera = {
    x: 0,
    y: 0,
    zoom: 1,
    targetZoom: 1,
    smoothFactor: 0.015,
    update(player) {
        const targetX = player.x + window.player / 2;
        const targetY = player.y + window.player / 2;
        this.x = lerp(this.x, targetX, this.smoothFactor); // move camera to player center x
        this.y = lerp(this.y, targetY, this.smoothFactor); // move camera to player center y
        this.zoom = lerp(this.zoom, this.targetZoom, this.smoothFactor);
    },
    setZoom(newZoom) {
        this.targetZoom = Math.max(0.5, Math.min(newZoom, 1.5))
    }
};
window.camera = camera;