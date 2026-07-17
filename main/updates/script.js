(() => {
    const slides = Array.from(document.querySelectorAll('.slide'));
    const arrowLeft = document.getElementById('arrowLeft');
    const arrowRight = document.getElementById('arrowRight');
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

    // === A/D KEYBOARD (capture phase — intercepts before navbar.js uses A for hamburger) ===
    const heldKeys = new Set();

    document.addEventListener('keydown', (e) => {
        if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) return;

        const key = e.key.toLowerCase();

        if (['a', 'd', 'arrowleft', 'arrowright'].includes(key)) {
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
    }, true);

    document.addEventListener('keyup', (e) => {
        const key = e.key.toLowerCase();
        if (key === 'a' || key === 'arrowleft') { heldKeys.delete('a'); }
        if (key === 'd' || key === 'arrowright') { heldKeys.delete('d'); }
    }, true);

    // === PRODUCT BLOCK CLICK ===
    document.querySelectorAll('.productBlock[data-href]').forEach(block => {
        block.addEventListener('click', () => {
            window.open(block.dataset.href, '_blank');
        });
    });
})();
