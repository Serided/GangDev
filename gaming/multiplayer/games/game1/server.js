const GameServer = require('../shared/gameServerTemplate');

const gameInfo = {
    name: "Game1",
    path: "/game1",
    port: 10001
};

const game1 = new GameServer(gameInfo);