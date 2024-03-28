var hamburgerBtn = document.getElementById("hamburger")
var aboutBtn = document.getElementById("about")
var contactBtn = document.getElementById("contact")
var servicesBtn = document.getElementById("services")
var appsBtn = document.getElementById("apps")
var gamesBtn = document.getElementById("games")

function hamburgerUncheck() {
    if(hamburgerBtn.checked === false) {
        aboutBtn.checked = false;
        contactBtn.checked = false;
        servicesBtn.checked = false;
        appsBtn.checked = false;
        gamesBtn.checked = false;
    }
}

// need to fix
function uncheck(btn) {
    console.log(btn)
    if(btn.checked) {
        btn.checked = false;
        return btn;
    }
}

hamburgerBtn.addEventListener('click', hamburgerUncheck)
//aboutBtn.addEventListener('click', uncheck(aboutBtn))
//contactBtn.addEventListener('click', uncheck(contactBtn))
//servicesBtn.addEventListener('click', uncheck(servicesBtn))
//appsBtn.addEventListener('click', uncheck(appsBtn))
//gamesBtn.addEventListener('click', uncheck(gamesBtn))