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
    // --- ELEMENT SELECTION ---
    // The hamburger checkbox that toggles the navbar.
    const hamburger = document.getElementById('hamburger');

    // Top-level navigation items: include both radio labels and the Home button.
    // We select any element with the classes "hamburger-btn" and "btnText" and "one".
    const topNavItems = Array.from(document.querySelectorAll('.hamburger-btn.btnText.one'));

    // For section navigation when the navbar is closed.
    const sections = Array.from(document.querySelectorAll('.sect.cont'));

    // --- STATE VARIABLES ---
    // inNavMode: true when the navbar is open and we're navigating it.
    let inNavMode = false;
    // navLevel: 1 for top-level menu, 2 for second-level submenu.
    let navLevel = 1;
    // currentIndex: the currently highlighted item within the active menu.
    let currentIndex = 0;

    // --- HELPER FUNCTIONS ---

    // Check if an element is visible.
    function isVisible(el) {
        return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
    }

    // Returns an array of second-level nav items (the <a> elements) for the currently active top-level menu.
    function getSecondLevelNav() {
        // Find the active radio input among top-level menus.
        const activeRadio = document.querySelector('input[name="menu"]:checked');
        if (activeRadio) {
            // Find the sidebar (the second-level container) that follows this radio's label.
            let sibling = activeRadio.nextElementSibling;
            while (sibling && !sibling.classList.contains('sidebar')) {
                sibling = sibling.nextElementSibling;
            }
            if (sibling && sibling.classList.contains('two') && isVisible(sibling)) {
                return Array.from(sibling.querySelectorAll('nav a'));
            }
        }
        return [];
    }

    // Update visual highlighting on the active menu items.
    function updateHighlight() {
        if (navLevel === 1) {
            topNavItems.forEach((item, idx) => {
                if (idx === currentIndex) {
                    item.classList.add('selected');
                } else {
                    item.classList.remove('selected');
                }
            });
        } else if (navLevel === 2) {
            const secondNavItems = getSecondLevelNav();
            secondNavItems.forEach((item, idx) => {
                if (idx === currentIndex) {
                    item.classList.add('selected');
                } else {
                    item.classList.remove('selected');
                }
            });
        }
    }

    // Clear all highlighting.
    function clearHighlight() {
        topNavItems.forEach(item => item.classList.remove('selected'));
        const secondNavItems = getSecondLevelNav();
        secondNavItems.forEach(item => item.classList.remove('selected'));
    }

    // Smoothly scroll between sections when navbar is closed.
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

    // Open the navbar: mark it as open and set mode to top-level.
    function openNavbar() {
        hamburger.checked = true;
        inNavMode = true;
        navLevel = 1;
        currentIndex = 0;
        updateHighlight();
    }

    // Close the navbar and reset navigation state.
    function closeNavbar() {
        hamburger.checked = false;
        inNavMode = false;
        navLevel = 1;
        currentIndex = 0;
        clearHighlight();
    }

    // --- KEYBOARD EVENT HANDLER ---
    document.addEventListener('keydown', function (e) {
        // Do nothing if an input or textarea is focused.
        const activeEl = document.activeElement;
        if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) return;

        const key = e.key.toLowerCase();
        if (!['a', 'd', 'w', 's'].includes(key)) return;
        e.preventDefault();

        // If navbar is closed, W/S navigate sections; A opens navbar.
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

        // Navbar is open.
        if (navLevel === 1) {
            // In top-level mode.
            if (key === 'w') {
                currentIndex = (currentIndex - 1 + topNavItems.length) % topNavItems.length;
                updateHighlight();
            } else if (key === 's') {
                currentIndex = (currentIndex + 1) % topNavItems.length;
                updateHighlight();
            } else if (key === 'a') {
                // If the selected top-level item is Home, select it and close.
                const selectedItem = topNavItems[currentIndex];
                const text = selectedItem.textContent.trim().toLowerCase();
                if (text === "home") {
                    selectedItem.click();
                    closeNavbar();
                } else {
                    // For non-home items, if there's a second-level menu, switch to level 2;
                    // otherwise, click the top-level item.
                    const secondNav = getSecondLevelNav();
                    if (secondNav.length > 0) {
                        navLevel = 2;
                        currentIndex = 0;
                        updateHighlight();
                    } else {
                        selectedItem.click();
                        closeNavbar();
                    }
                }
            } else if (key === 'd') {
                // D closes the navbar, but resets to top-level mode.
                closeNavbar();
            }
        } else if (navLevel === 2) {
            // In second-level mode.
            const secondNavItems = getSecondLevelNav();
            if (secondNavItems.length === 0) {
                // No second-level items: fallback to top-level.
                navLevel = 1;
                currentIndex = 0;
                updateHighlight();
                return;
            }
            if (key === 'w') {
                currentIndex = (currentIndex - 1 + secondNavItems.length) % secondNavItems.length;
                updateHighlight();
            } else if (key === 's') {
                currentIndex = (currentIndex + 1) % secondNavItems.length;
                updateHighlight();
            } else if (key === 'a') {
                // In second-level mode, selecting an item triggers its click and closes the navbar.
                secondNavItems[currentIndex].click();
                closeNavbar();
            } else if (key === 'd') {
                // D returns to top-level mode without closing the navbar.
                navLevel = 1;
                currentIndex = 0;
                updateHighlight();
            }
        }
    });
});
