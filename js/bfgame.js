const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576
c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = .7
const jumph = -13
const pspeed = 7

class sprite {
  constructor({position, velocity, color = 'red', offset}) {
    this.position = position
    this.velocity = velocity
    this.width = 50
    this.height = 150
    this.lastKey
    this.attachBox = {
      position: {
        x:this.position.x,
        y: this.position.y
      },
      offset,
      width: 100,
      height: 50,
    }
    this.color = color
    this.isAttacking
    this.health = 100
  }

  draw(){
    c.fillStyle = this.color
    c.fillRect(this.position.x, this.position.y, this.width, this.height)

    // attach box drawn
    if (this.isAttacking) {
      c.fillStyle = 'red'
      c.fillRect(this.attachBox.position.x, this.attachBox.position.y, this.attachBox.width, this.attachBox.height)
    }
  }

  update(){
    this.draw()
    this.attachBox.position.x = this.position.x + this.attachBox.offset.x
    this.attachBox.position.y = this.position.y

    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if(this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0
    }

    else this.velocity.y += gravity
  }

  attack(){
    this.isAttacking = true
    setTimeout(() => {
      this.isAttacking = false
    }, 100)
  }
}

const player = new sprite({
  position: {
    x: 0,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 0,
    y: 0
  },
  color: 'blue'
})

const enemy = new sprite({
  position: {
    x: 400,
    y: 100
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: -50,
    y: 0
  },
  color: 'green'
})

enemy.draw()

console.log(player)

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  }
}

let lastKey

function rectangularCollision({rectangle1, rectangle2}){
  return (
    rectangle1.attachBox.position.x + rectangle1.attachBox.width >= rectangle2.position.x &&
    rectangle1.attachBox.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.attachBox.position.y + rectangle1.attachBox.height >= rectangle2.position.y &&
    rectangle1.attachBox.position.y <= rectangle2.position.y + rectangle2.height
  )
}

function determineWinner({player, enemy, timerId}){
  clearTimeout(timerId)

  document.querySelector('#displayText').style.display = 'flex'

  if (player.health === enemy.health) {
    console.log('Tie')
    document.querySelector('#displayText').innerHTML = 'Tie.'
  }
  else if (player.health > enemy.health){
    console.log('Player1 wins!')
    document.querySelector('#displayText').innerHTML = 'Player1 Wins!'
  }
  else if (player.health < enemy.health){
    console.log('Player2 wins!')
    document.querySelector('#displayText').innerHTML = 'Player2 Wins!'
  }

  player.health = 'ir'
  enemy.health = 'ir'
}

let timer = 60
let timerId

function decreaseTimer(){
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000)
    timer--
    document.querySelector('#timer').innerHTML = timer
  }

  if (timer === 0) {
    determineWinner({player, enemy})
  }
}

decreaseTimer()

function animate(){
  window.requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.update()
  enemy.update()

  // player movement
  if (keys.a.pressed && player.lastKey === 'a'){
    player.velocity.x = -pspeed
  }
  else if (keys.d.pressed && player.lastKey === 'd'){
    player.velocity.x = pspeed
  }
  else
    player.velocity.x = 0

  // enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
    enemy.velocity.x = -pspeed
  }
  else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
    enemy.velocity.x = pspeed
  }
  else
    enemy.velocity.x = 0

  // detect for collision
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy
    }) &&
    player.isAttacking
    ) {
    player.isAttacking = false
    console.log('hit enemy')
    enemy.health -= 20
    document.querySelector('#enemyHealth').style.width = enemy.health + '%'
  }

  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player
    }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false
    console.log('hit player')
    player.health -= 20
    document.querySelector('#playerHealth').style.width = player.health + '%'
  }

  // End game based on health
  if (enemy.health <= 0 || player.health <= 0){
    determineWinner({player,enemy, timerId})
  }
}

animate()

window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = true
      player.lastKey = 'd'
      break
    case 'a':
      keys.a.pressed = true
      player.lastKey = 'a'
      break
    case 'w':
      player.velocity.y = jumph
      break
    case ' ':
      player.attack()
      break

    case 'ArrowRight':
      keys.ArrowRight.pressed = true
      enemy.lastKey = 'ArrowRight'
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true
      enemy.lastKey = 'ArrowLeft'
      break
    case 'ArrowUp':
      enemy.velocity.y = jumph
      break
    case 'ArrowDown':
      enemy.attack()
      break
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    // player
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break

    // enemy
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break
  }
})