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

    if (elapsed >= 100) {
        fpsCurrent = (fpsFrameCount * 1000 / elapsed);
        frameMsCurrent = elapsed / fpsFrameCount;

        fpsFrameCount = 0;
        fpsLastTs = ts;
    }
}

export function drawStats(ctx) {
    const boxX = 6;
    const boxY = 6;
    const boxW = 80;
    const boxH = 40;
    const pad = 6;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.font = "14px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(boxX, boxY, boxW, boxH);

    ctx.fillStyle = "#00FF00";
    ctx.fillText(`FPS: ${fpsCurrent.toFixed(0)}`, boxX + pad, boxY + pad);

    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(`ms: ${frameMsCurrent.toFixed(1)}`, boxX + pad, boxY + pad + 16);

    ctx.restore();
}