class Sprite {
  constructor({position, imageSrc, scale = 1, frames = 1, offset = {x: 0, y: 0}, framesHold = 7}) {
    this.position = position
    this.width = 50
    this.height = 150
    this.image = new Image()
    this.image.src = imageSrc
    this.scale = scale
    this.frames = frames
    this.framesCurrent = 0
    this.framesElapsed = 0
    this.framesHold = framesHold
    this.offset = offset
  }

  draw(){
    c.drawImage(
      this.image,
      /* location */
      this.framesCurrent * (this.image.width / this.frames),
      0,
      /* height */
      this.image.width / this.frames,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.frames) * this.scale,
      this.image.height * this.scale)
  }

  animateFrames(){
    if (this.dead) return

    this.framesElapsed++

    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.frames - 1) {
        this.framesCurrent++
      }
      else {
        this.framesCurrent = 0
      }
    }
  }

  update() {
    this.draw()
    if (!this.dead) this.animateFrames()
  }
}

class Fighter extends Sprite{
  constructor({
      position,
      velocity,
      color = 'red',
      stats = {pdamage: 0},
      imageSrc,
      scale = 1,
      frames = 1,
      offset = {x: 0, y: 0},
      framesHold = 7,
      sprites,
      attackBox = {offset: {}, width: undefined, height: undefined}
    }) {
    super({
      position, stats, imageSrc, scale, frames, offset, framesHold, attackBox
    })

    this.velocity = velocity
    this.width = 50
    this.height = 150

    this.stats = {
      pdamage: stats.pdamage,
      pspeed: stats.pspeed,
      maxHealth: stats.maxHealth,
      health: stats.health
    }

    this.lastKey

    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    }

    this.color = color
    this.isAttacking
    this.framesCurrent = 0
    this.framesElapsed = 0
    this.sprites = sprites
    this.dead = false

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image()
      sprites[sprite].image.src = sprites[sprite].imageSrc
    }
  }

  update(){
    this.draw()
    if (this.image === this.sprites.death.image) {
      if (this.framesCurrent === this.sprites.death.frames - 1)
        this.dead = true
    }
    if (!this.dead) this.animateFrames()

    // Attack boxes
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y

    // Draw attack box
    /*
    c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
    */
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if(this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0
      this.position.y = 330
    }

    else {
      this.velocity.y += gravity
    }
  }

  movement(key1, key2, left, right) {
    if (key1.pressed && this.lastKey === left){
      this.velocity.x = -this.stats.pspeed
      this.switchSprite('run')
    }
    else if (key2.pressed && this.lastKey === right){
      this.velocity.x = this.stats.pspeed
      this.switchSprite('run')
    }
    else {
      this.velocity.x = 0
      this.switchSprite('idle')
    }

    if (this.velocity.y < 0) {
      this.switchSprite('jump')
    }
    else if (this.velocity.y > 0){
      this.switchSprite('fall')
    }
  }

  attack(){
    this.switchSprite('attack1')
    this.isAttacking = true
  }

  takeHit(damage){
    this.stats.health -= damage
    console.log(damage)

    if (this.stats.health <= 0){
      this.switchSprite('death')
    }
    else this.switchSprite('takeHit')
  }

  switchSprite(sprite) {
    if (this.image === this.sprites.death.image){
      if (this.framesCurrent === this.sprites.death.frames - 1)
        this.dead = true
      return
    }

    // Override all animations to attack
    if (this.image === this.sprites.attack1.image && this.framesCurrent < this.sprites.attack1.frames - 1) return

    // Override all animations if damaged
    if (this.image === this.sprites.takeHit.image && this.framesCurrent < this.sprites.takeHit.frames - 1) return

    switch (sprite) {
      case 'idle': {
        if (this.image !== this.sprites.idle.image) {
          this.frames = this.sprites.idle.frames
          this.framesCurrent = 0
          this.framesHold = this.sprites.idle.framesHold
          this.image = this.sprites.idle.image
        }
        break
      }

      case 'run': {
        if (this.image !== this.sprites.run.image) {
          this.frames = this.sprites.run.frames
          this.framesCurrent = 0
          this.framesHold = this.sprites.run.framesHold
          this.image = this.sprites.run.image
        }
        break
      }

      case 'jump': {
        if (this.image !== this.sprites.jump.image) {
          this.frames = this.sprites.jump.frames
          this.framesCurrent = 0
          this.framesHold = this.sprites.jump.framesHold
          this.image = this.sprites.jump.image
          }
        break
      }

      case 'fall': {
        if (this.image !== this.sprites.fall.image) {
          this.frames = this.sprites.fall.frames
          this.framesCurrent = 0
          this.framesHold = this.sprites.fall.framesHold
          this.image = this.sprites.fall.image
        }
        break
      }

      case 'attack1': {
        if (this.image !== this.sprites.attack1.image) {
          this.frames = this.sprites.attack1.frames
          this.framesCurrent = 0
          this.framesHold = this.sprites.attack1.framesHold
          this.image = this.sprites.attack1.image
        }
        break
      }

      case 'takeHit': {
        if (this.image !== this.sprites.takeHit.image) {
          this.frames = this.sprites.takeHit.frames
          this.framesCurrent = 0
          this.framesHold = this.sprites.takeHit.framesHold
          this.image = this.sprites.takeHit.image
        }
        break
      }

      case 'death': {
        if (this.image !== this.sprites.death.image) {
          this.frames = this.sprites.death.frames
          this.framesCurrent = 0
          this.framesHold = this.sprites.death.framesHold
          this.image = this.sprites.death.image
        }
        break
      }
    }
  }
}
