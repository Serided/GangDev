let output = document.getElementById("output")
let timebtn = document.getElementById("time")
let spacebtn = document.getElementById("space")
let godbtn = document.getElementById("god")
let moralitybtn = document.getElementById("morality")

var time = ["time"]

var space = ["space"]

var god = ["god"]

var morality = ["morality"]

var unknown = ["I don't know the answer to that."]

function answer() {
    var iV = event.target.id
    if(iV === "time") {
        output.innerHTML = time.join(" ")
    }
    else if (iV === "space") {
        output.innerHTML = space.join(" ")
    }
    else if (iV === "god") {
        output.innerHTML = god.join(" ")
    }
    else if (iV === "morality") {
        output.innerHTML = morality.join(" ")
    }
    else {
        output.innerHTML = unknown.join(" ")
    }
}

timebtn.addEventListener('click', answer)
spacebtn.addEventListener('click', answer)
godbtn.addEventListener('click', answer)
moralitybtn.addEventListener('click', answer)