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