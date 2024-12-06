import { Ball, Paddle, Platform } from "/gameEngine/js/classes.js";
import { Tools } from "/gameEngine/js/tools.js";

export const gameEngine = (() => {
    // array to track game objects
    const objects = [];
    let lastUpdateTime = 0;
    let gameLoopId = null; // variable to store the game loop ID

    function createCanvas () {
        const canvas = document.getElementById("game");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        return canvas
    }

    const canvas = createCanvas()
    const ctx = canvas.getContext("2d")
    addEventListener('resize', createCanvas)

    // start the game loop
    function start() {
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
        let ball;
        let paddle;

        objects.forEach(obj => {
            if (obj instanceof Ball) {
                ball = obj;
            }
            if (obj instanceof Paddle) {
                paddle = obj;
            }
        })

        objects.forEach((obj) => {
            if (obj === ball) {
                obj.update(deltaTime, paddle);
            } else {
                obj.update(deltaTime)
            }
        });
    }

    // universal draw function
    function draw(ctx) {
        objects.forEach((obj) => obj.draw(ctx));
    }

    // load platforms from json
    async function loadPlatforms(url) {
        const response = await fetch(url);
        const platformsData = await response.json();

        // generate and add
        platformsData.forEach(platformData => {
            const platform = new Platform(platformData.x, platformData.y, platformData.width, platformData.height, platformData.angle, platformData.color);
            addObject(platform)
        })
    }

    // stop the game loop
    function stop() {
        if (gameLoopId) {
            cancelAnimationFrame(gameLoopId);
            gameLoopId = null;
        }
    }

    // detect collision
    function detectCollisions(player, objects) {
        player.isOnGround = false;

        // check collisions for objects
        objects.forEach(obj => {
            if (obj !== player && obj.isPlatform) {
                const collidingHorizontally = player.x + player.width > obj.x && player.x < obj.x + obj.width;
                const collidingVertically = player.y + player.height > obj.y && player.y < obj.y + obj.height;

                if (collidingHorizontally && collidingVertically) {
                    // align player to top of platform
                    player.y = obj.y - player.height;
                    player.speedY = 0;
                    player.isOnGround = true;
                }
            }
        });

        if (player.y > canvas.height) {
            handlePlayerFallOut(player)
        }
    }

    function handlePlayerFallOut(player) {
        // reset player position
        player.x = canvas.width / 2;
        player.y = 0;
        player.speedY = 0;

        // add extra logic
    }


    // public API
    return {
        addObject,
        removeObject,
        start,
        stop,
        detectCollisions,
        createCanvas,
        loadPlatforms,
        canvas, objects
    };
})();