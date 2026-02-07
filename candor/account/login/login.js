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

    const usernameInput = document.querySelector("[data-username-check]");
    if (usernameInput) {
        const status = document.getElementById("usernameStatus");
        const pattern = /^[a-zA-Z0-9_-]{3,20}$/;
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
                setStatus("Use 3-20 letters, numbers, _ or -.", "bad");
                return;
            }

            const current = ++seq;
            fetch(`/login/signup.php?check=1&username=${encodeURIComponent(value)}`, {
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

        usernameInput.addEventListener("input", () => {
            clearTimeout(timer);
            timer = setTimeout(() => runCheck(usernameInput.value), 240);
        });

        usernameInput.addEventListener("blur", () => {
            runCheck(usernameInput.value);
        });
    }
})();
