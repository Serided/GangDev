(() => {
    const $ = (id) => document.getElementById(id);

    function pad(n){ return String(n).padStart(2, "0"); }

    function tickClock(){
        const d = new Date();
        const hh = pad(d.getHours());
        const mm = pad(d.getMinutes());
        $("clock").textContent = `LOCAL ${hh}:${mm}`;
    }

    // Simple animated demo values (just for landing vibe)
    const state = {
        t: 128,
        open: 7,
        esc: 1,
        audit: 94,
        ex: 3,
        ct: 22,
        bar: 68
    };

    function handleTopbar(){
        const topbar = document.querySelector(".topbar");
        if (!topbar) return;
        topbar.classList.toggle("scrolled", window.scrollY > 10);
    }
    window.addEventListener("scroll", handleTopbar, { passive: true });
    handleTopbar();

    function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }

    function animate(){
        // tiny drift to make it feel alive
        state.t = clamp(state.t + (Math.random() < 0.45 ? 1 : 0), 80, 260);
        state.open = clamp(state.open + (Math.random() < 0.30 ? (Math.random() < 0.5 ? -1 : 1) : 0), 0, 22);
        state.esc = clamp(state.esc + (Math.random() < 0.12 ? (Math.random() < 0.5 ? -1 : 1) : 0), 0, 6);

        state.audit = clamp(state.audit + (Math.random() < 0.18 ? (Math.random() < 0.5 ? -1 : 1) : 0), 85, 99);
        state.ex = clamp(state.ex + (Math.random() < 0.20 ? (Math.random() < 0.5 ? -1 : 1) : 0), 0, 12);

        state.ct = clamp(state.ct + (Math.random() < 0.22 ? (Math.random() < 0.5 ? -1 : 1) : 0), 14, 48);

        state.bar = clamp(Math.round((state.audit - 80) * 5), 20, 96);

        $("throughput").textContent = String(state.t);
        $("openItems").textContent = String(state.open);
        $("esc").textContent = String(state.esc);
        $("auditScore").textContent = `${state.audit}%`;
        $("exceptions").textContent = String(state.ex);
        $("cycleTime").textContent = `${state.ct}m`;

        const bar = $("barFill");
        if (bar) bar.style.width = `${state.bar}%`;
    }

    // Fake contact submit (no backend)
    window.DCOPS_submitContact = (e) => {
        e.preventDefault();
        const note = $("formNote");
        if (!note) return false;

        note.textContent = "Sent (simulated). Hook this form to PHP/mail when you’re ready.";
        note.style.color = "rgba(167,243,208,.95)";

        // reset back after a bit
        setTimeout(() => {
            note.textContent = "This form currently simulates submission (no backend). Hook it to PHP/mail when ready.";
            note.style.color = "";
        }, 4500);

        return false;
    };

    tickClock();
    setInterval(tickClock, 1000 * 20);
    setInterval(animate, 1200);
})();
