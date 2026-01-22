(function () {
    const emailInput = document.querySelector("[data-company-email]");
    const note = document.querySelector("[data-company-note]");

    if (!emailInput || !note) return;

    function allowed(email) {
        const v = (email || "").trim().toLowerCase();
        return v.endsWith("@milestone.tech") || v.endsWith("@meta.com");
    }

    function sync() {
        const ok = allowed(emailInput.value);
        note.textContent = ok ? "eligible domain" : "only @milestone.tech or @meta.com";
        note.dataset.state = ok ? "ok" : "bad";
    }

    emailInput.addEventListener("input", sync);
    sync();
})();
