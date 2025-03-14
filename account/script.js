document.addEventListener('DOMContentLoaded', function() {
    const iDisplay = document.getElementById("iDisplay");
    const iconFile = document.getElementById('iconFile');
    let cropper;

    iDisplay.addEventListener('click', function() {
        iconFile.click();
    });

    iconFile.addEventListener('click', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert('Image is too large. Please choose an image under 2MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
            const image = document.createElement('img');
            image.src = event.target.result;
            image.id = "cropperImage";
            document.body.appendChild(image);

            cropper = new Cropper(image, {
                aspectRatio: 1,
                viewMode: 1,
                autoCropArea: 1,
                movable: true,
                zoomable: true,
                scalable: true,
                cropBoxResizable: true
            });

            const confirmButton = document.createElement('button');
            confirmButton.textContent = "Confirm";
            confirmButton.id = "sign";
            document.body.appendChild(confirmButton);

            confirmButton.addEventListener('click', function() {
                const croppedCanvas = cropper.getCroppedCanvas({
                    width:150,
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
                                iDisplay.style.backgroundImage = `url(${data})`;
                            } else {
                                alert("Error uploading icon: " + data.message);
                            }
                        })
                        .catch (error => {
                            console.error('Error:', error);
                        });
                }, 'image/jpeg', 0.9);

                cropper.destroy();
                image.remove();
                confirmButton.remove();
            });
        };
        reader.readAsDataURL(file);
    });
});