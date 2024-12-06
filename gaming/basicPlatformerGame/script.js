import { gameEngine } from '/gameEngine/script.js';
import { Tools } from '/gameEngine/js/tools.js';
import { Platform, Player } from '/gameEngine/js/classes.js';

Tools.setupKeyboardListeners();

const player = new Player(gameEngine.canvas.width / 2, gameEngine.canvas.height - 30, 30, 30, "red");
const base = new Platform(0, gameEngine.canvas.height - 20, gameEngine.canvas.width, 20)
gameEngine.addObject(base)

gameEngine.loadPlatforms('json/platforms.json').then(() => {
    gameEngine.start()
    gameEngine.addObject(player)
})
