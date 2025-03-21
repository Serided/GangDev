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

document.addEventListener("DOMContentLoaded", function() {
    // NAVBAR ELEMENTS
    const hamburgerBtn = document.getElementById("hamburger");
    // All radio buttons in the menu
    const navRadios = Array.from(document.querySelectorAll('input[name="menu"]'));
    // Their clickable labels; assuming they have the class "hamburger-btn"
    const navLabels = Array.from(document.querySelectorAll(".hamburger-btn"));
    let currentNavIndex = 0;

    // SECTION ELEMENTS
    const sections = Array.from(document.querySelectorAll('.sect.cont'));

    // Mode flag: false = section navigation, true = navbar mode
    let inNavMode = false;

    // Update visual highlight on navbar items using a "selected" class
    function updateNavHighlight() {
        navLabels.forEach((label, index) => {
            if (index === currentNavIndex) {
                label.classList.add("selected");
            } else {
                label.classList.remove("selected");
            }
        });
    }

    // Section navigation: scroll smoothly to previous/next section
    function navigateSections(direction) {
        if (sections.length === 0) return;
        let currentSectionIndex = 0;
        let closest = Infinity;
        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            const diff = Math.abs(rect.top);
            if (diff < closest) {
                closest = diff;
                currentSectionIndex = index;
            }
        });
        if (direction === "up" && currentSectionIndex > 0) {
            sections[currentSectionIndex - 1].scrollIntoView({ behavior: "smooth" });
        } else if (direction === "down" && currentSectionIndex < sections.length - 1) {
            sections[currentSectionIndex + 1].scrollIntoView({ behavior: "smooth" });
        }
    }

    // Open navbar: check hamburger and switch mode
    function openNavbar() {
        hamburgerBtn.checked = true;
        inNavMode = true;
        // Initialize nav selection (could be 0 or set to current if desired)
        currentNavIndex = 0;
        updateNavHighlight();
    }

    // Close navbar: uncheck hamburger and revert mode
    function closeNavbar() {
        hamburgerBtn.checked = false;
        inNavMode = false;
        navLabels.forEach(label => label.classList.remove("selected"));
    }

    // Listen for keydown events
    document.addEventListener("keydown", function(e) {
        // Ignore keys if an input or textarea is focused
        const activeEl = document.activeElement;
        if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")) return;

        const key = e.key.toLowerCase();
        if (!["a", "d", "w", "s"].includes(key)) return;

        e.preventDefault();

        // If navbar is not open (section mode)
        if (!inNavMode) {
            if (key === "a") {
                // Open the navbar and switch mode
                openNavbar();
                return;
            } else if (key === "w" || key === "s") {
                navigateSections(key === "w" ? "up" : "down");
                return;
            }
        } else {
            // When navbar is open (navbar mode)
            if (key === "w") {
                // Cycle up
                currentNavIndex = (currentNavIndex - 1 + navRadios.length) % navRadios.length;
                updateNavHighlight();
            } else if (key === "s") {
                // Cycle down
                currentNavIndex = (currentNavIndex + 1) % navRadios.length;
                updateNavHighlight();
            } else if (key === "a") {
                // "A" selects the current link: simulate click on corresponding label
                navLabels[currentNavIndex].click();
                // Optionally close navbar after selection:
                closeNavbar();
            } else if (key === "d") {
                // "D" closes the navbar without selecting
                closeNavbar();
            }
        }
    });
});
