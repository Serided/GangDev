let fpsFrameCount = 0;
let fpsLastTs = 0;
let fpsCurrent = 0;
let frameMsCurrent = 0;

export function updateStats(ts) {
    fpsFrameCount ++;

    if (!fpsLastTs) {
        fpsLastTs = ts;
        return;
    }

    const elapsed = ts - fpsLastTs;

    if (elapsed >= 500) {
        fpsCurrent = (fpsFrameCount * 1000 / elapsed);
        frameMsCurrent = elapsed / fpsFrameCount;

        fpsFrameCount = 0;
        fpsLastTs = ts;
    }
}

export function drawStats(ctx) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.font = "14px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(6, 6, 120, 32);

    ctx.fillStyle = "#00FF00"; // FPS
    ctx.fillText(`FPS: ${fpsCurrent.toFixed(0)}`, 10, 10);

    ctx.fillStyle = "#FFFFFF"; // ms
    ctx.fillText(`ms: ${frameMsCurrent.toFixed(1)}`, 10, 26);

    ctx.restore();
}