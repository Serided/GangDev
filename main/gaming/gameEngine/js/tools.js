import { gameEngine } from "/gameEngine/script.js";
import {  } from "/gameEngine/js/classes.js";

export const Tools = (() => {
    const keys = {}; // track key states
    let mouse = { x: 0, y: 0, isDown: false }; // track mouse state
    const mouseCallbacks = [];
    const keyCallbacks = [];

    // define event handlers
    let mouseMoveHandler;
    let mouseDownHandler;
    let mouseUpHandler;
    let keyDownHandler;
    let keyUpHandler;

    // setup keyboard listeners
    function setupKeyboardListeners() {
        keyDownHandler = (event) => {
            keys[event.key] = true;
            keyCallbacks.forEach((callback) => callback(event)); // call any registered callback
        };

        keyUpHandler = (event) => {
            keys[event.key] = false;
            keyCallbacks.forEach((callback) => callback(event)); // call any registered callback
        };

        document.addEventListener("keydown", keyDownHandler);
        document.addEventListener("keyup", keyUpHandler);
    }

    // setup mouse listeners
    function setupMouseListeners(canvas) {
        mouseMoveHandler = (event) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = event.clientX - rect.left;
            mouse.y = event.clientY - rect.top;

            mouseCallbacks.forEach((callback) => callback(mouse)); // call any registered callback
        };

        mouseDownHandler = () => {
            mouse.isDown = true;
        };

        mouseUpHandler = () => {
            mouse.isDown = false;
        }

        canvas.addEventListener("mousemove", mouseMoveHandler);
        canvas.addEventListener("mousedown", mouseDownHandler);
        canvas.addEventListener("mouseup", mouseUpHandler);
    }

    // add mouse movement callback
    function addMouseMoveListener(callback) {
        mouseCallbacks.push(callback);
    }

    // add key press callback
    function addKeyPressListener(callback) {
        keyCallbacks.push(callback);
    }

    // get key state
    function isKeyPressed(key) {
        return !!keys[key];
    }

    // get mouse state
    function getMouseState() {
        return { ...mouse };
    }

    // cleanup event listeners
    function cleanupListeners(canvas) {
        document.removeEventListener("keydown", keyDownHandler);
        document.removeEventListener("keyup", keyUpHandler);
        canvas.removeEventListener("mousemove", mouseMoveHandler);
        canvas.removeEventListener("mousedown", mouseDownHandler);
        canvas.removeEventListener("mouseup", mouseUpHandler);
    }

    // random seed
    const seededRandom = (() => {
        let seed = 0;
        return {
            setSeed(s) {
                seed = s;
            },
            random() {
                const m = 2 ** 31 - 1;
                const a = 1103515245;
                const c = 12345;

                seed = (a * seed + c) % m;
                return seed / m;
            },
        };
    });

    // return public API
    return {
        setupKeyboardListeners,
        setupMouseListeners,
        addMouseMoveListener,
        addKeyPressListener,
        isKeyPressed,
        getMouseState,
        cleanupListeners,
        seededRandom
    }
})();