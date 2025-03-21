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

    // Define top-level items manually, in desired order.
    const accountItem = document.querySelector('label[for="account"]'); // Account
    const homeItem = document.querySelector('a[href="https://gangdev.co/"] button'); // Home
    const modsItem = document.querySelector('label[for="mods"]');  // Mods
    const appsItem = document.querySelector('label[for="apps"]');  // Apps
    const gamesItem = document.querySelector('label[for="games"]'); // Games
    const aboutItem = document.querySelector('label[for="about"]'); // About
    const contactItem = document.querySelector('label[for="contact"]'); // Contact

    // Array of top-level nav items in order.
    const topNavItems = [accountItem, homeItem, modsItem, appsItem, gamesItem, aboutItem, contactItem];

    // For the Account submenu, we assume its links are inside the sidebar following the account radio.
    const accountSubItems = Array.from(document.querySelectorAll('input#account ~ aside.sidebar.two nav a'));

    // Sections for when navbar is closed.
    const sections = Array.from(document.querySelectorAll('.sect.cont'));

    // ----- STATE VARIABLES -----
    let inNavMode = false; // false: section nav; true: navbar nav.
    let navLevel = 1;      // 1: top-level; 2: account submenu.
    let currentIndex = 0;  // index in current menu.

    // ----- HELPER FUNCTIONS -----

    // Update visual highlight on the given items array.
    function updateHighlight(items) {
        items.forEach((el, idx) => {
            if (idx === currentIndex) {
                el.classList.add('selected');
            } else {
                el.classList.remove('selected');
            }
        });
    }

    // Clear all highlights.
    function clearHighlight() {
        topNavItems.forEach(item => item && item.classList.remove('selected'));
        accountSubItems.forEach(item => item && item.classList.remove('selected'));
    }

    // Navigate page sections when navbar is closed.
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

    // Open the navbar: set mode to navbar navigation (top-level).
    function openNavbar() {
        hamburger.checked = true;
        inNavMode = true;
        navLevel = 1;
        // Start on Home: force homeItem to index 1 if not already first.
        // (We want Home to be first, so if it's not already, adjust.)
        const homeIndex = topNavItems.indexOf(homeItem);
        if (homeIndex !== -1) {
            currentIndex = homeIndex;
        } else {
            currentIndex = 0;
        }
        updateHighlight(topNavItems);
    }

    // Close the navbar: return to section navigation mode.
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
        if (!['a','d','w','s'].includes(key)) return;
        e.preventDefault();

        // If navbar is closed, use section navigation.
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
                const selectedText = selectedItem.textContent.trim().toLowerCase();
                if (selectedText === 'home') {
                    // If Home, select it and close navbar.
                    selectedItem.click();
                    closeNavbar();
                } else if (selectedText.includes('account')) {
                    // For Account, if submenu exists, switch to second-level mode.
                    if (accountSubItems.length > 0) {
                        navLevel = 2;
                        currentIndex = 0;
                        updateHighlight(accountSubItems);
                    } else {
                        selectedItem.click();
                        closeNavbar();
                    }
                } else {
                    // For any other top-level item, select and close.
                    selectedItem.click();
                    closeNavbar();
                }
            } else if (key === 'd') {
                // D closes navbar in top-level mode.
                closeNavbar();
            }
        } else if (navLevel === 2) {
            // Second-level mode (for Account submenu).
            if (key === 'w') {
                currentIndex = (currentIndex - 1 + accountSubItems.length) % accountSubItems.length;
                updateHighlight(accountSubItems);
            } else if (key === 's') {
                currentIndex = (currentIndex + 1) % accountSubItems.length;
                updateHighlight(accountSubItems);
            } else if (key === 'a') {
                // In second-level, selecting a link triggers click and closes navbar.
                accountSubItems[currentIndex].click();
                closeNavbar();
            } else if (key === 'd') {
                // D returns to top-level mode without closing navbar.
                navLevel = 1;
                // Set current index to Account button.
                const accountIndex = topNavItems.indexOf(accountItem);
                currentIndex = accountIndex !== -1 ? accountIndex : 0;
                updateHighlight(topNavItems);
            }
        }
    });
});

