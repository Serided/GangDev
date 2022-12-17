const gameScreen = document.getElementById('gameScreen')
const bgColor = '#2F2F30'
const snakeColor = '#c2c2c2'
const foodColor = '#DB0B03'

const socket = io('http://localhost:3000');

socket.on('init', handleInit)

let canvas, ctx;

const gameState = {
  player: {
    pos: {
      x: 3,
      y: 10,
    },
    vel: {
      x: 1,
      y: 0,
    },
    snake: [
      {x: 1, y: 10},
      {x: 2, y: 10},
      {x: 3, y: 10},
    ],
  },
  food: {
    x: 7,
    y: 7,
  },
  gridSize: 20,
};

function init(){
  canvas = document.getElementById('canvas')
  ctx = canvas.getContext('2d')

  canvas.width = canvas.height = 600

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  document.addEventListener('keydown', keydown);
}

function keydown(e) {
  console.log(e.keyCode)
}

init();

function paintGame(state){
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const food = state.food;
  const gridSize = state.gridSize;
  const size = canvas.width / gridSize

  ctx.fillStyle = foodColor
  ctx.fillRect(food.x * size, food.y * size, size, size)

  paintPlayer(state.player, size, snakeColor)
}

function paintPlayer(playerState, size, color) {
  const snake = playerState.snake;

  ctx.fillStyle = color
  for (let cell of snake) {
    ctx.fillRect(cell.x * size, cell.y * size, size, size)
  }
}

paintGame(gameState);

function handleInit(message){

}
