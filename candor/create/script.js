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
        routines: [],
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

    const splitList = (value) => {
        if (!value) return [];
        return String(value)
            .split(/[\r\n,]+/)
            .map((item) => item.trim())
            .filter((item) => item !== "");
    };

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

    const normalizeRoutineTasks = (value) => {
        if (Array.isArray(value)) {
            return value.map((item) => normalizeText(item)).filter((item) => item !== "");
        }
        if (typeof value === "string") {
            const trimmed = value.trim();
            if (trimmed === "") return [];
            if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
                try {
                    const parsed = JSON.parse(trimmed);
                    if (Array.isArray(parsed)) {
                        return parsed.map((item) => normalizeText(item)).filter((item) => item !== "");
                    }
                } catch {
                    return splitList(trimmed);
                }
            }
            return splitList(trimmed);
        }
        return [];
    };

    const normalizeRoutine = (item) => {
        const repeatValue = normalizeText(item.repeat ?? item.repeat_rule ?? "daily");
        const dayValue = item.day ?? item.day_of_week;
        const parsedDay = typeof dayValue === "number" ? dayValue : parseInt(dayValue, 10);
        const allowed = ["daily", "weekdays", "weekends", "day"];
        const repeat = allowed.includes(repeatValue) ? repeatValue : "daily";
        return {
            id: String(item.id ?? ""),
            title: normalizeText(item.title ?? ""),
            time: normalizeText(item.time ?? item.routine_time ?? ""),
            tasks: normalizeRoutineTasks(item.tasks ?? item.tasks_json ?? ""),
            repeat,
            day: Number.isFinite(parsedDay) ? parsedDay : null,
        };
    };

    const splitRules = () => {
        state.sleep = state.rules.filter((rule) => rule.kind === "sleep");
        state.tasks = state.rules.filter((rule) => rule.kind === "task");
    };

    const persistLocal = () => {
        saveItems("rules", state.rules);
        saveItems("routines", state.routines);
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
        state.routines = loadItems("routines").map(normalizeRoutine);
        splitRules();
    };

    const switchToLocal = () => {
        storageMode = "local";
        persistLocal();
    };

    const loadRemote = async () => {
        const data = await apiFetch({ action: "load" }, "GET");
        state.rules = Array.isArray(data.rules) ? data.rules.map(normalizeRule) : [];
        state.routines = Array.isArray(data.routines) ? data.routines.map(normalizeRoutine) : [];
        splitRules();
    };

    const formatRepeatRule = (repeat, day) => {
        if (repeat === "weekdays") return "Weekdays";
        if (repeat === "weekends") return "Weekends";
        if (repeat === "daily") return "Daily";
        if (repeat === "day" && Number.isFinite(day)) {
            return dayNames[day] || "Day";
        }
        return "Custom";
    };

    const formatRepeat = (rule) => formatRepeatRule(rule.repeat, rule.day);

    const sleepList = document.querySelector("[data-sleep-list]");
    const sleepEmpty = document.querySelector("[data-sleep-empty]");
    const taskList = document.querySelector("[data-task-list]");
    const taskEmpty = document.querySelector("[data-task-empty]");
    const routineList = document.querySelector("[data-routine-list]");
    const routineEmpty = document.querySelector("[data-routine-empty]");
    const weekColumns = Array.from(document.querySelectorAll("[data-week-day]"));

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

    const renderRoutines = () => {
        if (!routineList || !routineEmpty) return;
        routineList.innerHTML = "";
        if (state.routines.length === 0) {
            routineEmpty.style.display = "block";
            return;
        }
        routineEmpty.style.display = "none";
        state.routines.forEach((routine) => {
            const row = document.createElement("div");
            row.className = "itemRow";

            const text = document.createElement("div");
            const title = document.createElement("div");
            title.className = "itemTitle";
            title.textContent = routine.title || "Routine";

            const meta = document.createElement("div");
            meta.className = "itemMeta";
            const time = routine.time ? formatTime(routine.time) : "Anytime";
            const repeat = formatRepeatRule(routine.repeat, routine.day);
            const tasks = Array.isArray(routine.tasks) ? routine.tasks : [];
            const detail = tasks.length ? `${tasks.length} tasks` : "No tasks";
            meta.textContent = `${time} - ${repeat} - ${detail}`;

            text.appendChild(title);
            text.appendChild(meta);

            const remove = document.createElement("button");
            remove.type = "button";
            remove.className = "itemRemove";
            remove.dataset.removeId = routine.id;
            remove.dataset.removeKind = "routine";
            remove.textContent = "Remove";

            row.appendChild(text);
            row.appendChild(remove);
            routineList.appendChild(row);
        });
    };

    const renderAll = () => {
        renderSleep();
        renderTasks();
        renderRoutines();
        renderWeekTemplate();
    };

    const appliesToDay = (repeat, dayValue, targetDay) => {
        if (repeat === "daily") return true;
        if (repeat === "weekdays") return targetDay >= 1 && targetDay <= 5;
        if (repeat === "weekends") return targetDay === 0 || targetDay === 6;
        if (repeat === "day") return Number.isFinite(dayValue) && dayValue === targetDay;
        return false;
    };

    const getWeekItems = (targetDay) => {
        const items = [];
        state.routines.forEach((routine) => {
            if (!appliesToDay(routine.repeat, routine.day, targetDay)) return;
            items.push({
                type: "routine",
                title: routine.title || "Routine",
                time: routine.time,
            });
        });
        state.tasks.forEach((rule) => {
            if (!appliesToDay(rule.repeat, rule.day, targetDay)) return;
            items.push({
                type: "task",
                title: rule.title || "Repeat task",
                time: rule.start,
            });
        });
        items.sort((a, b) => {
            const aTime = parseMinutes(a.time) ?? 9999;
            const bTime = parseMinutes(b.time) ?? 9999;
            if (aTime !== bTime) return aTime - bTime;
            return a.title.localeCompare(b.title);
        });
        return items;
    };

    const renderWeekTemplate = () => {
        if (!weekColumns.length) return;
        weekColumns.forEach((column) => {
            const day = parseInt(column.dataset.weekDay, 10);
            const list = column.querySelector("[data-week-list]");
            if (!list) return;
            list.innerHTML = "";
            const items = getWeekItems(Number.isFinite(day) ? day : 0);
            items.forEach((item) => {
                const row = document.createElement("div");
                row.className = `weekItem ${item.type === "routine" ? "is-routine" : "is-task"}`;

                const title = document.createElement("div");
                title.className = "weekItemTitle";
                title.textContent = item.title;

                row.appendChild(title);

                if (item.time) {
                    const time = document.createElement("div");
                    time.className = "weekItemTime";
                    time.textContent = formatTime(item.time);
                    row.appendChild(time);
                }

                list.appendChild(row);
            });
        });
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

        const routineRepeat = document.querySelector("[data-routine-repeat]");
        const routineDayField = document.querySelector("[data-routine-day-field]");
        if (routineRepeat && routineDayField) {
            applyRepeatToggle(routineRepeat, routineDayField);
            routineRepeat.addEventListener("change", () => applyRepeatToggle(routineRepeat, routineDayField));
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

    const addRoutine = async (payload) => {
        if (storageMode === "remote") {
            try {
                const data = await apiFetch(payload, "POST");
                if (data && data.routine) {
                    state.routines.push(normalizeRoutine(data.routine));
                    renderAll();
                    return;
                }
            } catch {
                switchToLocal();
            }
        }

        if (storageMode === "local") {
            const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
            const localRoutine = normalizeRoutine({ id, ...payload });
            state.routines.push(localRoutine);
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

    const removeRoutine = async (id) => {
        if (!id) return;
        if (storageMode === "remote") {
            try {
                await apiFetch({ action: "delete_routine", id }, "POST");
            } catch {
                switchToLocal();
            }
        }

        state.routines = state.routines.filter((routine) => routine.id !== id);
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

    const routineForm = document.querySelector("[data-routine-form]");
    if (routineForm) {
        routineForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const formData = new FormData(routineForm);
            const title = normalizeText(formData.get("title"));
            if (!title) return;
            const time = normalizeText(formData.get("time"));
            const repeat = normalizeText(formData.get("repeat")) || "daily";
            const day = normalizeText(formData.get("day"));
            const tasks = Array.from(routineForm.querySelectorAll('input[name="task[]"]'))
                .map((input) => normalizeText(input.value))
                .filter((value) => value !== "");
            addRoutine({
                action: "add_routine",
                title,
                time,
                repeat,
                day,
                tasks,
            });
            routineForm.reset();
            const routineRepeat = routineForm.querySelector("[data-routine-repeat]");
            const routineDayField = routineForm.querySelector("[data-routine-day-field]");
            applyRepeatToggle(routineRepeat, routineDayField);
            clearRoutineTasks();
        });
    }

    const routineTaskStack = document.querySelector("[data-routine-tasks]");
    const routineAddTask = document.querySelector("[data-routine-add-task]");

    const buildRoutineTaskRow = (value = "") => {
        const row = document.createElement("div");
        row.className = "taskRow";

        const input = document.createElement("input");
        input.className = "input compact";
        input.type = "text";
        input.name = "task[]";
        input.placeholder = "Task";
        input.value = value;

        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "taskRemove";
        remove.dataset.routineTaskRemove = "true";
        remove.textContent = "×";

        row.appendChild(input);
        row.appendChild(remove);
        return row;
    };

    const ensureRoutineTaskRow = () => {
        if (!routineTaskStack) return;
        if (routineTaskStack.children.length === 0) {
            routineTaskStack.appendChild(buildRoutineTaskRow());
        }
    };

    const clearRoutineTasks = () => {
        if (!routineTaskStack) return;
        routineTaskStack.innerHTML = "";
        ensureRoutineTaskRow();
    };

    if (routineAddTask) {
        routineAddTask.addEventListener("click", () => {
            if (!routineTaskStack) return;
            routineTaskStack.appendChild(buildRoutineTaskRow());
        });
    }

    document.addEventListener("click", (event) => {
        const routineRemove = event.target.closest("[data-routine-task-remove]");
        if (routineRemove && routineTaskStack) {
            const rows = routineTaskStack.querySelectorAll(".taskRow");
            const row = routineRemove.closest(".taskRow");
            if (!row) return;
            if (rows.length <= 1) {
                const input = row.querySelector("input");
                if (input) input.value = "";
                return;
            }
            row.remove();
            return;
        }
        const removeBtn = event.target.closest("[data-remove-id]");
        if (removeBtn) {
            const id = removeBtn.dataset.removeId;
            if (removeBtn.dataset.removeKind === "routine") {
                removeRoutine(id);
                return;
            }
            removeRule(id);
        }
    });

    const repeatOverlay = document.querySelector("[data-repeat-overlay]");
    const repeatOpen = document.querySelector("[data-repeat-open]");
    const repeatClose = document.querySelectorAll("[data-repeat-close]");
    const repeatForm = document.querySelector("[data-repeat-form]");

    const openRepeatOverlay = () => {
        if (repeatOverlay) repeatOverlay.classList.add("is-open");
    };

    const closeRepeatOverlay = () => {
        if (repeatOverlay) repeatOverlay.classList.remove("is-open");
    };

    if (repeatOpen) {
        repeatOpen.addEventListener("click", openRepeatOverlay);
    }

    repeatClose.forEach((btn) => {
        btn.addEventListener("click", closeRepeatOverlay);
    });

    if (repeatForm) {
        repeatForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const formData = new FormData(repeatForm);
            const title = normalizeText(formData.get("title"));
            if (!title) return;
            const day = normalizeText(formData.get("day"));
            const time = normalizeText(formData.get("time"));
            addRule({
                action: "add",
                kind: "task",
                title,
                time,
                repeat: "day",
                day,
            });
            repeatForm.reset();
            closeRepeatOverlay();
        });
    }

    const init = async () => {
        initRepeatSelects();
        refreshTimeSelects();
        ensureRoutineTaskRow();
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
