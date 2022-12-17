function rectangularCollision({rectangle1, rectangle2}){
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
    rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  )
}

function determineWinner({player, enemy, timerId}){
  clearTimeout(timerId)

  document.querySelector('#displayText').style.display = 'flex'

  if (player.stats.health === enemy.stats.health) {
    console.log('Tie')
    document.querySelector('#displayText').innerHTML = 'Tie.'
    return;
  }
  else if (((100/player.stats.maxHealth)*(player.stats.health)) > ((100/enemy.stats.maxHealth)*(enemy.stats.health))){
    console.log('Player1 wins!')
    document.querySelector('#displayText').innerHTML = 'Player1 Wins!'
    return;
  }
  else if (((100/player.stats.maxHealth)*(player.stats.health)) < ((100/enemy.stats.maxHealth)*(enemy.stats.health))){
    console.log('Player2 wins!')
    document.querySelector('#displayText').innerHTML = 'Player2 Wins!'
    return;
  }
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
