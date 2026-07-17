(() => {
    const slides = Array.from(document.querySelectorAll('.slide'));
    const arrow = document.getElementById('navArrow');
    if (!slides.length || !arrow) return;

    let index = 0;

    const show = (i) => {
        slides.forEach(s => s.classList.remove('active'));
        slides[i].classList.add('active');

        // Update arrow direction and visibility
        if (i === 0 && slides.length > 1) {
            // On first slide — show right arrow (D) to go to older
            arrow.className = 'navArrow right';
            arrow.querySelector('.arrowKey').textContent = 'D';
        } else if (i === slides.length - 1) {
            // On last slide — show left arrow (A) to go back to newer
            arrow.className = 'navArrow left';
            arrow.querySelector('.arrowKey').textContent = 'A';
        } else {
            // Middle — show right arrow (go older)
            arrow.className = 'navArrow right';
            arrow.querySelector('.arrowKey').textContent = 'D';
        }

        // Hide arrow if only one slide
        if (slides.length <= 1) {
            arrow.classList.add('hidden');
        }
    };

    arrow.addEventListener('click', () => {
        if (arrow.classList.contains('right')) {
            index = (index + 1) % slides.length;
        } else {
            index = (index - 1 + slides.length) % slides.length;
        }
        show(index);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Keyboard nav
    document.addEventListener('keydown', (e) => {
        if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') {
            if (index < slides.length - 1) {
                index++;
                show(index);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } else if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') {
            if (index > 0) {
                index--;
                show(index);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    });

    show(0);
})();
