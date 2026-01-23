document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.tile').forEach(tile => {
        tile.addEventListener('touchstart', () => {
            tile.classList.add('active');
        });
        tile.addEventListener('touchend', () => {
            tile.classList.remove('active');
        });
    });
});
