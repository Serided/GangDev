const rail = document.getElementById("updatesRail");
if (rail) {
    const frame = rail.closest(".updatesFrame") || rail;

    frame.addEventListener("wheel", (e) => {
        const max = rail.scrollWidth - rail.clientWidth;
        if (max <= 0) return;

        const dy = e.deltaY;
        const dx = e.deltaX;

        const useDY = Math.abs(dy) >= Math.abs(dx);
        const delta = useDY ? dy : dx;
        if (!delta) return;

        const canScroll =
            (delta > 0 && rail.scrollLeft < max - 1) ||
            (delta < 0 && rail.scrollLeft > 1);

        if (canScroll) {
            e.preventDefault();
            rail.scrollLeft += delta;
        }
    }, { passive: false });

    let isDown = false;
    let startX = 0;
    let startScroll = 0;

    rail.addEventListener("pointerdown", (e) => {
        isDown = true;
        rail.setPointerCapture(e.pointerId);
        startX = e.clientX;
        startScroll = rail.scrollLeft;
    });

    rail.addEventListener("pointermove", (e) => {
        if (!isDown) return;
        const dx = e.clientX - startX;
        rail.scrollLeft = startScroll - dx;
    });

    rail.addEventListener("pointerup", () => { isDown = false; });
    rail.addEventListener("pointercancel", () => { isDown = false; });

    rail.addEventListener("keydown", (e) => {
        const step = 200;
        if (e.key === "ArrowRight") { rail.scrollBy({ left: step, behavior: "smooth" }); e.preventDefault(); }
        if (e.key === "ArrowLeft")  { rail.scrollBy({ left: -step, behavior: "smooth" }); e.preventDefault(); }
    });
}
