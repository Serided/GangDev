var skipbtn = document.getElementById("skip")
var matchbtn = document.getElementById("match")

function cycle() {
    var subjectimg = document.getElementById("subject").style.backgroundImage;
    if(subjectimg == "url(/files/black.webp)") { // full value is provided
        subjectimg.style.backgroundImage = "url(/files/dirty.webp)"; // change it
    }
}

skipbtn.addEventListener("click", cycle())