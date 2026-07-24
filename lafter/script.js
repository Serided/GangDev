// Wait for fonts to load before showing page (prevents FOUT)
if (document.fonts) {
    document.fonts.ready.then(() => {
        document.documentElement.classList.add('fonts-loaded');
    });
    // Fallback: show page after 1s max even if fonts fail
    setTimeout(() => document.documentElement.classList.add('fonts-failed'), 1000);
}

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

    // User dropdown toggle
    const userBtn = document.getElementById('user-menu-btn');
    const dropdown = document.getElementById('user-dropdown');
    if (userBtn && dropdown) {
        userBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('open');
        });
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target) && e.target !== userBtn) {
                dropdown.classList.remove('open');
            }
        });
    }
});
