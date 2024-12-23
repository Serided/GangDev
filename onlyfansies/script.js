// script.js

// List of image files (add or remove files as needed)
const imageFiles = [
    "picture1.webp",
    "picture2.webp",
    "picture3.webp"
];

const gallery = document.getElementById("gallery");

// Dynamically add images to the gallery
imageFiles.forEach(file => {
    const imgElement = document.createElement("img");
    imgElement.src = `img/${file}`; // Path to the images in the img/ folder
    imgElement.alt = file.split('.')[0]; // Use file name (without extension) as alt text
    gallery.appendChild(imgElement);
});
