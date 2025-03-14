document.addEventListener('DOMContentLoaded', function() {
    const iDisplay = document.getElementById("iDisplay");
    const iconFile = document.getElementById('iconFile');
    const cropModal = document.getElementById('cropModal');
    const cropContent = document.getElementById('cropContent');
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
            // Clear previous content if any
            cropContent.innerHTML = '';

            // Create an image element for cropping
            const image = document.createElement('img');
            image.src = event.target.result;
            image.id = "cropperImage";
            cropContent.appendChild(image);

            // Create a confirm button and append it
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
                                iDisplay.style.backgroundImage = `url(${data.url})`;
                            } else {
                                alert("Error uploading icon: " + data.message);
                            }
                            // Hide the modal after processing
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
