const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576
c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = .7
const jumph = -13

const background = new Sprite({
  position: {
    x:0,
    y:0
  },
  imageSrc: './img/bfgame/background-resized.png'
})

const shop = new Sprite({
  position: {
    x: 620,
    y: 161
  },
  imageSrc: './img/bfgame/shop.png',
  scale: 2.5,
  frames: 6,
  framesHold: 7
})

const player1 = new Fighter({
  position: {
    x: 10,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  stats: {
    pdamage: 1,
    pspeed: 5,
    maxHealth: 50,
    health: 50,
    dead: 0
  },
  imageSrc: './img/bfgame/samuraiMack/Idle.png',
  frames: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157
  },
  sprites: {
    idle: {
      imageSrc: './img/bfgame/samuraiMack/Idle.png',
      frames: 8,
      framesHold: 7,
    },
    run: {
      imageSrc: './img/bfgame/samuraiMack/Run.png',
      frames: 8,
      framesHold: 5,
    },
    jump: {
      imageSrc: './img/bfgame/samuraiMack/Jump.png',
      frames: 2,
      framesHold: 7,
    },
    fall: {
      imageSrc: './img/bfgame/samuraiMack/Fall.png',
      frames: 2,
      framesHold: 7,
    },
    attack1: {
      imageSrc: './img/bfgame/samuraiMack/Attack1.png',
      frames: 6,
      framesHold: 7,
    },
    takeHit: {
      imageSrc: './img/bfgame/samuraiMack/Take Hit - white silhouette.png',
      frames: 4,
      framesHold: 7,
    },
    death: {
      imageSrc: './img/bfgame/samuraiMack/Death.png',
      frames: 6,
      framesHold: 10,
    },
  },
  attackBox: {
    offset: {
      x: -10,
      y: -30
    },
    width: 269,
    height: 170
  }
})

const player2 = new Fighter({
  position: {
    x: 960,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  stats: {
    pdamage: 1,
    pspeed: 7,
    maxHealth: 25,
    health: 25,
    dead: 0
  },
  color: 'green',
  imageSrc: './img/bfgame/kenji/Idle.png',
  frames: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 167
  },
  sprites: {
    idle: {
      imageSrc: './img/bfgame/kenji/Idle.png',
      frames: 4,
      framesHold: 7,
    },
    run: {
      imageSrc: './img/bfgame/kenji/Run.png',
      frames: 8,
      framesHold: 5,
    },
    jump: {
      imageSrc: './img/bfgame/kenji/Jump.png',
      frames: 2,
      framesHold: 7,
    },
    fall: {
      imageSrc: './img/bfgame/kenji/Fall.png',
      frames: 2,
      framesHold: 7,
    },
    attack1: {
      imageSrc: './img/bfgame/kenji/Attack1.png',
      frames: 4,
      framesHold: 6,
    },
    takeHit: {
      frames: 3,
      framesHold: 6,
      imageSrc: './img/bfgame/kenji/Take hit.png'
    },
    death: {
      imageSrc: './img/bfgame/kenji/Death.png',
      frames: 7,
      framesHold: 10,
    },
  },
  attackBox: {
    offset: {
      x: -173,
      y: 0
    },
    width: 237,
    height: 150
  }
})

player2.draw()

console.log(player1)

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

decreaseTimer()

function animate(){
  window.requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  background.update()
  shop.update()
  c.fillStyle = 'rgba(255,255,255, 0.1)'
  c.fillRect(0,0,canvas.width,canvas.height)
  player1.update()
  player2.update()

  // player1 movement
  player1.movement(keys.a, keys.d,'a','d')

  // player2 movement
  player2.movement(keys.ArrowLeft, keys.ArrowRight,'ArrowLeft','ArrowRight')

  // detect for collision
  if (
    rectangularCollision({
      rectangle1: player1,
      rectangle2: player2
    }) &&
    player1.isAttacking && player1.framesCurrent === 4
    ) {
    player2.takeHit(player1.stats.pdamage)
    player1.isAttacking = false
    console.log('hit player2')

    gsap.to('#player2Health', {
      width: ((100 / player2.stats.maxHealth) * (player2.stats.health)) + '%'
    })
  }

  // If player1 misses
  if (player1.isAttacking && player1.framesCurrent === 4){
    player1.isAttacking = false
  }

  if (
    rectangularCollision({
      rectangle1: player2,
      rectangle2: player1
    }) &&
    player2.isAttacking && player2.framesCurrent === 1
  ) {
    player1.takeHit(player2.stats.pdamage)
    player2.isAttacking = false
    console.log('hit player1')

    gsap.to('#player1Health', {
      width: ((100/player1.stats.maxHealth)*(player1.stats.health)) + '%'
    })
  }

  if (player2.isAttacking && player2.framesCurrent === 1){
    player2.isAttacking = false
  }

  // End game based on health
  if (player2.stats.health <= 0 || player1.stats.health <= 0){
    determineWinner({player1,player2, timerId})
  }
}

animate()

window.addEventListener('keydown', (event) => {
  if (!player1.dead) {
    switch (event.key) {
      case 'd':
        keys.d.pressed = true
        player1.lastKey = 'd'
        break
      case 'a':
        keys.a.pressed = true
        player1.lastKey = 'a'
        break
      case 'w':
        player1.velocity.y = jumph
        break
      case ' ':
        player1.attack()
        break
    }
  }
  if (!player2.dead){
    switch (event.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = true
        player2.lastKey = 'ArrowRight'
        break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        player2.lastKey = 'ArrowLeft'
        break
      case 'ArrowUp':
        player2.velocity.y = jumph
        break
      case 'ArrowDown':
        player2.attack()
        break
    }
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    // player1
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break

    // player2
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break
  }
})
