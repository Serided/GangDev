export function setup2dCanvas() {
    const canvas = document.getElementById("gameCanvas");
    if (!canvas) {
        console.error("Canvas element not found. Canvas could not be initialized.");
        return null;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
        console.error("Canvas context could not be initialized.");
        return null;
    }

    // dimensions
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    console.log("Canvas initialized:", { width, height });

    window.scaling = 20; // 20px a meter

    const computedStyle = window.getComputedStyle(canvas);
    const fontFamily = computedStyle.fontFamily;
    ctx.font = `16px ${fontFamily}`;

    return { canvas, ctx }
}