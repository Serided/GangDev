function fadeInPage() {
  if (!window.AnimationEvent) { return; }
  var fader = document.getElementById('fader');
  fader.classList.add('fade-out');
}

document.addEventListener('DOMContentLoaded', function() {
  if (!window.AnimationEvent) { return }

  let anchors = document.getElementsByTagName('a');

  for (let idx=0; idx<anchors.length; idx+=1) {
    if (anchors[idx].hostname !== window.location.hostname) {
      continue;
    }

    anchors[idx].addEventListener('click', function(event) {
      let fader = document.getElementById('fader'),
          anchor = event.currentTarget;

      let listener = function() {
        window.location = anchor.href;
        fader.removeEventListener('animationend', listener);
      };
      fader.addEventListener('animationend', listener);

      event.preventDefault();
      fader.classList.add('fade-in');
    });
  }

  // entry background images
  if (typeof backgrounds === 'undefined' || !backgrounds.length) {
    console.error('No backgrounds found.');
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

window.addEventListener('pageshow', function (event) {
  if (!event.persisted) {
    return;
  }
  var fader = document.getElementById('fader');
  fader.classList.remove('fade-in');
});