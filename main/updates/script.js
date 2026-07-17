(() => {
    const buttons = Array.from(document.querySelectorAll("[data-filter]"));
    const items = Array.from(document.querySelectorAll("[data-impact]"));
    if (!buttons.length || !items.length) return;

    const setFilter = (value) => {
        buttons.forEach(btn => btn.classList.toggle("isActive", btn.getAttribute("data-filter") === value));
        items.forEach(item => {
            const impact = item.getAttribute("data-impact");
            const hide = value !== "all" && impact !== value;
            item.classList.toggle("isHidden", hide);
        });
    };

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            setFilter(btn.getAttribute("data-filter"));
        });
    });

    setFilter("all");
})();
