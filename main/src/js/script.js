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

    let bgWrapper = entryDiv.querySelector('.bgWrapper');
    if (!bgWrapper) {
        console.error('bgWrapper not found.')
        return;
    }

    //let defaultIndex = Math.floor(Math.random() * backgrounds.length);
    //entryDiv.style.backgroundImage = "url('" + backgrounds[defaultIndex] + "')"

    function changeBackground() {
        let randomIndex = Math.floor(Math.random() * backgrounds.length);
        let newBgURL = backgrounds[randomIndex];

        let img = new Image();
        img.src = newBgURL;
        img.onload = function() {
            let newBg = document.createElement('div');
            newBg.className = 'background';
            newBg.style.backgroundImage = "url('" + newBgURL + "')"

            bgWrapper.appendChild(newBg);
            newBg.offsetWidth;
            newBg.classList.add('visible');

            let oldBgs = bgWrapper.querySelectorAll('.background.visible');
            if (oldBgs.length > 1) {
                setTimeout(function() {
                    oldBgs.forEach(function(bg, index) {
                        if (index < oldBgs.length - 1) {
                            bg.remove();
                        }
                    });
                }, 1000);
            }
        };

        img.onerror = function() {
            console.error("Failed to load background image: " + newBgURL)
        }
    }

    changeBackground();
    setInterval(changeBackground, (30 * 1000));
});
