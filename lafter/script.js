document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Badge click → show info
    const infoBox = document.getElementById('badge-info');
    document.querySelectorAll('.badge').forEach(badge => {
        badge.addEventListener('click', () => {
            const wasActive = badge.classList.contains('active');
            document.querySelectorAll('.badge').forEach(b => b.classList.remove('active'));
            if (wasActive) {
                infoBox.textContent = '';
            } else {
                badge.classList.add('active');
                infoBox.textContent = badge.dataset.info;
            }
        });
    });
});
