export function setupCanvas() {
    const canvas = document.getElementById("gameCanvas");
    if (!canvas) {
        console.error("Canvas element not found.");
        return null;
    }
    const ctx = canvas.getContext("2d");
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    console.log("Canvas initialized:", { width, height });
    return { canvas, ctx }
}