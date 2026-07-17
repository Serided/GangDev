(() => {
    const slides = Array.from(document.querySelectorAll('.slide'));
    const arrow = document.getElementById('navArrow');
    if (!slides.length || !arrow) return;

    let index = 0;

    const show = (i) => {
        slides.forEach(s => s.classList.remove('active'));
        slides[i].classList.add('active');

        // Update arrow direction
        if (i === 0) {
            // On newest — arrow points right (go to older)
            arrow.className = 'navArrow right';
            arrow.querySelector('.arrowKey').textContent = '›';
        } else if (i === slides.length - 1) {
            // On oldest — arrow points left (go to newer)
            arrow.className = 'navArrow left';
            arrow.querySelector('.arrowKey').textContent = '‹';
        }

        if (slides.length <= 1) {
            arrow.classList.add('hidden');
        }
    };

    arrow.addEventListener('click', () => {
        if (arrow.classList.contains('right')) {
            index = Math.min(index + 1, slides.length - 1);
        } else {
            index = Math.max(index - 1, 0);
        }
        show(index);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    show(0);
})();
