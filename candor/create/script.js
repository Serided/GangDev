(() => {
    const body = document.body;
    const rawKey = body && body.dataset && body.dataset.userKey ? body.dataset.userKey : "local";
    const userKey = String(rawKey || "local").trim() || "local";
    const clockCookieKey = body && body.dataset && body.dataset.clockCookie
        ? body.dataset.clockCookie
        : `candor_time_format_${userKey}`;
    const birthdateRaw = body && body.dataset && body.dataset.birthdate ? body.dataset.birthdate : "";
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

    const getAgeYears = (value) => {
        if (!value) return null;
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return null;
        const now = new Date();
        let age = now.getFullYear() - date.getFullYear();
        const monthDelta = now.getMonth() - date.getMonth();
        if (monthDelta < 0 || (monthDelta === 0 && now.getDate() < date.getDate())) {
            age -= 1;
        }
        return age >= 0 ? age : null;
    };

    const ageYears = getAgeYears(birthdateRaw);

    const recommendedSleepMinutes = (age) => {
        if (age === null) return Math.round(8.5 * 60);
        if (age < 1) return 15 * 60;
        if (age <= 2) return Math.round(13.5 * 60);
        if (age <= 5) return 12 * 60;
        if (age <= 13) return Math.round(10.5 * 60);
        if (age <= 17) return Math.round(9.5 * 60);
        if (age <= 25) return 9 * 60;
        if (age <= 64) return Math.round(8.5 * 60);
        return 8 * 60;
    };

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

    const addMinutes = (time, minutes) => {
        const base = parseMinutes(time);
        if (base === null) return "";
        const total = (base + minutes) % (24 * 60);
        const safe = total < 0 ? total + (24 * 60) : total;
        const hours = Math.floor(safe / 60);
        const mins = safe % 60;
        return `${pad2(hours)}:${pad2(mins)}`;
    };

    const pad2 = (value) => String(value).padStart(2, "0");

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    const formatDialHour = (hour) => {
        if (!Number.isFinite(hour)) return "";
        if (clockMode === "24") return pad2(hour);
        let display = hour % 12;
        if (display === 0) display = 12;
        return String(display);
    };

    const parseTimeValue = (value) => {
        const match = String(value || "").match(/^(\d{2}):(\d{2})$/);
        if (!match) return null;
        const hour = parseInt(match[1], 10);
        const minute = parseInt(match[2], 10);
        if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
        return { hour, minute };
    };

    const getDialState = (dial) => {
        const hour = dial.dataset.hour !== undefined && dial.dataset.hour !== ""
            ? parseInt(dial.dataset.hour, 10)
            : null;
        const minute = dial.dataset.minute !== undefined && dial.dataset.minute !== ""
            ? parseInt(dial.dataset.minute, 10)
            : null;
        return {
            hour: Number.isFinite(hour) ? hour : null,
            minute: Number.isFinite(minute) ? minute : null,
        };
    };

    const setDialValue = (dial, hour, minute) => {
        const output = dial.querySelector("[data-time-output]");
        const hourInput = dial.querySelector("[data-dial-hour]");
        const minuteInput = dial.querySelector("[data-dial-minute]");
        if (!output || !hourInput || !minuteInput) return;
        const emitChange = () => {
            dial.dispatchEvent(new CustomEvent("timechange", { bubbles: true }));
        };
        if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
            output.value = "";
            dial.dataset.hour = "";
            dial.dataset.minute = "";
            hourInput.value = "";
            minuteInput.value = "";
            dial.classList.add("is-empty");
            emitChange();
            return;
        }
        const safeHour = clamp(Math.round(hour), 0, 23);
        const safeMinute = clamp(Math.round(minute), 0, 59);
        output.value = `${pad2(safeHour)}:${pad2(safeMinute)}`;
        dial.dataset.hour = String(safeHour);
        dial.dataset.minute = String(safeMinute);
        hourInput.value = formatDialHour(safeHour);
        minuteInput.value = pad2(safeMinute);
        dial.classList.remove("is-empty");
        emitChange();
    };

    const syncDialFromOutput = (dial) => {
        const output = dial.querySelector("[data-time-output]");
        if (!output) return;
        const parsed = parseTimeValue(output.value);
        if (!parsed) {
            setDialValue(dial, null, null);
            return;
        }
        setDialValue(dial, parsed.hour, parsed.minute);
    };

    const sanitizeInput = (input) => {
        if (!input) return "";
        const cleaned = input.value.replace(/[^\d]/g, "");
        if (cleaned !== input.value) {
            input.value = cleaned;
        }
        return cleaned;
    };

    const updateDialFromInputs = (dial) => {
        const hourInput = dial.querySelector("[data-dial-hour]");
        const minuteInput = dial.querySelector("[data-dial-minute]");
        if (!hourInput || !minuteInput) return;
        const rawHour = sanitizeInput(hourInput);
        const rawMinute = sanitizeInput(minuteInput);
        const { hour: currentHour, minute: currentMinute } = getDialState(dial);

        const hourValue = rawHour === "" ? currentHour : parseInt(rawHour, 10);
        const minuteValue = rawMinute === "" ? currentMinute : parseInt(rawMinute, 10);

        const hasHour = Number.isFinite(hourValue);
        const hasMinute = Number.isFinite(minuteValue);

        if (!hasHour && !hasMinute) {
            setDialValue(dial, null, null);
            return;
        }

        const safeHour = hasHour ? clamp(hourValue, 0, 23) : 0;
        const safeMinute = hasMinute ? clamp(minuteValue, 0, 59) : 0;
        setDialValue(dial, safeHour, safeMinute);
    };

    const stepDial = (dial, unit, dir) => {
        const state = getDialState(dial);
        let hour = Number.isFinite(state.hour) ? state.hour : 0;
        let minute = Number.isFinite(state.minute) ? state.minute : 0;
        if (unit === "hour") {
            hour = (hour + dir + 24) % 24;
        } else {
            let nextMinute = minute + dir;
            if (nextMinute > 59) {
                nextMinute = 0;
                hour = (hour + 1) % 24;
            } else if (nextMinute < 0) {
                nextMinute = 59;
                hour = (hour + 23) % 24;
            }
            minute = nextMinute;
        }
        setDialValue(dial, hour, minute);
    };

    const bindTimeDial = (dial) => {
        if (!dial || dial.dataset.bound === "true") return;
        dial.dataset.bound = "true";
        syncDialFromOutput(dial);
        const hourInput = dial.querySelector("[data-dial-hour]");
        const minuteInput = dial.querySelector("[data-dial-minute]");
        if (hourInput) {
            hourInput.addEventListener("input", () => updateDialFromInputs(dial));
            hourInput.addEventListener("blur", () => syncDialFromOutput(dial));
        }
        if (minuteInput) {
            minuteInput.addEventListener("input", () => updateDialFromInputs(dial));
            minuteInput.addEventListener("blur", () => syncDialFromOutput(dial));
        }
        dial.addEventListener("click", (event) => {
            const btn = event.target.closest("[data-dial-step]");
            if (!btn) return;
            const unit = btn.dataset.dialStep;
            const dir = parseInt(btn.dataset.dialDir, 10) || 0;
            if (unit !== "hour" && unit !== "minute") return;
            if (!dir) return;
            stepDial(dial, unit, dir);
        });
    };

    const initTimeDials = (scope = document) => {
        scope.querySelectorAll("[data-time-dial]").forEach((dial) => bindTimeDial(dial));
    };

    const refreshTimeDials = () => {
        document.querySelectorAll("[data-time-dial]").forEach((dial) => syncDialFromOutput(dial));
    };

    const clearTimeDials = (scope) => {
        if (!scope) return;
        scope.querySelectorAll("[data-time-dial]").forEach((dial) => setDialValue(dial, null, null));
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
            return value.map((item) => {
                if (typeof item === "string") {
                    return { title: normalizeText(item), minutes: null };
                }
                if (item && typeof item === "object") {
                    const title = normalizeText(item.title ?? item.text ?? "");
                    const minutesRaw = item.minutes ?? item.duration ?? item.time;
                    const minutes = Number.isFinite(parseInt(minutesRaw, 10)) ? parseInt(minutesRaw, 10) : null;
                    return { title, minutes };
                }
                return null;
            }).filter((item) => item && item.title !== "");
        }
        if (typeof value === "string") {
            const trimmed = value.trim();
            if (trimmed === "") return [];
            if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
                try {
                    const parsed = JSON.parse(trimmed);
                    if (Array.isArray(parsed)) {
                        return normalizeRoutineTasks(parsed);
                    }
                } catch {
                    return splitList(trimmed).map((item) => ({ title: item, minutes: null }));
                }
            }
            return splitList(trimmed).map((item) => ({ title: item, minutes: null }));
        }
        return [];
    };

    const normalizeDays = (value) => {
        if (Array.isArray(value)) {
            const days = value
                .map((item) => (typeof item === "number" ? item : parseInt(item, 10)))
                .filter((item) => Number.isFinite(item) && item >= 0 && item <= 6);
            return Array.from(new Set(days)).sort((a, b) => a - b);
        }
        if (typeof value === "number") {
            return Number.isFinite(value) ? [value] : [];
        }
        if (typeof value === "string") {
            const trimmed = value.trim();
            if (!trimmed) return [];
            if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
                try {
                    const parsed = JSON.parse(trimmed);
                    return normalizeDays(parsed);
                } catch {
                    return [];
                }
            }
            const days = trimmed
                .split(",")
                .map((item) => parseInt(item.trim(), 10))
                .filter((item) => Number.isFinite(item) && item >= 0 && item <= 6);
            return Array.from(new Set(days)).sort((a, b) => a - b);
        }
        return [];
    };

    const normalizeRoutine = (item) => {
        const repeatValue = normalizeText(item.repeat ?? item.repeat_rule ?? "daily");
        const dayValue = item.day ?? item.day_of_week;
        const parsedDay = typeof dayValue === "number" ? dayValue : parseInt(dayValue, 10);
        const days = normalizeDays(item.days ?? item.days_json ?? item.days_of_week ?? dayValue);
        const allowed = ["daily", "weekdays", "weekends", "day"];
        const repeat = allowed.includes(repeatValue) ? repeatValue : "daily";
        return {
            id: String(item.id ?? ""),
            title: normalizeText(item.title ?? ""),
            time: normalizeText(item.time ?? item.routine_time ?? ""),
            tasks: normalizeRoutineTasks(item.tasks ?? item.tasks_json ?? ""),
            repeat,
            day: Number.isFinite(parsedDay) ? parsedDay : (days[0] ?? null),
            days,
        };
    };

    const routineDuration = (routine) => {
        if (!routine || !Array.isArray(routine.tasks)) return 0;
        return routine.tasks.reduce((sum, task) => {
            const minutes = Number.isFinite(task.minutes) ? task.minutes : 0;
            return sum + minutes;
        }, 0);
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

    const formatRepeatRule = (repeat, day, days = []) => {
        if (repeat === "weekdays") return "Weekdays";
        if (repeat === "weekends") return "Weekends";
        if (repeat === "daily") return "Daily";
        if (repeat === "day") {
            const list = (Array.isArray(days) && days.length)
                ? days
                : (Number.isFinite(day) ? [day] : []);
            if (list.length) {
                return list.map((value) => dayNames[value] || "Day").join(", ");
            }
            return "Specific days";
        }
        return "Custom";
    };

    const formatRepeat = (rule) => formatRepeatRule(rule.repeat, rule.day, rule.days);

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
            const repeat = formatRepeatRule(routine.repeat, routine.day, routine.days);
            const tasks = Array.isArray(routine.tasks) ? routine.tasks : [];
            const total = routineDuration(routine);
            const detail = total > 0 ? `${total} min` : (tasks.length ? `${tasks.length} tasks` : "No tasks");
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

    const appliesToDay = (repeat, dayValue, daysValue, targetDay) => {
        if (repeat === "daily") return true;
        if (repeat === "weekdays") return targetDay >= 1 && targetDay <= 5;
        if (repeat === "weekends") return targetDay === 0 || targetDay === 6;
        if (repeat === "day") {
            if (Array.isArray(daysValue) && daysValue.length) {
                return daysValue.includes(targetDay);
            }
            return Number.isFinite(dayValue) && dayValue === targetDay;
        }
        return false;
    };

    const getWeekItems = (targetDay) => {
        const items = [];
        state.routines.forEach((routine) => {
            if (!appliesToDay(routine.repeat, routine.day, routine.days, targetDay)) return;
            items.push({
                type: "routine",
                title: routine.title || "Routine",
                time: routine.time,
                duration: routineDuration(routine),
            });
        });
        state.tasks.forEach((rule) => {
            if (!appliesToDay(rule.repeat, rule.day, [], targetDay)) return;
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

                const time = document.createElement("div");
                time.className = "weekItemTime";
                if (item.time) {
                    time.textContent = formatTime(item.time);
                } else if (item.duration) {
                    time.textContent = `${item.duration}m`;
                } else {
                    time.textContent = "";
                }
                row.appendChild(time);

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
    const sleepStartInput = sleepForm ? sleepForm.querySelector("#sleep-start") : null;
    const sleepEndInput = sleepForm ? sleepForm.querySelector("#sleep-end") : null;
    const sleepStartDial = sleepStartInput ? sleepStartInput.closest("[data-time-dial]") : null;
    const sleepEndDial = sleepEndInput ? sleepEndInput.closest("[data-time-dial]") : null;
    const sleepRepeatSelect = sleepForm ? sleepForm.querySelector("[data-repeat-select]") : null;
    const sleepDaySelect = sleepForm ? sleepForm.querySelector("#sleep-day") : null;

    const sleepMinutesForRepeat = () => {
        const repeat = sleepRepeatSelect ? normalizeText(sleepRepeatSelect.value) : "";
        const dayValue = sleepDaySelect ? parseInt(sleepDaySelect.value, 10) : null;
        const base = recommendedSleepMinutes(ageYears);
        const weekendBonus = 120;
        if (repeat === "weekends") {
            return base + weekendBonus;
        }
        if (repeat === "day" && Number.isFinite(dayValue)) {
            if (dayValue === 0 || dayValue === 6) {
                return base + weekendBonus;
            }
        }
        return base;
    };

    const updateSleepEnd = () => {
        if (!sleepStartInput || !sleepEndDial) return;
        const start = normalizeText(sleepStartInput.value);
        if (!start) {
            setDialValue(sleepEndDial, null, null);
            return;
        }
        const duration = sleepMinutesForRepeat();
        const endValue = addMinutes(start, duration);
        const parsed = parseTimeValue(endValue);
        if (!parsed) return;
        setDialValue(sleepEndDial, parsed.hour, parsed.minute);
    };
    if (sleepForm) {
        sleepForm.addEventListener("submit", (event) => {
            event.preventDefault();
            updateSleepEnd();
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
            clearTimeDials(sleepForm);
            const sleepRepeat = sleepForm.querySelector("[data-repeat-select]");
            const sleepDayField = sleepForm.querySelector("[data-day-field]");
            applyRepeatToggle(sleepRepeat, sleepDayField);
        });
    }

    if (sleepStartDial) {
        sleepStartDial.addEventListener("timechange", updateSleepEnd);
    }
    if (sleepRepeatSelect) {
        sleepRepeatSelect.addEventListener("change", () => {
            updateSleepEnd();
        });
    }
    if (sleepDaySelect) {
        sleepDaySelect.addEventListener("change", () => {
            updateSleepEnd();
        });
    }

    const sleepClear = document.querySelector("[data-sleep-clear]");
    if (sleepClear) {
        sleepClear.addEventListener("click", () => {
            clearRules("sleep");
            if (sleepForm) {
                sleepForm.reset();
                clearTimeDials(sleepForm);
                const sleepRepeat = sleepForm.querySelector("[data-repeat-select]");
                const sleepDayField = sleepForm.querySelector("[data-day-field]");
                applyRepeatToggle(sleepRepeat, sleepDayField);
            }
        });
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
            const dayInputs = Array.from(routineForm.querySelectorAll("[data-routine-day]"));
            const days = dayInputs
                .filter((input) => input.checked)
                .map((input) => parseInt(input.value, 10))
                .filter((value) => Number.isFinite(value) && value >= 0 && value <= 6);
            if (repeat === "day" && days.length === 0) return;
            const tasks = Array.from(routineForm.querySelectorAll("[data-task-row]"))
                .map((row) => {
                    const titleField = row.querySelector("[data-task-title]");
                    const minutesField = row.querySelector("[data-task-minutes]");
                    const taskTitle = normalizeText(titleField ? titleField.value : "");
                    const rawMinutes = minutesField ? parseInt(minutesField.value, 10) : NaN;
                    const minutes = Number.isFinite(rawMinutes) && rawMinutes > 0 ? rawMinutes : null;
                    return taskTitle ? { title: taskTitle, minutes } : null;
                })
                .filter((item) => item && item.title !== "");
            addRoutine({
                action: "add_routine",
                title,
                time,
                repeat,
                day: days[0],
                days,
                tasks,
            });
            routineForm.reset();
            clearTimeDials(routineForm);
            const routineRepeat = routineForm.querySelector("[data-routine-repeat]");
            const routineDayField = routineForm.querySelector("[data-routine-day-field]");
            applyRepeatToggle(routineRepeat, routineDayField);
            dayInputs.forEach((input) => {
                input.checked = false;
            });
            clearRoutineTasks();
        });
    }

    const routineTaskStack = document.querySelector("[data-routine-tasks]");
    const routineAddTask = document.querySelector("[data-routine-add-task]");
    const routineTotal = document.querySelector("[data-routine-total]");

    const buildRoutineTaskRow = (task = {}) => {
        const row = document.createElement("div");
        row.className = "taskRow";
        row.dataset.taskRow = "true";

        const input = document.createElement("input");
        input.className = "input compact";
        input.type = "text";
        input.placeholder = "Task";
        input.dataset.taskTitle = "true";
        input.value = task.title || "";

        const minutes = document.createElement("input");
        minutes.className = "input compact taskMinutes";
        minutes.type = "number";
        minutes.inputMode = "numeric";
        minutes.min = "1";
        minutes.step = "1";
        minutes.placeholder = "Min";
        minutes.dataset.taskMinutes = "true";
        if (Number.isFinite(task.minutes)) {
            minutes.value = String(task.minutes);
        }

        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "taskRemove";
        remove.dataset.routineTaskRemove = "true";
        remove.textContent = "x";

        row.appendChild(input);
        row.appendChild(minutes);
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
        updateRoutineTotal();
    };

    const updateRoutineTotal = () => {
        if (!routineTotal || !routineTaskStack) return;
        const rows = Array.from(routineTaskStack.querySelectorAll("[data-task-row]"));
        const total = rows.reduce((sum, row) => {
            const minutesField = row.querySelector("[data-task-minutes]");
            const value = minutesField ? parseInt(minutesField.value, 10) : NaN;
            if (!Number.isFinite(value) || value <= 0) return sum;
            return sum + value;
        }, 0);
        routineTotal.textContent = `Estimated: ${total || 0} min`;
    };

    if (routineAddTask) {
        routineAddTask.addEventListener("click", () => {
            if (!routineTaskStack) return;
            routineTaskStack.appendChild(buildRoutineTaskRow());
            updateRoutineTotal();
        });
    }

    if (routineTaskStack) {
        routineTaskStack.addEventListener("input", (event) => {
            if (event.target && event.target.matches("[data-task-title], [data-task-minutes]")) {
                updateRoutineTotal();
            }
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
                const minutes = row.querySelector("[data-task-minutes]");
                if (minutes) minutes.value = "";
                updateRoutineTotal();
                return;
            }
            row.remove();
            updateRoutineTotal();
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
            clearTimeDials(repeatForm);
            closeRepeatOverlay();
        });
    }

    const init = async () => {
        initRepeatSelects();
        initTimeDials();
        ensureRoutineTaskRow();
        updateRoutineTotal();
        try {
            await loadRemote();
        } catch {
            storageMode = "local";
            loadLocal();
        }
        renderAll();
        updateSleepEnd();
    };

    init();
})();
