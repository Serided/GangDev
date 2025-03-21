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
    // --- ELEMENTS ---
    const hamburger = document.getElementById('hamburger');

    // Collect top-level nav items: we include account button (label with class account-btn) and all buttons in anchors with classes "hamburger-btn btnText one"
    let topNavItems = Array.from(document.querySelectorAll('.hNavbar .account-btn.btnText, .hNavbar a > button.hamburger-btn.btnText.one'));

    // Ensure the order is as desired.
    // For instance, force Home to be first if present.
    const homeItem = topNavItems.find(item => item.textContent.trim().toLowerCase() === "home");
    if (homeItem) {
        topNavItems = topNavItems.filter(item => item !== homeItem);
        topNavItems.unshift(homeItem);
    }

    // For section navigation (when navbar is closed)
    const sections = Array.from(document.querySelectorAll('.sect.cont'));

    // --- STATE VARIABLES ---
    let inNavMode = false; // false: section nav mode; true: navbar nav mode.
    let navLevel = 1;      // 1 = top-level; 2 = second-level.
    let currentIndex = 0;  // Index within current nav array.

    // --- HELPER FUNCTIONS ---

    // Returns an array of second-level nav items (links) for the active top-level menu, if available.
    function getSecondLevelNav() {
        // We're only interested in second-level if the current top-level item is Account.
        // Assume the Account button text contains "account" (case-insensitive).
        if (topNavItems[currentIndex] && topNavItems[currentIndex].textContent.toLowerCase().includes('account')) {
            // Find the radio input for account (if it exists) and then its sibling sidebar.
            const accountRadio = document.getElementById('account');
            if (accountRadio) {
                let sibling = accountRadio.nextElementSibling;
                while (sibling && !sibling.classList.contains('sidebar')) {
                    sibling = sibling.nextElementSibling;
                }
                if (sibling && sibling.classList.contains('two') && sibling.style.opacity !== "0") {
                    // Return all <a> links within this sidebar.
                    return Array.from(sibling.querySelectorAll('nav a'));
                }
            }
        }
        return [];
    }

    // Update visual highlight for current nav items.
    function updateHighlight(navArray) {
        navArray.forEach((item, idx) => {
            if (idx === currentIndex) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
    }

    // Clear all highlighting.
    function clearHighlight() {
        topNavItems.forEach(item => item.classList.remove('selected'));
        const secondNav = getSecondLevelNav();
        secondNav.forEach(item => item.classList.remove('selected'));
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

    // Open navbar: mark as open and switch mode.
    function openNavbar() {
        hamburger.checked = true;
        inNavMode = true;
        navLevel = 1;
        // Start with Home (already forced to index 0 if found)
        currentIndex = 0;
        updateHighlight(topNavItems);
    }

    // Close navbar and return to section navigation.
    function closeNavbar() {
        hamburger.checked = false;
        inNavMode = false;
        navLevel = 1;
        currentIndex = 0;
        clearHighlight();
    }

    // --- KEYBOARD EVENT HANDLER ---
    document.addEventListener('keydown', function (e) {
        // Ignore key events if focus is in an input or textarea.
        const activeEl = document.activeElement;
        if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) return;

        const key = e.key.toLowerCase();
        if (!['a', 'd', 'w', 's'].includes(key)) return;
        e.preventDefault();

        // If navbar is closed, then:
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

        // If navbar is open:
        if (navLevel === 1) {
            // Top-level mode
            if (key === 'w') {
                currentIndex = (currentIndex - 1 + topNavItems.length) % topNavItems.length;
                updateHighlight(topNavItems);
            } else if (key === 's') {
                currentIndex = (currentIndex + 1) % topNavItems.length;
                updateHighlight(topNavItems);
            } else if (key === 'a') {
                // If the selected top-level item is Home, click it and close.
                const selectedText = topNavItems[currentIndex].textContent.trim().toLowerCase();
                if (selectedText === 'home') {
                    topNavItems[currentIndex].click();
                    closeNavbar();
                } else if (selectedText.includes('account')) {
                    // If it's the Account button, switch to second-level mode.
                    const secondNavItems = getSecondLevelNav();
                    if (secondNavItems.length > 0) {
                        navLevel = 2;
                        currentIndex = 0; // reset index for second-level items
                        updateHighlight(secondNavItems);
                    } else {
                        // No submenu; click the top-level item.
                        topNavItems[currentIndex].click();
                        closeNavbar();
                    }
                } else {
                    // For other items without submenu, simply click and close.
                    topNavItems[currentIndex].click();
                    closeNavbar();
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
                // Select second-level link.
                secondNavItems[currentIndex].click();
                closeNavbar();
            } else if (key === 'd') {
                // Return to top-level mode without closing the navbar.
                navLevel = 1;
                // Set current index to Account (if found in topNavItems) so user sees where they came from.
                const accountIndex = topNavItems.findIndex(item => item.textContent.trim().toLowerCase().includes('account'));
                currentIndex = (accountIndex !== -1) ? accountIndex : 0;
                updateHighlight(topNavItems);
            }
        }
    });
});
