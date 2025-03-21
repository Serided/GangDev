var hamburgerBtn = document.getElementById("hamburger");
var aboutBtn = document.getElementById("about");
var contactBtn = document.getElementById("contact");
//var servicesBtn = document.getElementById("services");
var modsBtn = document.getElementById("mods");
var appsBtn = document.getElementById("apps");
var gamesBtn = document.getElementById("games");
var accountBtn = document.getElementById("account");

function uncheckAll() {
    if(!hamburgerBtn.checked && (aboutBtn.checked === true ||
        contactBtn.checked === true ||
        /*servicesBtn.checked === true ||*/
        modsBtn.checked === true ||
        appsBtn.checked === true ||
        gamesBtn.checked === true ||
        accountBtn.checked === true)) {

        aboutBtn.checked = false;
        contactBtn.checked = false;
        // servicesBtn.checked = false;
        modsBtn.checked = false;
        appsBtn.checked = false;
        gamesBtn.checked = false;
        accountBtn.checked = false;
        hamburgerBtn.checked = true;
    }
}

hamburgerBtn.addEventListener('click', uncheckAll)

document.addEventListener('DOMContentLoaded', function() {
    const sections = Array.from(document.querySelectorAll('.sect.cont'));
    const hamburger = document.getElementById('hamburger');

    document.addEventListener('keydown', function(e) {
        if (document.activeElement &&
            (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
            return;
        }

        let key = e.key.toLowerCase();
        if (key === 'arrowup') key = 'w';
        if (key === 'arrowdown') key = 's';
        if (key === 'arrowleft') key = 'a';

        if (!['a', 'w', 's'].includes(key)) return;

        e.preventDefault();

        if (key === 'a') {
            hamburger.checked = !hamburger.checked;
            return;
        }

        if (hamburger.checked) return;

        let currentIndex = 0;
        let closest = Infinity;
        sections.forEach((section, i) => {
            const diff = Math.abs(section.getBoundingClientRect().top);
            if (diff < closest) {
                closest = diff;
                currentIndex = i;
            }
        });

        if (key === 'w' && currentIndex > 0) {
            sections[currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
        } else if (key === 's' && currentIndex < sections.length - 1) {
            sections[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
        }
    });
});