(() => {
    const body = document.body;
    const rawKey = body && body.dataset && body.dataset.userKey ? body.dataset.userKey : "local";
    const userKey = String(rawKey || "local").trim() || "local";
    const clockCookieKey = body && body.dataset && body.dataset.clockCookie
        ? body.dataset.clockCookie
        : `candor_time_format_${userKey}`;
    const keyFor = (name) => `candor_create_${userKey}_${name}`;

    const loadItems = (name) => {
        const raw = localStorage.getItem(keyFor(name));
        if (!raw) return [];
        try {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    };

    const saveItems = (name, items) => {
        localStorage.setItem(keyFor(name), JSON.stringify(items));
    };

    const state = {
        rules: [],
        sleep: [],
        tasks: [],
    };

    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const getCookie = (name) => {
        const match = document.cookie.split("; ").find((row) => row.startsWith(`${name}=`));
        return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : "";
    };

    let clockMode = getCookie(clockCookieKey) === "12" ? "12" : "24";

    const parseMinutes = (value) => {
        if (!value) return null;
        const parts = String(value).split(":");
        if (parts.length < 2) return null;
        const hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);
        if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
        return hours * 60 + minutes;
    };

    const formatTime = (value) => {
        if (!value) return "";
        const minutes = parseMinutes(value);
        if (minutes === null) return value;
        if (clockMode === "24") {
            const hours = Math.floor(minutes / 60);
            return `${String(hours).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
        }
        let hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        hours = hours % 12;
        if (hours === 0) hours = 12;
        return `${hours}:${String(mins).padStart(2, "0")}`;
    };

    const buildTimeSelect = (select) => {
        if (!select) return;
        const current = select.value;
        const emptyLabel = select.dataset.timeEmpty || "";
        select.innerHTML = "";
        if (emptyLabel) {
            const empty = document.createElement("option");
            empty.value = "";
            empty.textContent = emptyLabel;
            if (current === "" || current === null) empty.selected = true;
            select.appendChild(empty);
        }
        const step = 30;
        for (let minutes = 0; minutes < 24 * 60; minutes += step) {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            const value = `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
            const option = document.createElement("option");
            option.value = value;
            option.textContent = formatTime(value);
            if (value === current) option.selected = true;
            select.appendChild(option);
        }
        if (current) {
            select.value = current;
        }
    };

    const refreshTimeSelects = () => {
        document.querySelectorAll("[data-time-select]").forEach((select) => buildTimeSelect(select));
    };

    const normalizeText = (value) => String(value ?? "").trim();

    const normalizeRule = (item) => {
        const dayValue = item.day ?? item.day_of_week;
        const parsedDay = typeof dayValue === "number" ? dayValue : parseInt(dayValue, 10);
        return {
            id: String(item.id ?? ""),
            kind: item.kind === "task" ? "task" : "sleep",
            title: normalizeText(item.title ?? ""),
            start: normalizeText(item.start ?? item.start_time ?? item.time ?? ""),
            end: normalizeText(item.end ?? item.end_time ?? ""),
            repeat: normalizeText(item.repeat ?? item.repeat_rule ?? ""),
            day: Number.isFinite(parsedDay) ? parsedDay : null,
        };
    };

    const splitRules = () => {
        state.sleep = state.rules.filter((rule) => rule.kind === "sleep");
        state.tasks = state.rules.filter((rule) => rule.kind === "task");
    };

    const persistLocal = () => {
        saveItems("rules", state.rules);
    };

    const apiFetch = async (payload, method = "POST") => {
        const opts = {
            method,
            headers: { "Accept": "application/json" },
            credentials: "same-origin",
        };
        let url = "api.php";
        if (method === "GET") {
            const params = new URLSearchParams(payload);
            url += `?${params.toString()}`;
        } else {
            opts.headers["Content-Type"] = "application/json";
            opts.body = JSON.stringify(payload);
        }
        const res = await fetch(url, opts);
        if (!res.ok) {
            throw new Error(`api ${res.status}`);
        }
        return res.json();
    };

    let storageMode = "remote";

    const loadLocal = () => {
        state.rules = loadItems("rules").map(normalizeRule);
        splitRules();
    };

    const switchToLocal = () => {
        storageMode = "local";
        persistLocal();
    };

    const loadRemote = async () => {
        const data = await apiFetch({ action: "load" }, "GET");
        state.rules = Array.isArray(data.rules) ? data.rules.map(normalizeRule) : [];
        splitRules();
    };

    const formatRepeat = (rule) => {
        if (rule.repeat === "weekdays") return "Weekdays";
        if (rule.repeat === "weekends") return "Weekends";
        if (rule.repeat === "daily") return "Daily";
        if (rule.repeat === "day" && Number.isFinite(rule.day)) {
            return dayNames[rule.day] || "Day";
        }
        return "Custom";
    };

    const sleepList = document.querySelector("[data-sleep-list]");
    const sleepEmpty = document.querySelector("[data-sleep-empty]");
    const taskList = document.querySelector("[data-task-list]");
    const taskEmpty = document.querySelector("[data-task-empty]");

    const renderSleep = () => {
        if (!sleepList || !sleepEmpty) return;
        sleepList.innerHTML = "";
        if (state.sleep.length === 0) {
            sleepEmpty.style.display = "block";
            return;
        }
        sleepEmpty.style.display = "none";
        state.sleep.forEach((rule) => {
            const row = document.createElement("div");
            row.className = "itemRow";

            const text = document.createElement("div");
            const title = document.createElement("div");
            title.className = "itemTitle";
            title.textContent = rule.title || "Sleep";

            const meta = document.createElement("div");
            meta.className = "itemMeta";
            const range = rule.start && rule.end ? `${formatTime(rule.start)}-${formatTime(rule.end)}` : "Time TBD";
            meta.textContent = `${range} - ${formatRepeat(rule)}`;

            text.appendChild(title);
            text.appendChild(meta);

            const remove = document.createElement("button");
            remove.type = "button";
            remove.className = "itemRemove";
            remove.dataset.removeId = rule.id;
            remove.dataset.removeKind = "sleep";
            remove.textContent = "Remove";

            row.appendChild(text);
            row.appendChild(remove);
            sleepList.appendChild(row);
        });
    };

    const renderTasks = () => {
        if (!taskList || !taskEmpty) return;
        taskList.innerHTML = "";
        if (state.tasks.length === 0) {
            taskEmpty.style.display = "block";
            return;
        }
        taskEmpty.style.display = "none";
        state.tasks.forEach((rule) => {
            const row = document.createElement("div");
            row.className = "itemRow";

            const text = document.createElement("div");
            const title = document.createElement("div");
            title.className = "itemTitle";
            title.textContent = rule.title || "Task";

            const meta = document.createElement("div");
            meta.className = "itemMeta";
            const time = rule.start ? `${formatTime(rule.start)} - ` : "";
            meta.textContent = `${time}${formatRepeat(rule)}`;

            text.appendChild(title);
            text.appendChild(meta);

            const remove = document.createElement("button");
            remove.type = "button";
            remove.className = "itemRemove";
            remove.dataset.removeId = rule.id;
            remove.dataset.removeKind = "task";
            remove.textContent = "Remove";

            row.appendChild(text);
            row.appendChild(remove);
            taskList.appendChild(row);
        });
    };

    const renderAll = () => {
        renderSleep();
        renderTasks();
    };

    const applyRepeatToggle = (select, field) => {
        if (!select || !field) return;
        field.style.display = select.value === "day" ? "grid" : "none";
    };

    const initRepeatSelects = () => {
        const sleepRepeat = document.querySelector("[data-repeat-select]");
        const sleepDayField = document.querySelector("[data-day-field]");
        if (sleepRepeat && sleepDayField) {
            applyRepeatToggle(sleepRepeat, sleepDayField);
            sleepRepeat.addEventListener("change", () => applyRepeatToggle(sleepRepeat, sleepDayField));
        }

        const taskRepeat = document.querySelector("[data-task-repeat]");
        const taskDayField = document.querySelector("[data-task-day-field]");
        if (taskRepeat && taskDayField) {
            applyRepeatToggle(taskRepeat, taskDayField);
            taskRepeat.addEventListener("change", () => applyRepeatToggle(taskRepeat, taskDayField));
        }
    };

    const addRule = async (payload) => {
        if (storageMode === "remote") {
            try {
                const data = await apiFetch(payload, "POST");
                if (data && data.rule) {
                    state.rules.push(normalizeRule(data.rule));
                    splitRules();
                    renderAll();
                    return;
                }
            } catch {
                switchToLocal();
            }
        }

        if (storageMode === "local") {
            const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
            const localRule = normalizeRule({ id, ...payload });
            state.rules.push(localRule);
            splitRules();
            persistLocal();
            renderAll();
        }
    };

    const removeRule = async (id) => {
        if (!id) return;
        if (storageMode === "remote") {
            try {
                await apiFetch({ action: "delete", id }, "POST");
            } catch {
                switchToLocal();
            }
        }

        state.rules = state.rules.filter((rule) => rule.id !== id);
        splitRules();
        if (storageMode === "local") {
            persistLocal();
        }
        renderAll();
    };

    const clearRules = async (kind) => {
        if (storageMode === "remote") {
            try {
                await apiFetch({ action: "clear", kind }, "POST");
            } catch {
                switchToLocal();
            }
        }

        state.rules = state.rules.filter((rule) => rule.kind !== kind);
        splitRules();
        if (storageMode === "local") {
            persistLocal();
        }
        renderAll();
    };

    const sleepForm = document.querySelector("[data-sleep-form]");
    if (sleepForm) {
        sleepForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const formData = new FormData(sleepForm);
            const start = normalizeText(formData.get("start"));
            const end = normalizeText(formData.get("end"));
            if (!start || !end) return;
            const repeat = normalizeText(formData.get("repeat"));
            const day = normalizeText(formData.get("day"));
            addRule({
                action: "add",
                kind: "sleep",
                start,
                end,
                repeat,
                day,
            });
            sleepForm.reset();
            refreshTimeSelects();
            const sleepRepeat = sleepForm.querySelector("[data-repeat-select]");
            const sleepDayField = sleepForm.querySelector("[data-day-field]");
            applyRepeatToggle(sleepRepeat, sleepDayField);
        });
    }

    const sleepClear = document.querySelector("[data-sleep-clear]");
    if (sleepClear) {
        sleepClear.addEventListener("click", () => clearRules("sleep"));
    }

    const taskForm = document.querySelector("[data-task-form]");
    if (taskForm) {
        taskForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const formData = new FormData(taskForm);
            const title = normalizeText(formData.get("title"));
            if (!title) return;
            const time = normalizeText(formData.get("time"));
            const repeat = normalizeText(formData.get("repeat"));
            const day = normalizeText(formData.get("day"));
            addRule({
                action: "add",
                kind: "task",
                title,
                time,
                repeat,
                day,
            });
            taskForm.reset();
            refreshTimeSelects();
            const taskRepeat = taskForm.querySelector("[data-task-repeat]");
            const taskDayField = taskForm.querySelector("[data-task-day-field]");
            applyRepeatToggle(taskRepeat, taskDayField);
        });
    }

    document.addEventListener("click", (event) => {
        const removeBtn = event.target.closest("[data-remove-id]");
        if (removeBtn) {
            const id = removeBtn.dataset.removeId;
            removeRule(id);
        }
    });

    const init = async () => {
        initRepeatSelects();
        refreshTimeSelects();
        try {
            await loadRemote();
        } catch {
            storageMode = "local";
            loadLocal();
        }
        renderAll();
    };

    init();
})();
