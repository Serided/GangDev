var hamburgerBtn = document.getElementById("hamburger")
var aboutBtn = document.getElementById("about")
var contactBtn = document.getElementById("contact")
var servicesBtn = document.getElementById("services")
var appsBtn = document.getElementById("apps")
var gamesBtn = document.getElementById("games")

function uncheckAll() {
    if(!hamburgerBtn.checked && (aboutBtn.checked === true || contactBtn.checked === true || /*servicesBtn.checked === true ||*/ appsBtn.checked === true || gamesBtn.checked === true)) {
        aboutBtn.checked = false;
        contactBtn.checked = false;
        // servicesBtn.checked = false;
        appsBtn.checked = false;
        gamesBtn.checked = false;
        hamburgerBtn.checked = true;
    }
}

hamburgerBtn.addEventListener('click', uncheckAll)