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

const player = new Fighter({
  position: {
    x: 0,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  stats: {
    pdamage: 1,
    pspeed: 5,
    maxHealth: 10,
    health: 10
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
      framesHold: 5,
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

const enemy = new Fighter({
  position: {
    x: 500,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  stats: {
    pdamage: 1,
    pspeed: 7,
    maxHealth: 5,
    health: 5
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

decreaseTimer()

function animate(){
  window.requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  background.update()
  shop.update()
  c.fillStyle = 'rgba(255,255,255, 0.1)'
  c.fillRect(0,0,canvas.width,canvas.height)
  player.update()
  enemy.update()

  // player movement
  player.movement(keys.a, keys.d,'a','d')

  // enemy movement
  enemy.movement(keys.ArrowLeft, keys.ArrowRight,'ArrowLeft','ArrowRight')

  // detect for collision
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy
    }) &&
    player.isAttacking && player.framesCurrent === 4
    ) {
    enemy.takeHit(player.stats.pdamage)
    player.isAttacking = false
    console.log('hit enemy')

    gsap.to('#enemyHealth', {
      width: ((100 / enemy.stats.maxHealth) * (enemy.stats.health)) + '%'
    })
  }

  // If player misses
  if (player.isAttacking && player.framesCurrent === 4){
    player.isAttacking = false
  }

  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player
    }) &&
    enemy.isAttacking && enemy.framesCurrent === 1
  ) {
    player.takeHit(enemy.stats.pdamage)
    enemy.isAttacking = false
    console.log('hit player')

    gsap.to('#playerHealth', {
      width: ((100/player.stats.maxHealth)*(player.stats.health)) + '%'
    })
  }

  if (enemy.isAttacking && enemy.framesCurrent === 1){
    enemy.isAttacking = false
  }

  // End game based on health
  if (enemy.stats.health <= 0 || player.stats.health <= 0){
    determineWinner({player,enemy, timerId})
  }
}

animate()

window.addEventListener('keydown', (event) => {
  if (!player.dead) {
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
    }
  }
  if (!enemy.dead){
    switch (event.key) {
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
