document.addEventListener('DOMContentLoaded', function() {
    const iDisplay = document.getElementById('iDisplay');
    const icon = document.getElementById('icon')
    const iconFile = document.getElementById('iconFile');
    const cropModal = document.getElementById('cropModal');  // modal container
    const cropContent = document.getElementById('cropContent');  // content inside modal
    let cropper;

    iDisplay.addEventListener('click', function() {
        iconFile.click();
    });

    iconFile.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            alert('Image is too large. Please choose an image under 2MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
            // Clear any existing content in the modal
            cropContent.innerHTML = '';

            // Create the image for cropping
            const image = document.createElement('img');
            image.src = event.target.result;
            image.id = "cropperImage";
            cropContent.appendChild(image);

            // Create confirm button and add it to modal
            const confirmButton = document.createElement('button');
            confirmButton.textContent = "Confirm";
            confirmButton.id = "cropConfirm";
            cropContent.appendChild(confirmButton);

            // Show modal
            cropModal.style.display = 'flex';

            cropper = new Cropper(image, {
                aspectRatio: 1,
                viewMode: 1,
                autoCropArea: 1,
                movable: true,
                zoomable: true,
                scalable: true,
                cropBoxResizable: true
            });

            confirmButton.addEventListener('click', function() {
                const croppedCanvas = cropper.getCroppedCanvas({
                    width: 150,
                    height: 150
                });
                croppedCanvas.toBlob(function(blob) {
                    const formData = new FormData();
                    formData.append('icon', blob, 'icon.jpg');

                    fetch('php/uploadIcon.php', {
                        method: 'POST',
                        body: formData
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data.status === 'success') {
                                const newIconUrl = data.url + '?v=' + new Date().getTime();
                                icon.style.backgroundImage = `url(${newIconUrl})`;

                                const navbarProfile = document.querySelector('.hNavbar .profile');
                                if (navbarProfile) {
                                    navbarProfile.style.backgroundImage = `url(${newIconUrl})`;
                                }
                            } else {
                                alert("Error uploading icon: " + data.message);
                            }
                            cropModal.style.display = 'none';
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            cropModal.style.display = 'none';
                        });
                }, 'image/jpeg', 0.9);

                cropper.destroy();
            });
        };
        reader.readAsDataURL(file);
    });

    const radios = document.querySelectorAll('input[name="sections"]');
    const sections = document.querySelectorAll('.accountInfo');
    const fadeDuration = 400; // fade duration in ms

    console.log("Radios found:", radios.length);
    console.log("Sections found:", sections.length);

    // Function to fade out an element
    function fadeOut(el, callback) {
        el.style.transition = `opacity ${fadeDuration}ms ease`;
        el.style.opacity = 0;
        setTimeout(() => {
            el.style.display = 'none';
            if (callback) callback();
        }, fadeDuration);
    }

    // Function to fade in an element
    function fadeIn(el) {
        el.style.display = 'block';
        // slight delay to ensure the display change is applied before transition starts
        setTimeout(() => {
            el.style.transition = `opacity ${fadeDuration}ms ease`;
            el.style.opacity = 1;
        }, 10);
    }

    // Initially, hide all sections
    sections.forEach(section => {
        section.style.opacity = 0;
        section.style.display = 'none';
    });

    // Get the initially checked radio button
    const initialRadio = document.querySelector('input[name="sections"]:checked');
    console.log("Initial radio:", initialRadio);
    if (initialRadio) {
        const target = document.getElementById('sect' + initialRadio.id);
        console.log("Initial target section:", target);
        if (target) {
            fadeIn(target);
        } else {
            console.warn("No target found for", initialRadio.id);
        }
    }

    // Listen for changes on the radio buttons
    radios.forEach(radio => {
        radio.addEventListener('change', function () {
            console.log("Radio changed:", this.id);
            // Fade out all sections
            sections.forEach(section => fadeOut(section));

            // Determine the target section by prepending "sect" to the radio's ID
            const targetId = 'sect' + this.id;
            const targetSection = document.getElementById(targetId);
            console.log("Target section:", targetSection);
            if (targetSection) {
                // Fade in the target section after waiting for fade-out to complete
                setTimeout(() => fadeIn(targetSection), fadeDuration);
            } else {
                console.warn("No section found with id", targetId);
            }
        });
    });
});

function startCountdown(remaining, elementId) {
    let display = document.getElementById(elementId);

    function updateCountdown() {
        if (remaining < 0) {
            display.textContent = "0 seconds";
            return;
        }
        let days = Math.floor(remaining / (24 * 3600));
        let hours = Math.floor((remaining % (24 * 3600)) / 3600);
        let minutes = Math.floor((remaining % 3600) / 60);
        let seconds = remaining % 60;
        display.textContent = days + "d " + hours + "h " + minutes + "m " + seconds + "s";
        remaining--;
    }

    // Initialize and update every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

