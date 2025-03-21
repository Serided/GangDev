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

    // Define top-level items explicitly.
    // Adjust selectors as necessary.
    const homeItem = { key: 'home', element: document.querySelector('a[href="https://gangdev.co/"] button') };
    const accountItem = { key: 'account', element: document.querySelector('label[for="account"]') };
    const modsItem = { key: 'mods', element: document.querySelector('label[for="mods"]') };
    const appsItem = { key: 'apps', element: document.querySelector('label[for="apps"]') };
    const gamesItem = { key: 'games', element: document.querySelector('label[for="games"]') };
    const aboutItem = { key: 'about', element: document.querySelector('label[for="about"]') };
    const contactItem = { key: 'contact', element: document.querySelector('label[for="contact"]') };

    // Define your desired order.
    // For example, if you want Home then Account then the rest:
    const topMenuOrder = [ homeItem, accountItem, modsItem, appsItem, gamesItem, aboutItem, contactItem ];

    // Define submenu orders for each top-level that has one.
    // For demonstration, here's one for Account.
    const submenuOrders = {
        account: [
            { key: 'accountLink', element: document.querySelector('aside.sidebar.two nav a[href="http://account.gangdev.co"]') },
            { key: 'leaderboard', element: document.querySelector('aside.sidebar.two nav a[href="#"]') },
            { key: 'signout', element: document.querySelector('aside.sidebar.two nav a[href="https://account.gangdev.co/login/signout.php"]') }
        ]
        // You can add similar arrays for other top-level items if they have submenus.
    };

    // For section navigation (when navbar is closed)
    const sections = Array.from(document.querySelectorAll('.sect.cont'));

    // ----- STATE VARIABLES -----
    let inNavMode = false; // false = section navigation; true = navbar mode.
    let navLevel = 1;      // 1 = top-level, 2 = submenu.
    let currentIndex = 0;  // index in the current array (topMenuOrder or submenuOrders for the active key)

    // ----- HELPER FUNCTIONS -----

    // Return the active submenu items array, if available.
    function getActiveSubmenu() {
        // Use the key of the currently selected top-level item.
        const activeKey = topMenuOrder[currentIndex].key;
        if (submenuOrders.hasOwnProperty(activeKey)) {
            return submenuOrders[activeKey];
        }
        return [];
    }

    // Update visual highlight on a given menu array.
    function updateHighlight(menuArray) {
        menuArray.forEach((item, idx) => {
            if (idx === currentIndex) {
                item.element.classList.add('selected');
            } else {
                item.element.classList.remove('selected');
            }
        });
    }

    // Clear highlighting for a menu array.
    function clearHighlight(menuArray) {
        menuArray.forEach(item => item.element.classList.remove('selected'));
    }

    // Section navigation (when navbar is closed)
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

    // Open the navbar: set mode to top-level and highlight the default (Home).
    function openNavbar() {
        hamburger.checked = true;
        inNavMode = true;
        navLevel = 1;
        // Set default to Home. (If Home is first in our array, then currentIndex = 0.)
        currentIndex = 0;
        updateHighlight(topMenuOrder);
    }

    // Close the navbar.
    function closeNavbar() {
        hamburger.checked = false;
        inNavMode = false;
        navLevel = 1;
        currentIndex = 0;
        clearHighlight(topMenuOrder);
        // Also clear submenu highlighting if any.
        Object.values(submenuOrders).forEach(menu => clearHighlight(menu));
    }

    // ----- KEYBOARD HANDLING -----
    document.addEventListener('keydown', function (e) {
        // Skip if focus is in an input/textarea.
        if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) return;
        const key = e.key.toLowerCase();
        if (!['a', 'd', 'w', 's'].includes(key)) return;
        e.preventDefault();

        // If navbar is closed, A opens it; W/S navigate sections.
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
                currentIndex = (currentIndex - 1 + topMenuOrder.length) % topMenuOrder.length;
                updateHighlight(topMenuOrder);
            } else if (key === 's') {
                currentIndex = (currentIndex + 1) % topMenuOrder.length;
                updateHighlight(topMenuOrder);
            } else if (key === 'a') {
                // If selected item is Home, select it and close.
                if (topMenuOrder[currentIndex].key === 'home') {
                    topMenuOrder[currentIndex].element.click();
                    closeNavbar();
                } else {
                    // Check if the selected top-level item has a submenu.
                    const submenu = getActiveSubmenu();
                    if (submenu.length > 0) {
                        navLevel = 2;
                        currentIndex = 0;
                        updateHighlight(submenu);
                    } else {
                        // No submenu: click it and (for non-home items) keep the navbar open so user can later open submenu if needed.
                        topMenuOrder[currentIndex].element.click();
                    }
                }
            } else if (key === 'd') {
                // D closes the navbar.
                closeNavbar();
            }
        } else if (navLevel === 2) {
            // Second-level mode.
            const submenu = getActiveSubmenu();
            if (submenu.length === 0) {
                navLevel = 1;
                currentIndex = 0;
                updateHighlight(topMenuOrder);
                return;
            }
            if (key === 'w') {
                currentIndex = (currentIndex - 1 + submenu.length) % submenu.length;
                updateHighlight(submenu);
            } else if (key === 's') {
                currentIndex = (currentIndex + 1) % submenu.length;
                updateHighlight(submenu);
            } else if (key === 'a') {
                submenu[currentIndex].click();
                closeNavbar();
            } else if (key === 'd') {
                // Return to top-level mode.
                navLevel = 1;
                // Set currentIndex to the index of the "account" item.
                currentIndex = topMenuOrder.findIndex(item => item.key === 'account');
                if (currentIndex === -1) currentIndex = 0;
                updateHighlight(topMenuOrder);
            }
        }
    });
});
