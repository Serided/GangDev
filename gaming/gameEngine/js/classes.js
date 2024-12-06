import { gameEngine } from '/gameEngine/script.js'
import { Tools } from '/gameEngine/js/tools.js'

// player and platform creation
export class Player {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speedX = 0;
        this.speedY = 0;
        this.isOnGround = false;
    }

    update(deltaTime) {
        const gravity = 600;
        const moveSpeed = 300;
        const jumpSpeed = -400;

        // horizontal movement
        if (this.isOnGround) {
            if (Tools.isKeyPressed("ArrowLeft") || Tools.isKeyPressed("a")) {
                this.speedX = -moveSpeed;
            } else if (Tools.isKeyPressed("ArrowRight") || Tools.isKeyPressed("d")) {
                this.speedX = moveSpeed;
            } else {
                this.speedX = 0;
            }
        } else {
            if (Tools.isKeyPressed("ArrowLeft") || Tools.isKeyPressed("a")) {
                this.speedX = -moveSpeed / 2;
            } else if (Tools.isKeyPressed("ArrowRight") || Tools.isKeyPressed("d")) {
                this.speedX = moveSpeed / 2;
            } else {
                this.speedX = 0;
            }
        }

        // vertical movement
        if ((Tools.isKeyPressed("w") || Tools.isKeyPressed("UpArrow")) && this.isOnGround) {
            this.speedY = jumpSpeed;
            this.isOnGround = false;
        }

        // gravity
        this.speedY += gravity * deltaTime;

        // update position
        this.x += this.speedX * deltaTime;
        this.y += this.speedY * deltaTime;

        // collision
        gameEngine.detectCollisions(this, gameEngine.objects);
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

export class Platform {
    constructor(x, y, width, height, angle = 0, color = "green") {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.angle = angle;
        this.color = color;
        this.isPlatform = true;
    }

    update() {}

    draw(ctx) {
        /*
        const sin = Math.sin(this.angle);
        const cos = Math.cos(this.angle);

        // calculate the four corners of the box
        const halfWidth = this.width / 2;
        const halfHeight = this.height / 2;

        const corners = [
            { x: this.x + halfWidth * cos - halfHeight * sin, y: this.y + halfWidth * sin + halfHeight * cos},
            { x: this.x - halfWidth * cos - halfHeight * sin, y: this.y - halfWidth * sin + halfHeight * cos},
            { x: this.x - halfWidth * cos + halfHeight * sin, y: this.y - halfWidth * sin - halfHeight * cos},
            { x: this.x + halfWidth * cos + halfHeight * sin, y: this.y + halfWidth * sin - halfHeight * cos}
        ]

        // actually draw it now lol
        ctx.beginPath();
        ctx.moveTo(corners[0].x, corners[0].y);
        corners.forEach(corner => ctx.lineTo(corner.x, corner.y));
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
        */
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

// ball class
export class Ball {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.defdx = 500;
        this.defdy = 500;
        this.dx = this.defdx;
        this.dy = this.defdy;
        this.bounce = 0.9;
    }

    update(deltaTime, paddle) {
        this.x += this.dx * deltaTime;
        this.y += this.dy * deltaTime;

        // sides collision
        if (this.x - this.radius < 0 || this.x + this.radius > gameEngine.canvas.width) {
            this.dx *= -this.bounce;
            this.x = Math.max(this.radius, Math.min(this.x, gameEngine.canvas.width - this.radius))
        }

        // top collision
        if (this.y - this.radius < 0) {
            this.dy *= -this.bounce;
            this.y = Math.max(this.radius, Math.min(this.y, gameEngine.canvas.height - this.radius))
        }

        // bottom collision
        if (this.y - this.radius >gameEngine.canvas.height) {
            console.log("ball missed");
            // reset ball and handle gg logic
            this.x = gameEngine.canvas.width / 2;
            this.y = gameEngine.canvas.height / 2;
            this.dx = this.defdx * (Math.random() > 0.5 ? 1 : -1); // randomize direction
            this.dy = -this.defdx;
        }

        // paddle collision
        if (
            (this.y + this.radius) >= paddle.y && // ball hits paddle level
            this.x >= paddle.x && // ball is in paddles left edge
            this.x <= (paddle.x + paddle.width) // ball is in paddles right edge
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
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}

// paddle class
export class Paddle {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = 0;
    }

    update(deltaTime) {
        this.x += this.speed * deltaTime;
        // keep paddle in canvas
        this.x = Math.max(0, Math.min(gameEngine.canvas.width - this.width, this.x))
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y - this.height, this.width, this.height, this.color);
    }
}