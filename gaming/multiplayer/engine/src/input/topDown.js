export const topDownInput = (() => {
    const keys = {};
    const baseSpeed = 100;

    function setupKeyboardListeners() {
        window.addEventListener("keydown", keyDownHandler);
        window.addEventListener("keyup", keyUpHandler);

    }

    function keyDownHandler(event) {
        const key = event.key.toLowerCase();
        if (["w", "a", "s", "d"].includes(key)) {
            if (event.ctrlKey) {
                event.preventDefault();
                event.stopPropagation();
            }
            keys[key] = true;
        }
        if (key === "control" || key === "shift") {
            keys[key] = true;
            event.preventDefault();
            event.stopPropagation();
        }
    }

    function keyUpHandler(event) {
        const key = event.key.toLowerCase();
        if (["w", "a", "s", "d", "control", "shift"].includes(key)) {
            keys[event.key] = false;
        }
    }

    function getEffectiveSpeed() {
        let multiplier = 1;
        if (keys["control"]) multiplier *= 1.5;
        if (keys["shift"]) multiplier *= 0.5;
        return baseSpeed * multiplier;
    }

    function getMovementVector(deltaTime) {
        let dx = 0;
        let dy = 0;
        const speed = getEffectiveSpeed();
        if (keys["w"] || keys["W"]) dy -= speed * deltaTime;
        if (keys["s"] || keys["S"]) dy += speed * deltaTime;
        if (keys["a"] || keys["A"]) dx -= speed * deltaTime;
        if (keys["d"] || keys["D"]) dx += speed * deltaTime;
        return { dx, dy };
    }

    return {
        setupKeyboardListeners,
        getMovementVector
    };
})();
