export const topDownInput = (() => {
    const keys = {};
    const baseSpeed = 20;

    function setupKeyboardListeners() {
        window.addEventListener("keydown", keyDownHandler);
        window.addEventListener("keyup", keyUpHandler);

    }

    function keyDownHandler(event) {
        const key = event.key.toLowerCase();
        if (["w", "a", "s", "d"].includes(key)) {
            if (event.ctrlKey) event.preventDefault();
            keys[event.key] = true;
        }
        if (event.key === "Control" || event.key === "Shift") {
            keys[event.key] = true;
            event.preventDefault();
        }
    }

    function keyUpHandler(event) {
        const key = event.key.toLowerCase();
        if (["w", "a", "s", "d"].includes(key)) {
            keys[event.key] = false;
        }
        if (event.key === "Control" || event.key === "Shift") {
            keys[event.key] = false;
        }
    }

    function getEffectiveSpeed() {
        let multiplier = 1;
        if (keys["Control"]) multiplier *= 1.5;
        if (keys["Shift"]) multiplier *= 0.5;
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
