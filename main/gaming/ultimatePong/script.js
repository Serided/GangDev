import { gameEngine } from '/gameEngine/script.js';
import { Tools } from '/gameEngine/js/tools.js';
import { Ball, Paddle } from '/gameEngine/js/classes.js';

// setup event listeners
Tools.setupKeyboardListeners();
Tools.setupMouseListeners(gameEngine.canvas);

// create game objects and logic
const paddle = new Paddle(0, gameEngine.canvas.height, 100, 5, "white");
gameEngine.addObject(paddle);

const ball = new Ball(gameEngine.canvas.width / 2, gameEngine.canvas.height / 2, 10, "red");
gameEngine.addObject(ball);

// register mouse move listener
Tools.addMouseMoveListener((mouseState) => {
    // use mouse position to move paddle
    const rect = gameEngine.canvas.getBoundingClientRect();

    const mouseX = (mouseState.x - rect.left) * (gameEngine.canvas.width / rect.width);
    // const mouseY = (mouseState.y - rect.top) * (gameEngine.canvas.height / rect.height);

    paddle.x = Math.max(0, Math.min((gameEngine.canvas.width - paddle.width), mouseX - (paddle.width / 2)));
    // paddle.y = Math.max(0, Math.min((gameEngine.canvas.height - paddle.height), mouseY - (paddle.height / 2)));
})

gameEngine.start(gameEngine.canvas);
// Tools.cleanupListeners(canvas);

