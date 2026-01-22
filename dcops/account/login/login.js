(function () {
    document.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-toggle-password]");
        if (!btn) return;

        const sel = btn.getAttribute("data-toggle-password");
        const input = document.querySelector(sel);
        if (!input) return;

        const isPw = input.type === "password";
        input.type = isPw ? "text" : "password";
        btn.textContent = isPw ? "hide" : "show";
    });

    document.addEventListener("click", (e) => {
        const hint = e.target.closest(".hint");
        if (!hint) {
            document.querySelectorAll(".hint").forEach(h => h.classList.remove("open"));
            return;
        }

        hint.classList.toggle("open");
        e.stopPropagation();
    });
})();
