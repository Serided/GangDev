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
            cleanupPlatforms();
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

    // generate platforms using seed
    function generatedPlatformsInArea(xStart, xEnd, yStart, yEnd) {
        const density = 1.0; // chance of platform per unit area
        const minGap = 0;
        const cluster = {x: xStart, y: yStart, min: 1, max: 10, spacing: 300};
        console.log("generating")

        while (cluster.x < xEnd) {
            const clusterWidth = Tools.seededRandom().random() * (xEnd - cluster.x) * 0.5;
            const clusterHeight = Tools.seededRandom().random() * (yEnd - cluster.y) * 0.5;

            let platformsInCluster = Math.floor(Tools.seededRandom().random() * (cluster.max - cluster.min + 1)) + cluster.min;
            console.log(Tools.seededRandom().random());

            for (let i = 0; i < platformsInCluster; i++) {
                if (Tools.seededRandom().random() < density) {
                    const width = 100 + Tools.seededRandom().random() * 20;
                    const height = 20 + Tools.seededRandom().random() * 20;

                    let xPos = cluster.x + Tools.seededRandom().random() * clusterWidth;
                    let yPos = cluster.y + Tools.seededRandom().random() * clusterHeight;

                    while (objects.some(platform => {
                        return (
                            xPos < platform.x + platform.width + minGap &&
                            xPos + width > platform.x - minGap &&
                            yPos < platform.y + platform.height + minGap &&
                            yPos + height > platform.y - minGap
                        );
                    })) {
                        xPos = cluster.x + Tools.seededRandom().random() * clusterWidth;
                        yPos = cluster.y + Tools.seededRandom().random() * clusterHeight;
                    }

                    const platform = new Platform(xPos, yPos, width, height, 0, "yellow");
                    gameEngine.addObject(platform);
                }
            }

            cluster.x += clusterWidth + cluster.spacing;
            cluster.y += clusterHeight + cluster.spacing
        }
    }

    function cleanupPlatforms() {
        gameEngine.objects = gameEngine.objects.filter(obj => {
            if (obj.isPlatform) {
                const isVisible =
                    obj.x + obj.width > 0 &&
                    obj.x < gameEngine.canvas.width &&
                    obj.y + obj.height > 0 &&
                    obj.y < gameEngine.canvas.height;
                return isVisible || obj.dynamic;
            }
            return true;
        });
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
        generatedPlatformsInArea,
        cleanupPlatforms,
        canvas, objects
    };
})();