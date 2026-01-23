(() => {
    const rail = document.getElementById("gdUpdatesRail");
    if (!rail) return;

    // Make vertical wheel/trackpad scrolling move the rail horizontally
    // without forcing the whole page into horizontal scroll.
    rail.addEventListener(
        "wheel",
        (e) => {
            // If the user is already doing horizontal scroll (shift+wheel or trackpad),
            // let the browser handle it.
            const isMostlyHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
            if (isMostlyHorizontal) return;

            const maxScrollLeft = rail.scrollWidth - rail.clientWidth;
            if (maxScrollLeft <= 0) return;

            // Only intercept when the rail can actually scroll in the direction.
            const goingRight = e.deltaY > 0;
            const canGoRight = rail.scrollLeft < maxScrollLeft - 1;
            const canGoLeft = rail.scrollLeft > 1;

            if ((goingRight && canGoRight) || (!goingRight && canGoLeft)) {
                e.preventDefault();
                rail.scrollLeft += e.deltaY; // natural feel: vertical -> horizontal
            }
        },
        { passive: false }
    );

    // Keyboard support (when rail is focused)
    rail.addEventListener("keydown", (e) => {
        const step = 140;
        if (e.key === "ArrowRight") {
            rail.scrollBy({ left: step, behavior: "smooth" });
            e.preventDefault();
        } else if (e.key === "ArrowLeft") {
            rail.scrollBy({ left: -step, behavior: "smooth" });
            e.preventDefault();
        }
    });
})();
