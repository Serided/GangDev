document.addEventListener('DOMContentLoaded', function() {
    // ===== Icon Cropper =====
    const iDisplay = document.getElementById('iDisplay');
    const icon = document.getElementById('icon');
    const iconFile = document.getElementById('iconFile');
    const cropModal = document.getElementById('cropModal');
    const cropImage = document.getElementById('cropImage');
    const cropPreview = document.getElementById('cropPreview');
    const cropConfirm = document.getElementById('cropConfirm');
    const cropCancel = document.getElementById('cropCancel');
    let cropper = null;

    if (iDisplay) {
        iDisplay.addEventListener('click', function() {
            iconFile.click();
        });
    }

    if (iconFile) {
        iconFile.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            if (file.size > 2 * 1024 * 1024) {
                alert('Image must be under 2MB.');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(event) {
                cropImage.src = event.target.result;
                cropModal.classList.add('active');

                // Destroy previous cropper if exists
                if (cropper) cropper.destroy();

                cropper = new Cropper(cropImage, {
                    aspectRatio: 1,
                    viewMode: 1,
                    autoCropArea: 0.85,
                    movable: true,
                    zoomable: true,
                    scalable: false,
                    cropBoxResizable: true,
                    background: false,
                    preview: '#cropPreview'
                });
            };
            reader.readAsDataURL(file);
        });
    }

    if (cropConfirm) {
        cropConfirm.addEventListener('click', function() {
            if (!cropper) return;

            const croppedCanvas = cropper.getCroppedCanvas({
                width: 300,
                height: 300
            });

            croppedCanvas.toBlob(function(blob) {
                const formData = new FormData();
                formData.append('icon', blob, 'icon.jpg');

                cropConfirm.textContent = 'Saving...';
                cropConfirm.disabled = true;

                fetch('php/uploadIcon.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        const newIconUrl = data.url + '?v=' + Date.now();
                        icon.style.backgroundImage = `url(${newIconUrl})`;

                        // Update navbar icon too
                        const navbarProfile = document.querySelector('.hNavbar .profile');
                        if (navbarProfile) {
                            navbarProfile.style.backgroundImage = `url(${newIconUrl})`;
                        }
                    } else {
                        alert('Error: ' + data.message);
                    }
                    closeCropModal();
                })
                .catch(error => {
                    console.error('Upload error:', error);
                    closeCropModal();
                });
            }, 'image/jpeg', 0.9);
        });
    }

    if (cropCancel) {
        cropCancel.addEventListener('click', closeCropModal);
    }

    // Close on backdrop click
    if (cropModal) {
        cropModal.addEventListener('click', function(e) {
            if (e.target === cropModal) closeCropModal();
        });
    }

    function closeCropModal() {
        cropModal.classList.remove('active');
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }
        cropConfirm.textContent = 'Save';
        cropConfirm.disabled = false;
        iconFile.value = '';
    }

    // ===== Account Sections (tabs) =====
    const radios = document.querySelectorAll('input[name="sections"]');
    const sections = document.querySelectorAll('.accountInfo');
    const fadeDuration = 300;

    function fadeOut(el, callback) {
        el.style.transition = `opacity ${fadeDuration}ms ease`;
        el.style.opacity = 0;
        setTimeout(() => {
            el.style.display = 'none';
            if (callback) callback();
        }, fadeDuration);
    }

    function fadeIn(el) {
        el.style.display = 'block';
        setTimeout(() => {
            el.style.transition = `opacity ${fadeDuration}ms ease`;
            el.style.opacity = 1;
        }, 10);
    }

    // Hide all sections initially
    sections.forEach(section => {
        section.style.opacity = 0;
        section.style.display = 'none';
    });

    // Show the initially checked section
    const initialRadio = document.querySelector('input[name="sections"]:checked');
    if (initialRadio) {
        const target = document.getElementById('sect' + initialRadio.id);
        if (target) fadeIn(target);
    }

    // Tab switching
    radios.forEach(radio => {
        radio.addEventListener('change', function() {
            sections.forEach(section => fadeOut(section));
            const targetSection = document.getElementById('sect' + this.id);
            if (targetSection) {
                setTimeout(() => fadeIn(targetSection), fadeDuration);
            }
        });
    });

    // ===== Form submit on Enter =====
    document.querySelectorAll('#displayname, #email').forEach(function(input) {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                document.getElementById('changeForm').submit();
            }
        });
    });
});

// ===== Countdown (account deletion) =====
function startCountdown(remaining, elementId) {
    const display = document.getElementById(elementId);

    function updateCountdown() {
        if (remaining < 0) {
            display.textContent = "0 seconds";
            return;
        }
        const days = Math.floor(remaining / (24 * 3600));
        const hours = Math.floor((remaining % (24 * 3600)) / 3600);
        const minutes = Math.floor((remaining % 3600) / 60);
        const seconds = remaining % 60;
        display.textContent = days + "d " + hours + "h " + minutes + "m " + seconds + "s";
        remaining--;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}
