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

    // Manually define top-level items in order.
    const accountItem = document.querySelector('label[for="account"]');
    const homeItem = document.querySelector('a[href="https://gangdev.co/"] button');
    const modsItem = document.querySelector('label[for="mods"]');
    const appsItem = document.querySelector('label[for="apps"]');
    const gamesItem = document.querySelector('label[for="games"]');
    const aboutItem = document.querySelector('label[for="about"]');
    const contactItem = document.querySelector('label[for="contact"]');

    const topNavItems = [homeItem, accountItem, modsItem, appsItem, gamesItem, aboutItem, contactItem];

    // For section navigation when navbar is closed.
    const sections = Array.from(document.querySelectorAll('.sect.cont'));

    // ----- STATE VARIABLES -----
    let inNavMode = false;  // false = section navigation; true = navbar navigation.
    let navLevel = 1;       // 1 = top-level; 2 = second-level.
    let currentIndex = 0;   // index within the current menu.

    // ----- HELPER FUNCTIONS -----
    // Get the second-level navigation items for the active top-level menu.
    function getSecondLevelNav() {
        // Look for the active radio (or account element) based on the current top-level selection.
        // We assume the active top-level item is the one at currentIndex.
        // Find its associated sidebar: look for the radio input with id equal to the lowercased text of that item (or for account, id="account").
        // For simplicity, we assume that if the selected top-level item's text includes "account", its submenu exists.
        const activeText = topNavItems[currentIndex] ? topNavItems[currentIndex].textContent.trim().toLowerCase() : '';
        if (activeText.includes('account')) {
            // Get the sidebar associated with the account radio.
            const accountRadio = document.getElementById('account');
            if (accountRadio) {
                let sibling = accountRadio.nextElementSibling;
                while (sibling && !(sibling.tagName.toLowerCase() === 'aside' && sibling.classList.contains('two'))) {
                    sibling = sibling.nextElementSibling;
                }
                if (sibling) {
                    return Array.from(sibling.querySelectorAll('nav a'));
                }
            }
        }
        // For other top-level items, if they have submenus, use a similar pattern.
        // You could generalize here if needed. For now, we only handle Account.
        return [];
    }

    // Update visual highlight on a given array of items.
    function updateHighlight(items) {
        items.forEach((item, idx) => {
            if (idx === currentIndex) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
    }

    // Clear all highlighting.
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

    // Open the navbar: set to navbar mode (top-level) and highlight starting item.
    function openNavbar() {
        hamburger.checked = true;
        inNavMode = true;
        navLevel = 1;
        // Start on Home (we forced homeItem to be first in our array).
        currentIndex = 0;
        updateHighlight(topNavItems);
    }

    // Close the navbar and return to section navigation mode.
    function closeNavbar() {
        hamburger.checked = false;
        inNavMode = false;
        navLevel = 1;
        currentIndex = 0;
        clearHighlight();
    }

    // ----- KEYBOARD HANDLING -----
    document.addEventListener('keydown', function (e) {
        // Ignore if focus is in an input or textarea.
        if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
            return;
        }
        const key = e.key.toLowerCase();
        if (!['a', 'd', 'w', 's'].includes(key)) return;
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
                const selectedText = selectedItem.textContent.trim().toLowerCase();
                if (selectedText === 'home') {
                    // For Home: select and close.
                    selectedItem.click();
                    closeNavbar();
                } else if (selectedText.includes('account')) {
                    // For Account, if a submenu exists, switch to second-level mode.
                    const secondNav = getSecondLevelNav();
                    if (secondNav.length > 0) {
                        navLevel = 2;
                        currentIndex = 0;
                        updateHighlight(secondNav);
                    } else {
                        // If no submenu, simulate click but keep navbar open.
                        selectedItem.click();
                    }
                } else {
                    // For any other top-level item, simulate click and do NOT close the navbar.
                    selectedItem.click();
                    // (Remove the closeNavbar() call so the menu stays open.)
                }
            } else if (key === 'd') {
                // D closes the navbar.
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
                // In second-level mode, select the highlighted link and close the navbar.
                secondNavItems[currentIndex].click();
                closeNavbar();
            } else if (key === 'd') {
                // D returns to top-level mode (staying open).
                navLevel = 1;
                // Set currentIndex to the Account button.
                const accountIndex = topNavItems.indexOf(accountItem);
                currentIndex = (accountIndex !== -1) ? accountIndex : 0;
                updateHighlight(topNavItems);
            }
        }
    });
});