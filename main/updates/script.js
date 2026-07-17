(() => {
    const sections = document.querySelectorAll('.productSection');

    sections.forEach(section => {
        const cards = Array.from(section.querySelectorAll('.updateCard'));
        const countEl = section.querySelector('.carouselCount');
        const prevBtn = section.querySelector('.carouselBtn.prev');
        const nextBtn = section.querySelector('.carouselBtn.next');
        let index = 0;

        if (!cards.length) return;

        const show = (i) => {
            cards.forEach(c => c.classList.remove('active'));
            cards[i].classList.add('active');
            countEl.textContent = `${i + 1} / ${cards.length}`;
        };

        prevBtn.addEventListener('click', () => {
            index = (index - 1 + cards.length) % cards.length;
            show(index);
        });

        nextBtn.addEventListener('click', () => {
            index = (index + 1) % cards.length;
            show(index);
        });

        show(0);
    });
})();
