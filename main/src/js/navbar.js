var hamburgerBtn = document.getElementById("hamburger");
var accountBtn = document.getElementById("account");
var productsBtn = document.getElementById("products");
var labsBtn = document.getElementById("labs");
var companyBtn = document.getElementById("company");

function uncheckAll() {
    if(!hamburgerBtn.checked && (
        accountBtn.checked === true ||
        productsBtn.checked === true ||
        labsBtn.checked === true ||
        companyBtn.checked === true
        )) {

        hamburgerBtn.checked = true;
        accountBtn.checked = false;
        productsBtn.checked = false;
        labsBtn.checked = false;
        companyBtn.checked = false;
    }
}

hamburgerBtn.addEventListener('click', uncheckAll)

document.addEventListener('DOMContentLoaded', function() {
    const sections = Array.from(document.querySelectorAll('.sect.cont'));
    const hamburger = document.getElementById('hamburger');
    const upBtn = document.getElementById('upBtn');
    const downBtn = document.getElementById('downBtn');

    const hasSections = sections.length > 1;

    // === SMOOTH SCROLL STATE (used when no sections) ===
    const SCROLL_SPEED = 8;
    let scrollDir = 0;

    function scrollLoop() {
        if (scrollDir !== 0) {
            window.scrollBy(0, scrollDir * SCROLL_SPEED);
            requestAnimationFrame(scrollLoop);
        }
    }

    // === SECTION MODE: jump between .sect.cont elements ===
    function getCurrentSectionIndex() {
        let currentIndex = 0;
        let closest = Infinity;
        sections.forEach((section, i) => {
            const diff = Math.abs(section.getBoundingClientRect().top);
            if (diff < closest) {
                closest = diff;
                currentIndex = i;
            }
        });
        return currentIndex;
    }

    // === BUTTON VISIBILITY ===
    function updateNavButtons() {
        if (hasSections) {
            // Section mode: hide at boundaries
            const currentIndex = getCurrentSectionIndex();
            upBtn.style.opacity = currentIndex > 0 ? '1' : '0.25';
            upBtn.style.pointerEvents = currentIndex > 0 ? 'auto' : 'none';
            downBtn.style.opacity = currentIndex < sections.length - 1 ? '1' : '0.25';
            downBtn.style.pointerEvents = currentIndex < sections.length - 1 ? 'auto' : 'none';
        } else {
            // Scroll mode: dim at scroll boundaries
            const atTop = window.scrollY <= 5;
            const atBottom = (window.innerHeight + window.scrollY) >= (document.body.scrollHeight - 5);
            upBtn.style.opacity = atTop ? '0.25' : '1';
            upBtn.style.pointerEvents = atTop ? 'none' : 'auto';
            downBtn.style.opacity = atBottom ? '0.25' : '1';
            downBtn.style.pointerEvents = atBottom ? 'none' : 'auto';
        }
    }

    window.addEventListener('scroll', updateNavButtons);
    updateNavButtons();

    // === BUTTON CLICK HANDLERS ===
    if (hasSections) {
        // Section jump on click
        upBtn.addEventListener('click', function() {
            const currentIndex = getCurrentSectionIndex();
            if (currentIndex > 0) {
                sections[currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
            }
        });
        downBtn.addEventListener('click', function() {
            const currentIndex = getCurrentSectionIndex();
            if (currentIndex < sections.length - 1) {
                sections[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
            }
        });
    } else {
        // Smooth scroll on hold
        upBtn.addEventListener('mousedown', function() { scrollDir = -1; scrollLoop(); });
        upBtn.addEventListener('mouseup', function() { scrollDir = 0; });
        upBtn.addEventListener('mouseleave', function() { scrollDir = 0; });
        downBtn.addEventListener('mousedown', function() { scrollDir = 1; scrollLoop(); });
        downBtn.addEventListener('mouseup', function() { scrollDir = 0; });
        downBtn.addEventListener('mouseleave', function() { scrollDir = 0; });
    }

    // === KEYBOARD ===
    document.addEventListener('keydown', function(e) {
        if (document.activeElement &&
            (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
            return;
        }

        let key = e.key.toLowerCase();
        if (key === 'arrowup') key = 'w';
        if (key === 'arrowdown') key = 's';
        if (key === 'arrowleft') key = 'a';

        if (!['a', 'w', 's'].includes(key)) return;
        e.preventDefault();

        if (key === 'a') {
            hamburger.checked = !hamburger.checked;
            return;
        }

        if (hamburger.checked) return;

        if (hasSections) {
            // Section jump
            const currentIndex = getCurrentSectionIndex();
            if (key === 'w' && currentIndex > 0) {
                sections[currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
            } else if (key === 's' && currentIndex < sections.length - 1) {
                sections[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            // Smooth scroll (hold key)
            if (key === 'w') { scrollDir = -1; scrollLoop(); }
            if (key === 's') { scrollDir = 1; scrollLoop(); }
        }
    });

    document.addEventListener('keyup', function(e) {
        let key = e.key.toLowerCase();
        if (key === 'arrowup') key = 'w';
        if (key === 'arrowdown') key = 's';
        if (key === 'w' || key === 's') { scrollDir = 0; }
    });

    // === HAMBURGER ADAPTIVE COLOR ===
    // On dark page backgrounds, hamburger bars should be white.
    // Detect page background luminance and adapt.
    function updateHamburgerColor() {
        if (hamburger.checked) return; // open state handled by CSS :has(input:checked)

        const rect = document.querySelector('.hamburger').getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        const hamburgerEl = document.querySelector('.hamburger');
        hamburgerEl.style.visibility = 'hidden';
        const el = document.elementFromPoint(cx, cy);
        hamburgerEl.style.visibility = '';

        if (!el) {
            hamburgerEl.style.setProperty('--foreground', 'white');
            return;
        }

        let bgColor = null;
        let current = el;
        while (current && current !== document.documentElement) {
            const bg = getComputedStyle(current).backgroundColor;
            const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            if (match) {
                const [_, r, g, b] = match;
                const a = bg.includes('rgba') ? parseFloat(bg.split(',')[3]) : 1;
                if (a > 0.1 && !(+r === 0 && +g === 0 && +b === 0 && a < 0.5)) {
                    bgColor = [+r, +g, +b];
                    break;
                }
            }
            current = current.parentElement;
        }

        if (!bgColor) {
            // Fallback: check body computed bg
            const bodyBg = getComputedStyle(document.body).backgroundColor;
            const m = bodyBg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            if (m) bgColor = [+m[1], +m[2], +m[3]];
            else bgColor = [255, 255, 255]; // assume white
        }

        const luminance = (0.299 * bgColor[0] + 0.587 * bgColor[1] + 0.114 * bgColor[2]) / 255;
        hamburgerEl.style.setProperty('--foreground', luminance < 0.45 ? 'white' : '#333');
    }

    window.addEventListener('scroll', updateHamburgerColor);
    updateHamburgerColor();
    setTimeout(updateHamburgerColor, 100);
});
