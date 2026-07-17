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
    let scrollRAF = null;

    function scrollLoop() {
        if (scrollDir !== 0) {
            window.scrollBy(0, scrollDir * SCROLL_SPEED);
            scrollRAF = requestAnimationFrame(scrollLoop);
        }
    }

    // W/S button visibility based on scroll position
    function updateScrollBtns() {
        const atTop = window.scrollY <= 5;
        const atBottom = (window.innerHeight + window.scrollY) >= (document.body.scrollHeight - 5);

        if (upBtn) { upBtn.style.opacity = atTop ? '0.25' : '1'; upBtn.style.pointerEvents = atTop ? 'none' : 'auto'; }
        if (downBtn) { downBtn.style.opacity = atBottom ? '0.25' : '1'; downBtn.style.pointerEvents = atBottom ? 'none' : 'auto'; }
    }

    // Force-show initially and update on scroll
    if (upBtn) { upBtn.style.opacity = '0.25'; upBtn.style.pointerEvents = 'none'; }
    if (downBtn) { downBtn.style.opacity = '1'; downBtn.style.pointerEvents = 'auto'; }
    window.addEventListener('scroll', updateScrollBtns);
    updateScrollBtns();

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
    }, true); // <-- capture phase

    document.addEventListener('keyup', (e) => {
        const key = e.key.toLowerCase();
        if (key === 'w' || key === 'arrowup') { heldKeys.delete('w'); scrollDir = 0; }
        if (key === 's' || key === 'arrowdown') { heldKeys.delete('s'); scrollDir = 0; }
        if (key === 'a' || key === 'arrowleft') { heldKeys.delete('a'); }
        if (key === 'd' || key === 'arrowright') { heldKeys.delete('d'); }
    }, true); // <-- capture phase

    // === PRODUCT BLOCK CLICK ===
    document.querySelectorAll('.productBlock[data-href]').forEach(block => {
        block.addEventListener('click', () => {
            window.open(block.dataset.href, '_blank');
        });
    });

    // === HAMBURGER LIVE COLOR SHIFT ===
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        function updateHamburgerColor() {
            // Don't shift when menu is open
            const input = hamburger.querySelector('input');
            if (input && input.checked) return;

            // Sample the element directly behind the hamburger
            const rect = hamburger.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;

            // Temporarily hide hamburger, sample background
            hamburger.style.visibility = 'hidden';
            const el = document.elementFromPoint(cx, cy);
            hamburger.style.visibility = '';

            if (el) {
                const bg = getComputedStyle(el).backgroundColor;
                const match = bg.match(/\d+/g);
                if (match) {
                    const [r, g, b] = match.map(Number);
                    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                    hamburger.style.setProperty('--foreground', luminance < 0.5 ? 'white' : '#333');
                }
            }
        }

        window.addEventListener('scroll', updateHamburgerColor);
        updateHamburgerColor();
    }
})();
