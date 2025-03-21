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

document.addEventListener('keydown', function(e) {
    // Ignore if user is typing in an input/textarea or if modifier keys are active.
    const activeEl = document.activeElement;
    if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) return;
    if (e.altKey || e.ctrlKey || e.metaKey) return;

    // Get all sections that are important (with .sect.cont)
    const sections = Array.from(document.querySelectorAll('.sect.cont'));
    if (sections.length === 0) return;

    // Find the section whose top is closest to the top of the viewport
    let currentIndex = 0;
    let closest = Infinity;
    sections.forEach((section, i) => {
        const rect = section.getBoundingClientRect();
        const diff = Math.abs(rect.top);
        if (diff < closest) {
            closest = diff;
            currentIndex = i;
        }
    });

    // Handle key presses: "w" for up, "s" for down
    if (e.key.toLowerCase() === 'w' && currentIndex > 0) {
        sections[currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
    } else if (e.key.toLowerCase() === 's' && currentIndex < sections.length - 1) {
        sections[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
    }
});
