var skipbtn = document.getElementById("skip")
var matchbtn = document.getElementById("match")

function cycle() {
  var subjectimg = document.getElementById("subject").style.backgroundImage;
  if(subjectimg == "url(https://shared.gangdev.co/files/img/dating/black.webp)") { // full value is provided
    subjectimg.style.backgroundImage = "url(https://shared.gangdev.co/files/img/dating/dirty.webp)"; // change it
  }
}

skipbtn.addEventListener("click", cycle())