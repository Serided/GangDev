document.addEventListener('DOMContentLoaded', function() {
    if (typeof backgrounds === 'undefined' || !backgrounds.length) {
        console.error('No backgrounds found:', backgrounds);
        return;
    }

    let entryDiv = document.querySelector('.sect.cont.entry')
    if (!entryDiv) {
        console.error('Entry element not found.');
        return;
    }

    function changeBackground() {
        let randomIndex = Math.floor(Math.random() * backgrounds.length);
        // Prepend the base path to the image file.
        entryDiv.style.backgroundImage = "url('https://gangdev.co/shared/files/img/background/" + backgrounds[randomIndex] + "')";
    }

    changeBackground();
    setInterval(changeBackground, 5000);
});