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

    const displayInput = document.querySelector("[data-display-check]");
    if (displayInput) {
        const status = document.getElementById("displayNameStatus");
        const pattern = /^[a-zA-Z0-9][a-zA-Z0-9 _-]{2,19}$/;
        let timer = null;
        let seq = 0;

        const setStatus = (text, state) => {
            if (!status) return;
            status.textContent = text;
            status.className = "status" + (state ? " " + state : "");
        };

        const runCheck = (raw) => {
            const value = raw.trim();
            if (value === "") {
                setStatus("", "");
                return;
            }
            if (!pattern.test(value)) {
                setStatus("Use 3-20 letters, numbers, spaces, _ or -.", "bad");
                return;
            }

            const current = ++seq;
            fetch(`/login/signup.php?check=1&display_name=${encodeURIComponent(value)}`, {
                headers: { "Accept": "application/json" }
            })
                .then(r => r.ok ? r.json() : null)
                .then(data => {
                    if (current !== seq || !data) return;
                    setStatus(data.message || "", data.available ? "good" : "bad");
                })
                .catch(() => {
                    if (current !== seq) return;
                    setStatus("Unable to check right now.", "bad");
                });
        };

        displayInput.addEventListener("input", () => {
            clearTimeout(timer);
            timer = setTimeout(() => runCheck(displayInput.value), 240);
        });

        displayInput.addEventListener("blur", () => {
            runCheck(displayInput.value);
        });
    }
})();
