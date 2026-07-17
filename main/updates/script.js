(() => {
    const slides = Array.from(document.querySelectorAll('.slide'));
    const arrowLeft = document.getElementById('arrowLeft');
    const arrowRight = document.getElementById('arrowRight');
    const upBtn = document.getElementById('upBtn');
    const downBtn = document.getElementById('downBtn');
    if (!slides.length) return;

    let index = 0;

    // === SLIDE NAVIGATION (A/D arrows) ===
    const show = (i) => {
        slides.forEach(s => s.classList.remove('active'));
        slides[i].classList.add('active');
        updateArrows();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const updateArrows = () => {
        if (arrowLeft) arrowLeft.style.opacity = index > 0 ? '1' : '0.25';
        if (arrowLeft) arrowLeft.style.pointerEvents = index > 0 ? 'auto' : 'none';
        if (arrowRight) arrowRight.style.opacity = index < slides.length - 1 ? '1' : '0.25';
        if (arrowRight) arrowRight.style.pointerEvents = index < slides.length - 1 ? 'auto' : 'none';
    };

    if (arrowLeft) {
        arrowLeft.addEventListener('click', () => {
            if (index > 0) { index--; show(index); }
        });
    }
    if (arrowRight) {
        arrowRight.addEventListener('click', () => {
            if (index < slides.length - 1) { index++; show(index); }
        });
    }

    show(0);

    // === W/S SMOOTH SCROLL ===
    const SCROLL_SPEED = 8;
    let scrollDir = 0;

    function scrollLoop() {
        if (scrollDir !== 0) {
            window.scrollBy(0, scrollDir * SCROLL_SPEED);
            requestAnimationFrame(scrollLoop);
        }
    }

    // W/S button visibility based on scroll position
    function updateScrollBtns() {
        const atTop = window.scrollY <= 5;
        const atBottom = (window.innerHeight + window.scrollY) >= (document.body.scrollHeight - 5);

        if (upBtn) { upBtn.style.opacity = atTop ? '0.25' : '1'; upBtn.style.pointerEvents = atTop ? 'none' : 'auto'; }
        if (downBtn) { downBtn.style.opacity = atBottom ? '0.25' : '1'; downBtn.style.pointerEvents = atBottom ? 'none' : 'auto'; }
    }

    // Force-show W/S buttons — navbar.js hides them because no .sect.cont exists.
    // Use setTimeout to ensure this runs AFTER navbar.js DOMContentLoaded handler.
    function forceShowBtns() {
        if (upBtn) { upBtn.style.display = 'flex'; }
        if (downBtn) { downBtn.style.display = 'flex'; }
        updateScrollBtns();
    }
    setTimeout(forceShowBtns, 50);
    setTimeout(forceShowBtns, 200); // double-ensure after any async

    window.addEventListener('scroll', updateScrollBtns);

    // Mouse hold on W/S buttons for smooth scroll
    if (upBtn) {
        upBtn.addEventListener('mousedown', () => { scrollDir = -1; scrollLoop(); });
        upBtn.addEventListener('mouseup', () => { scrollDir = 0; });
        upBtn.addEventListener('mouseleave', () => { scrollDir = 0; });
    }
    if (downBtn) {
        downBtn.addEventListener('mousedown', () => { scrollDir = 1; scrollLoop(); });
        downBtn.addEventListener('mouseup', () => { scrollDir = 0; });
        downBtn.addEventListener('mouseleave', () => { scrollDir = 0; });
    }

    // === KEYBOARD — capture phase to intercept before navbar.js ===
    const heldKeys = new Set();

    document.addEventListener('keydown', (e) => {
        if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) return;

        const key = e.key.toLowerCase();

        if (['a', 'd', 'w', 's', 'arrowleft', 'arrowright', 'arrowup', 'arrowdown'].includes(key)) {
            e.stopImmediatePropagation();
            e.stopPropagation();
            e.preventDefault();
        }

        if ((key === 'a' || key === 'arrowleft') && !heldKeys.has('a')) {
            heldKeys.add('a');
            if (index > 0) { index--; show(index); }
        }
        if ((key === 'd' || key === 'arrowright') && !heldKeys.has('d')) {
            heldKeys.add('d');
            if (index < slides.length - 1) { index++; show(index); }
        }
        if ((key === 'w' || key === 'arrowup') && !heldKeys.has('w')) {
            heldKeys.add('w');
            scrollDir = -1;
            scrollLoop();
        }
        if ((key === 's' || key === 'arrowdown') && !heldKeys.has('s')) {
            heldKeys.add('s');
            scrollDir = 1;
            scrollLoop();
        }
    }, true);

    document.addEventListener('keyup', (e) => {
        const key = e.key.toLowerCase();
        if (key === 'w' || key === 'arrowup') { heldKeys.delete('w'); scrollDir = 0; }
        if (key === 's' || key === 'arrowdown') { heldKeys.delete('s'); scrollDir = 0; }
        if (key === 'a' || key === 'arrowleft') { heldKeys.delete('a'); }
        if (key === 'd' || key === 'arrowright') { heldKeys.delete('d'); }
    }, true);

    // === PRODUCT BLOCK CLICK ===
    document.querySelectorAll('.productBlock[data-href]').forEach(block => {
        block.addEventListener('click', () => {
            window.open(block.dataset.href, '_blank');
        });
    });

    // === HAMBURGER LIVE COLOR SHIFT ===
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        const input = hamburger.querySelector('input');

        function updateHamburgerColor() {
            // Don't shift when menu is open
            if (input && input.checked) return;

            // Check what's behind the hamburger
            const rect = hamburger.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;

            hamburger.style.visibility = 'hidden';
            const el = document.elementFromPoint(cx, cy);
            hamburger.style.visibility = '';

            if (!el) {
                hamburger.style.setProperty('--foreground', 'white');
                return;
            }

            // Walk up to find actual background color
            let bgColor = null;
            let current = el;
            while (current && current !== document.documentElement) {
                const bg = getComputedStyle(current).backgroundColor;
                const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
                if (match) {
                    const [_, r, g, b] = match;
                    // Skip transparent (0,0,0,0) or fully transparent
                    const a = bg.includes('rgba') ? parseFloat(bg.split(',')[3]) : 1;
                    if (a > 0.1 && !(+r === 0 && +g === 0 && +b === 0 && a < 0.5)) {
                        bgColor = [+r, +g, +b];
                        break;
                    }
                }
                current = current.parentElement;
            }

            // Default to page background if nothing found
            if (!bgColor) bgColor = [29, 58, 77]; // #1D3A4D

            const luminance = (0.299 * bgColor[0] + 0.587 * bgColor[1] + 0.114 * bgColor[2]) / 255;
            hamburger.style.setProperty('--foreground', luminance < 0.45 ? 'white' : '#333');
        }

        window.addEventListener('scroll', updateHamburgerColor);
        updateHamburgerColor();
        setTimeout(updateHamburgerColor, 100);
    }
})();
