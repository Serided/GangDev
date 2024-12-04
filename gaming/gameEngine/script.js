const gameEngine = (() => {
    // array to track game objects
    const objects = [];
    let lastUpdateTime = 0;
    let gameLoopId = null; // variable to store the game loop ID

    // start the game loop
    function start(canvas) {
        const ctx = canvas.getContext("2d");

        function gameLoop(timestamp) {
            const deltaTime = (timestamp - lastUpdateTime) / 1000; // seconds since last frame
            lastUpdateTime = timestamp;

            ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas
            update(deltaTime); // update all objects
            draw(ctx); // draw all objects

            gameLoopId = requestAnimationFrame(gameLoop); // request next frame
        }

        gameLoopId = requestAnimationFrame(gameLoop) // kick off the loop
    }

    // add new game object
    function addObject(object) {
        if (object.update && object.draw) {
            objects.push(object);
        } else {
            console.error("Object must have `update` and `draw` methods.");
        }
    }

    // remove game object
    function removeObject(object) {
        const index = objects.indexOf(object);
        if (index > -1) {
            objects.splice(index, 1);
        }
    }

    // universal update function
    function update(deltaTime) {
        objects.forEach((obj) => {
            if (obj === ball) {
                obj.update(deltaTime, paddle);
            } else {
                obj.update(deltaTime);
            }
        });
    }

    // universal draw function
    function draw(ctx) {
        objects.forEach((obj) => obj.draw(ctx));
    }

    // stop the game loop
    function stop() {
        if (gameLoopId) {
            cancelAnimationFrame(gameLoopId);
            gameLoopId = null;
        }
    }

    // public API
    return {
        addObject,
        removeObject,
        start,
        stop
    };
})();