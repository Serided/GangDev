const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d");

// character properties
let character = {
    x: 0,
    y: canvas.height - 40,
    width: 40,
    height: 40,
    color: "red",
    velocityY: 0,
    gravity: 0.01,
    jumpStrength: -10,
    isOnGround: true
};

const keys = {
    a: false,
    d: false,
    w: false
};

function update() {
    // gravity
    if (!character.isOnGround) {
        character.velocityY += character.gravity
    }

    // position
    character.y += character.velocityY;

    // ground collision
    if (character.y >= canvas.height - character.height) {
        character.y = canvas.height - character.height;
        character.velocityY = 0;
        character.isOnGround = true;
    } else {
        character.isOnGround = false;
    }

    // horizontal movement
    if (keys.a) {
        character.x -= 5;
    }
    if (keys.d) {
        character.x += 5;
    }

    character.x = Math.max(0, Math.min(canvas.width - character.width, character.x));
}

function draw() {
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // draw character
    ctx.fillStyle = character.color;
    ctx.fillRect(character.x, character.y, character.width, character.height);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (event) => {
    if (event.key === "A") keys.a = true;
    if (event.key === "D") keys.d = true;
    if (event.key === "W" && character.isOnGround) {
        character.velocityY = character.jumpStrength;
        character.isOnGround = false;
    }
})

document.addEventListener("keyup", (event) => {
    if (event.key === "A") keys.a = false;
    if (event.key === "D") keys.d = false;
})

function getGravity() {
    let gValue = document.getElementById("gInput").value;

    if (isNaN(gValue) || gValue === "") {
        gValue = 10;
    } else {
        gValue = parseFloat(gValue)
    }

    document.getElementById("gResult").textContent = `Gravity = ${gValue}`
}

function getSpeed() {
    let sValue = document.getElementById("sInput").value;

    if (isNaN(sValue) || sValue === "") {
        sValue = 1;
    } else {
        sValue = parseFloat(sValue)
    }

    document.getElementById("sResult").textContent = `Speed = ${sValue}`
}

gameLoop()