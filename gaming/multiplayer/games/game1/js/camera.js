export function lerp(a, b, t) {
    return a + (b - a) * t;
}

export const camera = {
    x: 0,
    y: 0,
    zoom: 1,
    smoothingFactor: 0.1,
    update(player, canvas) {
    }
};
