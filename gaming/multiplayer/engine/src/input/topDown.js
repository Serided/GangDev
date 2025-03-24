export const topDownInput = (() => {
    const keys = {};

    function setupInputListeners() {
        window.addEventListener("keydown", keyDownHandler);
        window.addEventListener("keyup", keyUpHandler);
        window.addEventListener("wheel", (event) => {
            event.preventDefault();
            camera.zoom += (event.deltaY > 0 ? -0.1 : 0.1);
            if (camera.zoom < 0.5) camera.zoom = 0.5;
            if (camera.zoom > 1.5) camera.zoom = 1.5;
        }, { passive: false });
    }

    function keyDownHandler(event) {
        const key = event.key.toLowerCase();
        if (
            ["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)
        ) {
            keys[key] = true;
        }
    }

    function keyUpHandler(event) {
        const key = event.key.toLowerCase();
        if (
            ["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)
        ) {
            keys[key] = false;
        }
    }

    /**
     * Computes the movement vector based on current key states.
     * @param {number} deltaTime - Time elapsed since last frame in seconds.
     * @returns {{dx: number, dy: number}} Movement vector.
     */
    function getMovementVector(deltaTime) {
        let dx = 0;
        let dy = 0;
        const speed = (8 * window.scaling); // No modifiers applied

        if (keys["w"]) dy -= speed;
        if (keys["s"]) dy += speed;
        if (keys["a"]) dx -= speed;
        if (keys["d"]) dx += speed;
        if (keys["arrowup"]) dy -= speed;
        if (keys["arrowdown"]) dy += speed;
        if (keys["arrowleft"]) dx -= speed;
        if (keys["arrowright"]) dx += speed;

        // If moving diagonally, normalize the vector so that diagonal movement isn't faster.
        if (dx !== 0 && dy !== 0) {
            const factor = 1 / Math.sqrt(2);
            dx *= factor;
            dy *= factor;
        }

        // Multiply by deltaTime to get movement in units for this frame.
        return { dx: dx * deltaTime, dy: dy * deltaTime };
    }

    return {
        setupInputListeners,
        getMovementVector
    };
})();