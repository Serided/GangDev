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
    // NAVBAR VARIABLES
    const hamburger = document.getElementById("hamburger");
    const navItems = Array.from(document.querySelectorAll(".hamburger-btn"));
    let currentNavIndex = 0;

    // SECTION VARIABLES (for when navbar is closed)
    const sections = Array.from(document.querySelectorAll('.sect.cont'));

    // Update the visual highlight for the navbar items
    function updateNavHighlight() {
        navItems.forEach((item, index) => {
            if (index === currentNavIndex) {
                item.classList.add("selected");
            } else {
                item.classList.remove("selected");
            }
        });
    }

    // SECTION NAVIGATION: finds the section nearest to the top of viewport
    function navigateSections(direction) {
        if (sections.length === 0) return;
        let currentIndex = 0;
        let closest = Infinity;
        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            const diff = Math.abs(rect.top);
            if (diff < closest) {
                closest = diff;
                currentIndex = index;
            }
        });
        if (direction === "up" && currentIndex > 0) {
            sections[currentIndex - 1].scrollIntoView({ behavior: "smooth" });
        } else if (direction === "down" && currentIndex < sections.length - 1) {
            sections[currentIndex + 1].scrollIntoView({ behavior: "smooth" });
        }
    }

    document.addEventListener("keydown", function (e) {
        // Ignore if focus is on an input or textarea.
        const activeEl = document.activeElement;
        if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")) return;

        const key = e.key.toLowerCase();
        if (!["w", "s", "a", "d"].includes(key)) return;

        // If navbar is open (hamburger checkbox is checked)
        if (hamburger && hamburger.checked) {
            if (key === "w") {
                // Navigate up the navbar items
                currentNavIndex = (currentNavIndex - 1 + navItems.length) % navItems.length;
                updateNavHighlight();
            } else if (key === "s") {
                // Navigate down the navbar items
                currentNavIndex = (currentNavIndex + 1) % navItems.length;
                updateNavHighlight();
            } else if (key === "a") {
                // "A" selects the currently highlighted nav item
                navItems[currentNavIndex].click();
            } else if (key === "d") {
                // "D" closes the navbar
                hamburger.checked = false;
                // Clear any visual highlighting
                navItems.forEach(item => item.classList.remove("selected"));
            }
        } else {
            // Navbar is closed, so use section navigation:
            if (key === "w") {
                navigateSections("up");
            } else if (key === "s") {
                navigateSections("down");
            }
            // "a" and "d" do nothing in section navigation mode.
        }
    });
});