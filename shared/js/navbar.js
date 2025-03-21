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

document.addEventListener('DOMContentLoaded', function () {
    // ----- ELEMENTS -----
    const hamburger = document.getElementById('hamburger');

    // Gather top-level nav items.
    // We assume top-level items are either radio labels or <button> elements within links,
    // and have classes "hamburger-btn btnText one" or "account-btn btnText".
    let topNavItems = Array.from(document.querySelectorAll('.hNavbar label[for], .hNavbar a > button'));

    // Force Home button to be first by checking its text.
    const homeIndex = topNavItems.findIndex(item => item.textContent.trim().toLowerCase() === 'home');
    if (homeIndex > 0) {
        const homeItem = topNavItems.splice(homeIndex, 1)[0];
        topNavItems.unshift(homeItem);
    }

    // For section navigation when navbar is closed:
    const sections = Array.from(document.querySelectorAll('.sect.cont'));

    // ----- STATE VARIABLES -----
    let inNavMode = false; // false = section navigation; true = navbar mode.
    let navLevel = 1;      // 1 = top-level; 2 = second-level.
    let currentIndex = 0;  // index of the currently highlighted item.

    // ----- HELPER FUNCTIONS -----

    // Get second-level navigation items for Account if available.
    function getSecondLevelNav() {
        // We assume that if the current top-level selection's text includes "account",
        // then there is a second-level submenu. Find it based on the account radio.
        if (topNavItems[currentIndex] && topNavItems[currentIndex].textContent.toLowerCase().includes('account')) {
            const accountRadio = document.getElementById('account');
            if (accountRadio) {
                let sibling = accountRadio.nextElementSibling;
                while (sibling && !sibling.classList.contains('sidebar')) {
                    sibling = sibling.nextElementSibling;
                }
                if (sibling && sibling.classList.contains('two')) {
                    return Array.from(sibling.querySelectorAll('nav a'));
                }
            }
        }
        return [];
    }

    // Update visual highlight for the current menu (top-level or second-level).
    function updateHighlight(items) {
        items.forEach((el, idx) => {
            if (idx === currentIndex) {
                el.classList.add('selected');
            } else {
                el.classList.remove('selected');
            }
        });
    }

    // Clear highlighting.
    function clearHighlight() {
        topNavItems.forEach(el => el.classList.remove('selected'));
        getSecondLevelNav().forEach(el => el.classList.remove('selected'));
    }

    // Section navigation: scroll smoothly to the section nearest the top.
    function navigateSections(direction) {
        if (sections.length === 0) return;
        let currentSectionIndex = 0;
        let closest = Infinity;
        sections.forEach((section, i) => {
            const diff = Math.abs(section.getBoundingClientRect().top);
            if (diff < closest) {
                closest = diff;
                currentSectionIndex = i;
            }
        });
        if (direction === 'up' && currentSectionIndex > 0) {
            sections[currentSectionIndex - 1].scrollIntoView({ behavior: 'smooth' });
        } else if (direction === 'down' && currentSectionIndex < sections.length - 1) {
            sections[currentSectionIndex + 1].scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Open navbar: check hamburger, set mode to navbar, top-level, and highlight first item.
    function openNavbar() {
        hamburger.checked = true;
        inNavMode = true;
        navLevel = 1;
        currentIndex = 0;
        updateHighlight(topNavItems);
    }

    // Close navbar and return to section navigation mode.
    function closeNavbar() {
        hamburger.checked = false;
        inNavMode = false;
        navLevel = 1;
        currentIndex = 0;
        clearHighlight();
    }

    // ----- KEYBOARD HANDLING -----
    document.addEventListener('keydown', function (e) {
        // Skip if focus is in an input or textarea.
        if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
            return;
        }
        const key = e.key.toLowerCase();
        if (!['a', 'd', 'w', 's'].includes(key)) return;
        e.preventDefault();

        // Navbar is closed -> section navigation mode.
        if (!inNavMode) {
            if (key === 'a') {
                openNavbar();
            } else if (key === 'w') {
                navigateSections('up');
            } else if (key === 's') {
                navigateSections('down');
            }
            return;
        }

        // Navbar is open:
        if (navLevel === 1) {
            // Top-level mode.
            if (key === 'w') {
                currentIndex = (currentIndex - 1 + topNavItems.length) % topNavItems.length;
                updateHighlight(topNavItems);
            } else if (key === 's') {
                currentIndex = (currentIndex + 1) % topNavItems.length;
                updateHighlight(topNavItems);
            } else if (key === 'a') {
                // If current top-level is "home", click and close.
                const text = topNavItems[currentIndex].textContent.trim().toLowerCase();
                if (text === 'home') {
                    topNavItems[currentIndex].click();
                    closeNavbar();
                } else if (text.includes('account')) {
                    // For "account", check if a second-level menu exists.
                    const secondNav = getSecondLevelNav();
                    if (secondNav.length > 0) {
                        navLevel = 2;
                        currentIndex = 0; // reset for second-level.
                        updateHighlight(secondNav);
                    } else {
                        topNavItems[currentIndex].click();
                        closeNavbar();
                    }
                } else {
                    // For any other top-level item, click it and close.
                    topNavItems[currentIndex].click();
                    closeNavbar();
                }
            } else if (key === 'd') {
                // D closes the navbar in top-level mode.
                closeNavbar();
            }
        } else if (navLevel === 2) {
            // Second-level mode.
            const secondNavItems = getSecondLevelNav();
            if (secondNavItems.length === 0) {
                // Fallback to top-level mode.
                navLevel = 1;
                currentIndex = 0;
                updateHighlight(topNavItems);
                return;
            }
            if (key === 'w') {
                currentIndex = (currentIndex - 1 + secondNavItems.length) % secondNavItems.length;
                updateHighlight(secondNavItems);
            } else if (key === 's') {
                currentIndex = (currentIndex + 1) % secondNavItems.length;
                updateHighlight(secondNavItems);
            } else if (key === 'a') {
                // In second-level mode, select the link and close navbar.
                secondNavItems[currentIndex].click();
                closeNavbar();
            } else if (key === 'd') {
                // D returns to top-level mode.
                navLevel = 1;
                // Optionally, set currentIndex to the "account" button.
                const accountIndex = topNavItems.findIndex(item => item.textContent.trim().toLowerCase().includes('account'));
                currentIndex = accountIndex !== -1 ? accountIndex : 0;
                updateHighlight(topNavItems);
            }
        }
    });
});
