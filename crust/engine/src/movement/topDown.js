/**
 * Computes the movement vector based on the current key states.
 * @param {number} deltaTime - Time elapsed since the last frame (in seconds).
 * @param {Object} keys - An object mapping keys to booleans.
 * @param {number} speed - The base speed in units per second.
 * @returns {{dx: number, dy: number}} The computed movement vector.
 */

export function getMovementVector(deltaTime, keys, speed = (8 * window.scaling)) {
    let dx = 0;
    let dy = 0;

    if (keys["w"] || keys["arrowup"]) dy -= speed;
    if (keys["s"] || keys["arrowdown"]) dy += speed;
    if (keys["a"] || keys["arrowleft"]) dx -= speed;
    if (keys["d"] || keys["arrowright"]) dx += speed;

    // If moving diagonally, normalize the vector so that diagonal movement isn't faster.
    if (dx !== 0 && dy !== 0) {
        const factor = 1 / Math.sqrt(2);
        dx *= factor;
        dy *= factor;
    }

    // Multiply by deltaTime to get movement in units for this frame.
    return { dx: dx * deltaTime, dy: dy * deltaTime };
}