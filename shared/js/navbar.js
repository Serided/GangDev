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
    const upBtn = document.getElementById('upButton')
    const downBtn = document.getElementById('downButton')

    function getCurrentSectionIndex() {
        let currentIndex = 0;
        let closest = Infinity;
        sections.forEach((section, i) => {
            const diff = Math.abs(section.getBoundingClientRect().top);
            if (diff < closest) {
                closest = diff;
                currentIndex = i;
            }
        });
        return currentIndex;
    }

    // Update the visibility of navigation buttons based on the current section index.
    // Also hide both buttons if there is only one section.
    function updateNavButtons() {
        if (sections.length <= 1) {
            upBtn.style.opacity = 0;
            upBtn.style.pointerEvents = 'none';
            downBtn.style.opacity = 0;
            downBtn.style.pointerEvents = 'none';
            return;
        }

        const currentIndex = getCurrentSectionIndex();

        // Show the "up" button if there is a section above
        if (currentIndex > 0) {
            upBtn.style.opacity = 1;
            upBtn.style.pointerEvents = 'auto';
        } else {
            upBtn.style.opacity = 0;
            upBtn.style.pointerEvents = 'none';
        }

        // Show the "down" button if there is a section below
        if (currentIndex < sections.length - 1) {
            downBtn.style.opacity = 1;
            downBtn.style.pointerEvents = 'auto';
        } else {
            downBtn.style.opacity = 0;
            downBtn.style.pointerEvents = 'none';
        }
    }

    // Update buttons on scroll and initial load
    window.addEventListener('scroll', updateNavButtons);
    updateNavButtons();

    upBtn.addEventListener('click', function() {
        const currentIndex = getCurrentSectionIndex();
        if (currentIndex > 0) {
            sections[currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
        }
    });

    downBtn.addEventListener('click', function() {
        const currentIndex = getCurrentSectionIndex();
        if (currentIndex < sections.length - 1) {
            sections[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Existing keydown navigation logic remains unchanged.
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

        const currentIndex = getCurrentSectionIndex();

        if (key === 'w' && currentIndex > 0) {
            sections[currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
        } else if (key === 's' && currentIndex < sections.length - 1) {
            sections[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
        }
    });
});