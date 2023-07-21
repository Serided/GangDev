var character =
  document.getElementById("character");

var block =
  document.getElementById("block");

let popup = document.getElementById("popup");
let submit1 = document.getElementById("submit1");
let submit2 = document.getElementById("submit2");

let timer = document.getElementById('timer');
let time = 0
let timerId

function jump(){
  if(character.classList != "animate") {
    character.classList.add("animate")
    setTimeout(function () {
      character.classList.remove("animate");
    }, 500);
  }
}

function closePopup() {
  popup.classList.remove("openpopup");
}

function submitbtn() {
  submit1.classList.remove("submit");
  submit2.classList.remove("submit");
}

var checkDead = setInterval(function (){
  var characterTop =
    parseInt(window.getComputedStyle(character).getPropertyValue("top"));
  var blockLeft =
    parseInt(window.getComputedStyle(block).getPropertyValue("left"));
  if(blockLeft<-230 && blockLeft>-250 && characterTop>=130){
    block.style.animation = "none";
    block.style.display = "none";
    // alert("Thou lost.");
    popup.classList.add("openpopup");

    let stats = [
        date = new Date(),
        score = time,
    ]
  }
},1);

function decreaseTimer() {
  timerId = setTimeout(decreaseTimer, 10)
  time += 0.01
  // console.log(time)
  timer.innerHTML = time.toFixed(2)
}

decreaseTimer()
/*
function newGame(){
  if(block.style.animation == "none" && block.style.display == "none"){

  }
}
*/
