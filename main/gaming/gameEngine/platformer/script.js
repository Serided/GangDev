import { gameEngine } from '/gameEngine/script.js';
import { Tools } from '/gameEngine/js/tools.js';
import { Platform } from '/gameEngine/js/classes.js';

const cursor = document.createElement("div")
cursor.classList.add("cursor");
document.body.appendChild(cursor);

const exportButton = document.getElementById("exportButton");
const loadFile = document.getElementById("loadFile");
const clearButton = document.getElementById("clearButton");
const colorButton = document.getElementById("colorButton");

let cycle = 0;
let color = "Gray";

const ctx = gameEngine.canvas.getContext("2d");

let platforms = [];
let undoStack = [];

let snapToGrid = true;
let gridSize = 10;
let isDrawing = false;
let isDeleting = false;
let startX = 0;
let startY = 0;
let previewBox = null;

Tools.setupMouseListeners(gameEngine.canvas)

// redraw platforms
function redrawPlatforms() {
    ctx.clearRect(0, 0, gameEngine.canvas.width, gameEngine.canvas.height);
    platforms.forEach((platform) => platform.draw(ctx));
}

// draw preview
function drawPreviewBox(startX, startY, mouse, color) {
    let width = mouse.x - startX
    let height = mouse.y - startY

    // apply snap to grid if enabled
    if (snapToGrid) {
        width = Math.floor(width / gridSize) * gridSize;
        height = Math.floor(height / gridSize) * gridSize;
    }

    ctx.fillStyle = color;
    ctx.fillRect(startX, startY, width, height);

    // ensure returns object
    return { width: width || 0, height: height || 0};
}

Tools.addMouseMoveListener((mouse) => {
    const { x, y } = mouse;
    cursor.style.left = `${x}px`;
    cursor.style.top = `${y}px`;

    if (isDrawing) {
        redrawPlatforms();
        drawPreviewBox(startX, startY, mouse, "rgba(0, 100, 100, 0.1)")
    }
    if (isDeleting) {
        redrawPlatforms();
        drawPreviewBox(startX, startY, mouse, "rgba(100, 0, 100, 0.1)")
    }
});

gameEngine.canvas.addEventListener("mousedown", (event) => {
    // get current mouse pos on down
    const { x, y } = Tools.getMouseState();
    startX = x;
    startY = y;

    if (snapToGrid) {
        startX = Math.floor(startX / gridSize) * gridSize;
        startY = Math.floor(startY / gridSize) * gridSize;
    }

    // right click deletion
    if (event.button === 2) {
        isDeleting = true; // start delete drag
    } else {
        isDrawing = true; // start draw drag
    }
});

gameEngine.canvas.addEventListener("mouseup", () => {
    const { x, y } = Tools.getMouseState();


    if (isDrawing) {
        isDrawing = false;

        let { width, height } = drawPreviewBox(startX, startY, { x, y }, "rgba(0, 100, 100, 0.1)")

        if (snapToGrid) {
            width = Math.floor(width / gridSize) * gridSize;
            height = Math.floor(height / gridSize) * gridSize;
        }

        if (width !== 0 && height !== 0) { // build platform in green box
            const platform = new Platform(startX, startY, width, height, 0, color);
            platforms.push(platform);
            undoStack.push({ action: "add", platform });
        }
    }

    if (isDeleting) {
        isDeleting = false;

        let { width, height } = drawPreviewBox(startX, startY, { x, y }, "rgba(100, 0, 100, 0.1)")

        if (snapToGrid) {
            width = Math.floor(width / gridSize) * gridSize;
            height = Math.floor(height / gridSize) * gridSize;
        }

        if (width !== 0 && height !== 0) { // delete platforms in red box
            const platformsToDelete = platforms.filter((platform) => {
                return (
                    platform.x + platform.width > startX &&
                    platform.x < startX + width &&
                    platform.y + platform.height > startY &&
                    platform.y < startY + height
                );
            });

            if (platformsToDelete.length > 0) {
                undoStack.push({ action: "multi-delete", platformsDeleted: [...platformsToDelete] }) // add to undo before deletion
                platforms = platforms.filter((platform) => !platformsToDelete.includes(platform)) // filter out platforms to delete
            }
        }
    }

    redrawPlatforms();
});

// disable context menu from right click
gameEngine.canvas.addEventListener("contextmenu", (e) => e.preventDefault());

function exportPlatforms() {
    const json = JSON.stringify(platforms, null, 2);
    const blob = new Blob([json], {type: "application/json"});

    // temporary anchor element to trigger download
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = "platforms.json";
    a.click();

    // clean up by revoking url
    URL.revokeObjectURL(a.href);

    console.log("Exported Platforms:", json);
}

function manageColor() {
    colorButton.innerHTML = color;
    colorButton.style.color = `${color}`;
    cursor.style.backgroundColor = `${color}`;
    if (color === "Transparent") {
        color = "Gray"
        colorButton.innerHTML = "Color";
        colorButton.style.color = `Black`;
    }
}

function cycleColors() {
    if (cycle === 0) {
        color = "Yellow";
    } else if (cycle === 1) {
        color = "Red";
    } else if (cycle === 2) {
        color = "Lime";
    } else if (cycle === 3) {
        color = "Aqua";
    } else if (cycle === 4) {
        color = "Transparent";
        cycle = -1;
    }
    manageColor();
    cycle++;
}

// export platforms to json
exportButton.addEventListener("click", () => {
    exportPlatforms()
});

// load platforms from json
loadFile.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try  {
            const data = JSON.parse(e.target.result);
            platforms = data.map((p) => new Platform(p.x, p.y, p.width, p.height, p.angle, p.color));
            undoStack = [];
            redrawPlatforms();
        } catch (error) {
            console.error("Invalid JSON file:", error);
        }
    };
    reader.readAsText(file);
});

// clear all platforms
clearButton.addEventListener("click", () => {
    undoStack = [];

    if (platforms.length > 0) {
        undoStack.push({ action: "clear", platformsCleared: [...platforms] });
    }

    platforms = [];
    redrawPlatforms();
});

colorButton.addEventListener("click", cycleColors)

// key combinations for undo and export
document.addEventListener("keydown", (e) => {
    if (e.ctrlKey) {
        e.preventDefault() // prevent ctrl key actions
        if (e.key === "z") {
            if (undoStack.length > 0) {
                const lastAction = undoStack.pop();
                if (lastAction.action === "add") { // undo add
                    platforms.pop();
                } else if (lastAction.action === "delete") { // restore delete
                    platforms.push(lastAction.platform);
                } else if (lastAction.action === "multi-delete") { // restore multi--delete
                    platforms.push(...lastAction.platformsDeleted);
                } else if (lastAction.action === "clear") { // restore clear
                    platforms = [...lastAction.platformsCleared];
                }

                redrawPlatforms();
            }
        }
        if (e.key === "s") exportPlatforms();
        if (e.key === "c") {};
        if (e.key === "v") {};
    }
    if (e.key === " ") cycleColors();
})

window.addEventListener("resize", redrawPlatforms);
window.addEventListener("focus", redrawPlatforms);

document.addEventListener("DOMContentLoaded", () => {
    const engineInputs = document.getElementById('engineInputs');

    let isButtonVisible = true;

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();

            isButtonVisible = !isButtonVisible;
            if (isButtonVisible) {
                engineInputs.classList.add('visible');
                engineInputs.classList.remove('hidden');
            } else {
                engineInputs.classList.add('hidden');
                engineInputs.classList.remove('visible');
            }
        }
    })
})