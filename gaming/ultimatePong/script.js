const canvas = document.getElementById("game")

// setup event listeners
Tools.setupKeyboardListeners();
Tools.setupMouseListeners(canvas);

// create paddle
function createPaddle(x, y, width, height, color) {
    return {
        x,
        y,
        width,
        height,
        color,
        speed: 0,

        update(deltaTime) {
            this.x += this.speed * deltaTime;
            // keep paddle in canvas
            this.x = Math.max(0, Math.min(canvas.width - this.width, this.x))
        },

        draw(ctx) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y - this.height, this.width, this.height, this.color);
        }
    }
}

function createBall(x, y, radius, color) {
    return {
        x,
        y,
        radius,
        color,
        dx: 100,
        dy: 100,
        bounce: 0.9,

        update(deltaTime, paddle) {
            this.x += this.dx * deltaTime;
            this.y += this.dy * deltaTime;

            // sides collision
            if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) {
                this.dx *= -this.bounce;
                this.x = Math.max(this.radius, Math.min(this.x, canvas.width - this.radius))
            }

            // top collision
            if (this.y - this.radius < 0) {
                this.dy *= -this.bounce;
                this.y = Math.max(this.radius, Math.min(this.y, canvas.height - this.radius))
            }

            // bottom collision
            if (this.y - this.radius > canvas.height) {
                console.log("ball missed");
                // reset ball and handle gg logic
                this.x = canvas.width / 2;
                this.y = canvas.height / 2;
                this.dx = 100 * (Math.random() > 0.5 ? 1 : -1); // randomize direction
                this.dy = -100;
            }

            // paddle collision
            if (
                this.y + this.radius >= paddle.y && // ball hits paddle level
                this.x >= paddle.x && // ball is in paddles left edge
                this.x <= paddle.x + paddle.width // ball is in paddles right edge
            ) {
                // reverse vertical velocity
                this.dy *= -1;
                this.y = paddle.y - this.radius;

                // base direction on paddle hit location
                const hitPosition = (this.x = paddle.x) / paddle.width; // 0 (left) to 1 (right)
                const bounceAngle = (hitPosition - 0.5) * Math.PI / 3;
                const speed = Math.sqrt(this.dx ** 2 + this.dy ** 2);

                this.dx += speed * Math.sin(bounceAngle);
                this.dy += -speed * Math.cos(bounceAngle); // upward

                // base on paddle speed
                this.dx += paddle.speed * 0.1;
            }
        },

        draw(ctx) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        }
    }
}

// create game objects and logic
const paddle = createPaddle(0, canvas.height, 20, 2, "white");
gameEngine.addObject(paddle);

const ball = createBall(canvas.width / 2, canvas.height / 2, 2, "red");
gameEngine.addObject(ball);

// register mouse move listener
Tools.addMouseMoveListener((mouseState) => {
    // use mouse position to move paddle
    const rect = canvas.getBoundingClientRect();

    const mouseX = (mouseState.x - rect.left) * (canvas.width / rect.width);
    // const mouseY = (mouseState.y - rect.top) * (canvas.height / rect.height);

    paddle.x = Math.max(0, Math.min((canvas.width - paddle.width), mouseX - (paddle.width / 2)));
    // paddle.y = Math.max(0, Math.min((canvas.height - paddle.height), mouseY - (paddle.height / 2)));
})

gameEngine.start(canvas);
// Tools.cleanupListeners(canvas);

