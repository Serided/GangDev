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

    // Manually define the top-level items in the order you want.
    // (Adjust selectors as needed to match your markup.)
    const accountItem = document.querySelector('label[for="account"]');
    const homeItem = document.querySelector('a[href="https://gangdev.co/"] button');
    const modsItem = document.querySelector('label[for="mods"]');
    const appsItem = document.querySelector('label[for="apps"]');
    const gamesItem = document.querySelector('label[for="games"]');
    const aboutItem = document.querySelector('label[for="about"]');
    const contactItem = document.querySelector('label[for="contact"]');

    // Force the order: Home should be first.
    // We want the order: Home, Account, Mods, Apps, Games, About, Contact.
    const topNavItems = [homeItem, accountItem, modsItem, appsItem, gamesItem, aboutItem, contactItem];

    // Sections for when navbar is closed.
    const sections = Array.from(document.querySelectorAll('.sect.cont'));

    // ----- STATE VARIABLES -----
    let inNavMode = false; // false = section navigation; true = navbar navigation.
    let navLevel = 1;      // 1 = top-level; 2 = second-level.
    let currentIndex = 0;  // Index within the current menu.

    // ----- HELPER FUNCTIONS -----

    // Get second-level navigation items for the active top-level item (if any).
    function getSecondLevelNav() {
        // Determine the active top-level item by the current radio that is checked.
        // Instead of checking text, we'll try to locate the submenu based on the active radio.
        // Find the radio input corresponding to the active top-level item.
        const activeLabel = topNavItems[currentIndex];
        if (!activeLabel) return [];
        const radioId = activeLabel.getAttribute('for');
        if (!radioId) return [];
        const radioEl = document.getElementById(radioId);
        if (!radioEl) return [];
        // Look for the first sibling that is an aside with class "sidebar" and "two".
        let sibling = radioEl.nextElementSibling;
        while (sibling && !(sibling.tagName.toLowerCase() === 'aside' && sibling.classList.contains('two'))) {
            sibling = sibling.nextElementSibling;
        }
        if (sibling) {
            return Array.from(sibling.querySelectorAll('nav a'));
        }
        return [];
    }

    // Update visual highlight for the current menu items.
    function updateHighlight(items) {
        items.forEach((item, idx) => {
            if (idx === currentIndex) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
    }

    // Clear all highlights.
    function clearHighlight() {
        topNavItems.forEach(item => { if (item) item.classList.remove('selected'); });
        const secondNav = getSecondLevelNav();
        secondNav.forEach(item => { if (item) item.classList.remove('selected'); });
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

    // Open the navbar: set mode to navbar and highlight the top-level.
    function openNavbar() {
        hamburger.checked = true;
        inNavMode = true;
        navLevel = 1;
        // Start on Home (which we forced as index 0 in our array).
        currentIndex = 0;
        updateHighlight(topNavItems);
    }

    // Close the navbar: return to section navigation.
    function closeNavbar() {
        hamburger.checked = false;
        inNavMode = false;
        navLevel = 1;
        currentIndex = 0;
        clearHighlight();
    }

    // ----- KEYBOARD EVENT HANDLING -----
    document.addEventListener('keydown', function (e) {
        // Ignore if focus is in an input or textarea.
        if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) return;
        const key = e.key.toLowerCase();
        if (!['a', 'd', 'w', 's'].includes(key)) return;
        e.preventDefault();

        // When navbar is closed, W/S navigate sections, A opens navbar.
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

        // When navbar is open:
        if (navLevel === 1) {
            // Top-level mode.
            if (key === 'w') {
                currentIndex = (currentIndex - 1 + topNavItems.length) % topNavItems.length;
                updateHighlight(topNavItems);
            } else if (key === 's') {
                currentIndex = (currentIndex + 1) % topNavItems.length;
                updateHighlight(topNavItems);
            } else if (key === 'a') {
                const selectedItem = topNavItems[currentIndex];
                const text = selectedItem.textContent.trim().toLowerCase();
                if (text === 'home') {
                    // For Home: click and close.
                    selectedItem.click();
                    closeNavbar();
                } else {
                    // For any item that might have a submenu, check if a submenu exists.
                    const secondNavItems = getSecondLevelNav();
                    if (secondNavItems.length > 0) {
                        navLevel = 2;
                        currentIndex = 0; // reset for submenu.
                        updateHighlight(secondNavItems);
                    } else {
                        // Otherwise, simply click the item.
                        selectedItem.click();
                        // Do NOT close the navbar, so the user can continue to access the second level if available.
                    }
                }
            } else if (key === 'd') {
                // D in top-level mode closes the navbar.
                closeNavbar();
            }
        } else if (navLevel === 2) {
            // Second-level mode.
            const secondNavItems = getSecondLevelNav();
            if (secondNavItems.length === 0) {
                // Fallback: return to top-level mode.
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
                // In second-level mode, selecting an item triggers its click and closes the navbar.
                secondNavItems[currentIndex].click();
                closeNavbar();
            } else if (key === 'd') {
                // D returns to top-level mode.
                navLevel = 1;
                // Optionally, set currentIndex to the index of the item that triggered this submenu.
                // For simplicity, we set it to the Account item if it exists.
                const accountIndex = topNavItems.indexOf(accountItem);
                currentIndex = (accountIndex !== -1) ? accountIndex : 0;
                updateHighlight(topNavItems);
            }
        }
    });
});
