var character = document.getElementById("character");

var enemy = document.getElementById("enemy");

let popup = document.getElementById("popup");
let submit1 = document.getElementById("submit1");
let submit2 = document.getElementById("submit2");
let submit3 = document.getElementById("submit3");

let timer = document.getElementById('timer');
let time = 0;
let timerId;

let dead = false;

function jump(){
  if(character.classList != "animate") {
    character.classList.add("animate")
    setTimeout(function () {
      character.classList.remove("animate");
    }, 500);
  }
}
/*
function closePopup() {
  popup.classList.remove("openpopup");
}

function submitbtn() {
  submit1.classList.remove("submit");
  submit2.classList.add("submit");
  submit3.classList.remove("submit");
}
*/

var checkDead = setInterval(function (){
  var characterWidth = parseInt(window.getComputedStyle(character).getPropertyValue("width"));
  var characterHeight = parseInt(window.getComputedStyle(character).getPropertyValue("height"));
  var enemyWidth = parseInt(window.getComputedStyle(enemy).getPropertyValue("width"));
  var enemyHeight = parseInt(window.getComputedStyle(enemy).getPropertyValue("height"));

  var characterBottom = parseInt(window.getComputedStyle(character).getPropertyValue("bottom"));
  var characterLeft = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
  var enemyBottom = parseInt(window.getComputedStyle(enemy).getPropertyValue("bottom"));
  var enemyLeft = parseInt(window.getComputedStyle(enemy).getPropertyValue("left"));

  if(((enemyLeft >= characterLeft && enemyLeft <= (characterLeft + characterWidth)) || ((enemyLeft + enemyWidth) >= characterLeft && (enemyLeft + enemyWidth) <= (characterLeft + characterWidth)))
      && ((characterBottom >= enemyBottom && characterBottom <= (enemyBottom + enemyHeight)) || ((characterBottom + characterHeight) >= enemyBottom && (characterBottom + characterHeight) <= (enemyBottom + enemyHeight)))) {
    enemy.style.animation = "none";
    enemy.style.display = "none";
    if(alert("Thou lost.")) {}
    else {
      window.location.reload();
    }
    dead = true;
    /*popup.classList.add("openpopup");

    let stats = [
        date = new Date(),
        score = time.toFixed(2),
    ]*/
  }
  if(!dead) {
    decreaseTimer()
  }
},1);

function decreaseTimer() {
  time += 0.005
  // console.log(time)
  timer.innerHTML = time.toFixed(2)
}

/*
function newGame(){
  if(block.style.animation == "none" && block.style.display == "none"){

  }
}
*/
