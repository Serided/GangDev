document.addEventListener('DOMContentLoaded', function() {
    if (typeof backgrounds === 'undefined' || !backgrounds.length) {
        console.error('No backgrounds found:', backgrounds);
        return;
    }

    let entryDiv = document.querySelector('.sect.cont.entry')
    if (!entryDiv) {
        console.error('Entry element not found.');
        return;
    }

    let bgWrapper = entryDiv.querySelector('.bgWrapper');
    if (!bgWrapper) {
        console.error('bgWrapper not found.')
        return;
    }

    //let defaultIndex = Math.floor(Math.random() * backgrounds.length);
    //entryDiv.style.backgroundImage = "url('" + backgrounds[defaultIndex] + "')"

    function changeBackground() {
        let randomIndex = Math.floor(Math.random() * backgrounds.length);
        let newBgURL = backgrounds[randomIndex];

        let img = new Image();
        img.src = newBgURL;
        img.onload = function() {
            let newBg = document.createElement('div');
            newBg.className = 'background';
            newBg.style.backgroundImage = "url('" + newBgURL + "')"

            bgWrapper.appendChild(newBg);
            newBg.offsetWidth;
            newBg.classList.add('visible');

            let oldBgs = bgWrapper.querySelectorAll('.background.visible');
            if (oldBgs.length > 1) {
                setTimeout(function() {
                    oldBgs.forEach(function(bg, index) {
                        if (index < oldBgs.length - 1) {
                            bg.remove();
                        }
                    });
                }, 1000);
            }
        };

        img.onerror = function() {
            console.error("Failed to load background image: " + newBgURL)
        }
    }

    changeBackground();
    setInterval(changeBackground, (30 * 1000));
});

document.addEventListener('DOMContentLoaded', function () {
    // --- ELEMENTS ---
    const hamburger = document.getElementById('hamburger');
    // Top-level radios for menu (e.g. account, mods, apps, etc.)
    const topRadios = Array.from(document.querySelectorAll('input[name="menu"]'));
    // Top-level labels: account-btn and hamburger-btn with "btnText one" classes.
    const topLabels = Array.from(document.querySelectorAll('label[for]')).filter(label =>
        (label.classList.contains('btnText') && label.classList.contains('one')) ||
        label.classList.contains('account-btn')
    );

    // Sections for page navigation when navbar is closed.
    const sections = Array.from(document.querySelectorAll('.sect.cont'));

    // Mode flag: false = section navigation; true = navbar navigation.
    let inNavMode = false;
    // Index for current selection in the active menu.
    let currentIndex = 0;

    // --- HELPER FUNCTIONS ---

    // Get second-level nav items for the active top-level menu, if any.
    function getSecondLevelNav() {
        const activeRadio = document.querySelector('input[name="menu"]:checked');
        if (activeRadio) {
            // Look for the next sibling aside with class "sidebar two".
            let sibling = activeRadio.nextElementSibling;
            while (sibling && !sibling.classList.contains('sidebar')) {
                sibling = sibling.nextElementSibling;
            }
            if (sibling && sibling.classList.contains('two') && sibling.style.opacity !== "0") {
                // Return all <a> elements inside its nav.
                return Array.from(sibling.querySelectorAll('nav a'));
            }
        }
        return [];
    }

    // Update visual highlight for current nav items.
    function updateHighlight(navItems) {
        navItems.forEach((item, idx) => {
            if (idx === currentIndex) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
    }

    // Clear any highlight.
    function clearHighlight() {
        topLabels.forEach(label => label.classList.remove('selected'));
        const secondNav = getSecondLevelNav();
        secondNav.forEach(link => link.classList.remove('selected'));
    }

    // Smoothly scroll to the section nearest the top.
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

    // Open the navbar (set it open and switch to navbar mode).
    function openNavbar() {
        hamburger.checked = true;
        inNavMode = true;
        currentIndex = 0; // start with first top-level item
        updateHighlight(topLabels);
    }

    // Close the navbar and return to section mode.
    function closeNavbar() {
        hamburger.checked = false;
        inNavMode = false;
        clearHighlight();
    }

    // --- KEYBOARD NAVIGATION HANDLING ---
    document.addEventListener('keydown', function (e) {
        // Ignore key events if focus is in an input or textarea.
        const activeEl = document.activeElement;
        if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) return;

        const key = e.key.toLowerCase();
        if (!['a', 'd', 'w', 's'].includes(key)) return;
        e.preventDefault();

        // If navbar is closed, use section navigation:
        if (!inNavMode) {
            if (key === 'a') {
                openNavbar();
                return;
            } else if (key === 'w') {
                navigateSections('up');
            } else if (key === 's') {
                navigateSections('down');
            }
            return;
        }

        // Navbar is open: determine which set of nav items to use.
        let navItems = getSecondLevelNav();
        if (!navItems || navItems.length === 0) {
            navItems = topLabels;
        }

        if (key === 'w') {
            currentIndex = (currentIndex - 1 + navItems.length) % navItems.length;
            updateHighlight(navItems);
        } else if (key === 's') {
            currentIndex = (currentIndex + 1) % navItems.length;
            updateHighlight(navItems);
        } else if (key === 'a') {
            // "A" selects the current link:
            navItems[currentIndex].click();
            closeNavbar();
        } else if (key === 'd') {
            // "D" closes the navbar without selection.
            closeNavbar();
        }
    });
});
