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

    // Manually define top-level items in desired order:
    const accountItem = document.querySelector('label[for="account"]');
    const homeItem = document.querySelector('a[href="https://gangdev.co/"] button');
    const modsItem = document.querySelector('label[for="mods"]');
    const appsItem = document.querySelector('label[for="apps"]');
    const gamesItem = document.querySelector('label[for="games"]');
    const aboutItem = document.querySelector('label[for="about"]');
    const contactItem = document.querySelector('label[for="contact"]');

    // Force order: [Account, Home, Mods, Apps, Games, About, Contact]
    const topNavItems = [accountItem, homeItem, modsItem, appsItem, gamesItem, aboutItem, contactItem];

    // For section navigation when navbar is closed.
    const sections = Array.from(document.querySelectorAll('.sect.cont'));

    // ----- STATE VARIABLES -----
    let inNavMode = false;  // false = section navigation; true = navbar navigation.
    let navLevel = 1;       // 1 = top-level; 2 = second-level.
    let currentIndex = 0;   // index within current menu.

    // ----- HELPER FUNCTIONS -----

    // Get the second-level nav items for the Account submenu.
    function getSecondLevelNav() {
        // Only applicable if the current top-level selection is the Account button.
        if (topNavItems[currentIndex] === accountItem) {
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

    // Update the visual highlight on the given items.
    function updateHighlight(items) {
        items.forEach((item, idx) => {
            if (idx === currentIndex) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
    }

    // Clear highlighting from all items.
    function clearHighlight() {
        topNavItems.forEach(item => { if(item) item.classList.remove('selected'); });
        const secondNav = getSecondLevelNav();
        secondNav.forEach(item => { if(item) item.classList.remove('selected'); });
    }

    // Section navigation: scroll to the section nearest the top.
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

    // Open the navbar: set mode to top-level and highlight Home.
    function openNavbar() {
        hamburger.checked = true;
        inNavMode = true;
        navLevel = 1;
        // Set selection to Home which we expect to be at index 1.
        currentIndex = 1;
        updateHighlight(topNavItems);
    }

    // Close the navbar.
    function closeNavbar() {
        hamburger.checked = false;
        inNavMode = false;
        navLevel = 1;
        currentIndex = 0;
        clearHighlight();
    }

    // ----- KEYBOARD HANDLING -----
    document.addEventListener('keydown', function (e) {
        // Ignore keys if focus is in an input or textarea.
        if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) return;
        const key = e.key.toLowerCase();
        if (!['a','d','w','s'].includes(key)) return;
        e.preventDefault();

        // If navbar is closed: use section navigation.
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
            // Top-level mode.
            if (key === 'w') {
                currentIndex = (currentIndex - 1 + topNavItems.length) % topNavItems.length;
                updateHighlight(topNavItems);
            } else if (key === 's') {
                currentIndex = (currentIndex + 1) % topNavItems.length;
                updateHighlight(topNavItems);
            } else if (key === 'a') {
                const selectedItem = topNavItems[currentIndex];
                // If the selected item is Home, click and close.
                if (selectedItem === homeItem) {
                    selectedItem.click();
                    closeNavbar();
                } else if (selectedItem === accountItem) {
                    // For Account, if submenu exists, switch to second-level mode.
                    const secondNavItems = getSecondLevelNav();
                    if (secondNavItems.length > 0) {
                        navLevel = 2;
                        currentIndex = 0;
                        updateHighlight(secondNavItems);
                    } else {
                        selectedItem.click();
                        // Keep navbar open so user can access second half if needed.
                    }
                } else {
                    // For any other top-level item, click it but do not close the navbar.
                    selectedItem.click();
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
                // In second-level mode, select the submenu link and close the navbar.
                secondNavItems[currentIndex].click();
                closeNavbar();
            } else if (key === 'd') {
                // D returns to top-level mode without closing the navbar.
                navLevel = 1;
                // Set currentIndex to Account.
                const accountIndex = topNavItems.indexOf(accountItem);
                currentIndex = accountIndex !== -1 ? accountIndex : 0;
                updateHighlight(topNavItems);
            }
        }
    });
});
