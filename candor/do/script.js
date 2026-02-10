(function () {
    const body = document.body;
    const rawKey = body && body.dataset && body.dataset.userKey ? body.dataset.userKey : "local";
    const userKey = String(rawKey || "local").trim() || "local";
    const keyFor = (name) => `candor_do_${userKey}_${name}`;
    const clockCookieKey = body && body.dataset && body.dataset.clockCookie
        ? body.dataset.clockCookie
        : "candor_time_format";
    const birthdateRaw = body && body.dataset && body.dataset.birthdate ? body.dataset.birthdate : "";
    const userNameRaw = body && body.dataset && body.dataset.userName ? body.dataset.userName : "";

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

    const loadJson = (name, fallback) => {
        const raw = localStorage.getItem(keyFor(name));
        if (!raw) return fallback;
        try {
            return JSON.parse(raw);
        } catch {
            return fallback;
        }
    };

    const saveJson = (name, value) => {
        localStorage.setItem(keyFor(name), JSON.stringify(value));
    };

    const state = {
        tasks: [],
        notes: [],
        windows: [],
        rules: [],
        routineCount: 0,
        sleepLogs: [],
        shifts: [],
        shiftOverrides: {},
        activeSession: null,
    };

    const shiftOverridesLocal = loadJson("shift_overrides", {});
    const activeSessionLocal = loadJson("active_session", null);

    const makeId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

    const normalizeText = (value) => String(value ?? "").trim();

    const normalizeTask = (item) => {
        const rawDuration = item.duration ?? item.estimated_minutes ?? "";
        const parsedDuration = parseInt(rawDuration, 10);
        return {
            id: String(item.id ?? makeId()),
            text: normalizeText(item.text ?? item.title ?? ""),
            done: Boolean(item.done ?? item.completed ?? false),
            date: normalizeText(item.date ?? item.due_date ?? ""),
            time: normalizeText(item.time ?? item.due_time ?? ""),
            duration: Number.isFinite(parsedDuration) && parsedDuration > 0 ? parsedDuration : null,
        };
    };

    const normalizeNote = (item) => ({
        id: String(item.id ?? makeId()),
        title: normalizeText(item.title ?? ""),
        body: normalizeText(item.body ?? item.text ?? ""),
    });

    const normalizeWindow = (item) => ({
        id: String(item.id ?? makeId()),
        text: normalizeText(item.text ?? item.title ?? ""),
        date: normalizeText(item.date ?? ""),
        start: normalizeText(item.start ?? item.time ?? ""),
        end: normalizeText(item.end ?? item.end_time ?? ""),
        kind: item.kind === "event" ? "event" : "window",
        color: normalizeText(item.color ?? ""),
        locked: Boolean(item.locked),
    });

    const normalizeRule = (item) => {
        const dayValue = item.day ?? item.day_of_week;
        const parsedDay = typeof dayValue === "number" ? dayValue : parseInt(dayValue, 10);
        return {
            id: String(item.id ?? makeId()),
            kind: item.kind === "task" ? "task" : "sleep",
            title: normalizeText(item.title ?? ""),
            start: normalizeText(item.start ?? item.start_time ?? item.time ?? ""),
            end: normalizeText(item.end ?? item.end_time ?? ""),
            repeat: normalizeText(item.repeat ?? item.repeat_rule ?? ""),
            day: Number.isFinite(parsedDay) ? parsedDay : null,
        };
    };

    const normalizeSleepLog = (item) => ({
        date: normalizeText(item.date ?? item.day ?? ""),
        start: normalizeText(item.start ?? item.start_time ?? ""),
        end: normalizeText(item.end ?? item.end_time ?? ""),
    });

    const normalizeShift = (item) => ({
        id: String(item.id ?? ""),
        name: normalizeText(item.name ?? ""),
        start: normalizeText(item.start ?? item.start_time ?? ""),
        end: normalizeText(item.end ?? item.end_time ?? ""),
        commuteBefore: Number.isFinite(item.commute_before) ? item.commute_before : parseInt(item.commute_before ?? "0", 10) || 0,
        commuteAfter: Number.isFinite(item.commute_after) ? item.commute_after : parseInt(item.commute_after ?? "0", 10) || 0,
        isDefault: Boolean(item.is_default),
    });

    const normalizeShiftOverride = (item) => ({
        date: normalizeText(item.date ?? ""),
        shiftId: item.shift_id ?? item.shiftId ?? null,
        start: normalizeText(item.start ?? item.start_time ?? ""),
        end: normalizeText(item.end ?? item.end_time ?? ""),
    });

    const normalizeShiftOverrideMap = (value) => {
        const map = {};
        if (!value || typeof value !== "object") return map;
        Object.entries(value).forEach(([key, entry]) => {
            if (!key) return;
            if (entry && typeof entry === "object") {
                map[key] = {
                    shiftId: entry.shiftId ?? entry.shift_id ?? null,
                    start: normalizeText(entry.start ?? ""),
                    end: normalizeText(entry.end ?? ""),
                };
                return;
            }
            if (entry === null) {
                map[key] = { shiftId: null, start: "", end: "" };
                return;
            }
            if (entry !== undefined && entry !== "") {
                map[key] = { shiftId: entry, start: "", end: "" };
            }
        });
        return map;
    };

    const persistLocal = () => {
        saveItems("tasks", state.tasks);
        saveItems("notes", state.notes);
        saveItems("windows", state.windows);
        saveItems("rules", state.rules);
        saveItems("sleep_logs", state.sleepLogs);
        saveItems("shifts", state.shifts);
        saveJson("shift_overrides", state.shiftOverrides);
        saveJson("active_session", state.activeSession);
    };

    const setActiveSession = (session) => {
        state.activeSession = session;
        saveJson("active_session", session);
    };

    const clearActiveSession = () => {
        state.activeSession = null;
        saveJson("active_session", null);
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
        state.tasks = loadItems("tasks").map(normalizeTask);
        state.notes = loadItems("notes").map(normalizeNote);
        state.windows = loadItems("windows").map(normalizeWindow);
        state.rules = loadItems("rules").map(normalizeRule);
        state.sleepLogs = loadItems("sleep_logs").map(normalizeSleepLog);
        state.shifts = loadItems("shifts").map(normalizeShift);
        state.shiftOverrides = normalizeShiftOverrideMap(shiftOverridesLocal);
        state.activeSession = activeSessionLocal && typeof activeSessionLocal === "object" ? activeSessionLocal : null;
        state.routineCount = 0;
    };

    const switchToLocal = () => {
        storageMode = "local";
        persistLocal();
    };

    const loadRemote = async () => {
        const data = await apiFetch({ action: "load" }, "GET");
        state.tasks = Array.isArray(data.tasks) ? data.tasks.map(normalizeTask) : [];
        state.notes = Array.isArray(data.notes) ? data.notes.map(normalizeNote) : [];
        const windowItems = Array.isArray(data.windows)
            ? data.windows
            : (Array.isArray(data.blocks) ? data.blocks : []);
        state.windows = windowItems.map(normalizeWindow);
        state.rules = Array.isArray(data.rules) ? data.rules.map(normalizeRule) : [];
        state.sleepLogs = Array.isArray(data.sleep_logs) ? data.sleep_logs.map(normalizeSleepLog) : [];
        state.shifts = Array.isArray(data.shifts) ? data.shifts.map(normalizeShift) : [];
        const overrides = Array.isArray(data.shift_overrides) ? data.shift_overrides.map(normalizeShiftOverride) : [];
        state.shiftOverrides = overrides.reduce((acc, item) => {
            if (item.date) {
                acc[item.date] = {
                    shiftId: item.shiftId ?? null,
                    start: item.start || "",
                    end: item.end || "",
                };
            }
            return acc;
        }, {});
        state.activeSession = activeSessionLocal && typeof activeSessionLocal === "object" ? activeSessionLocal : null;
        const routineCount = parseInt(data.routine_count ?? "", 10);
        state.routineCount = Number.isFinite(routineCount) ? routineCount : 0;
    };

    const init = async () => {
        try {
            await loadRemote();
        } catch {
            storageMode = "local";
            loadLocal();
        }
        initTimePicker();
        initTimeFields();
        refreshUI(true);
    };

    const dateKey = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    };

    const parseKey = (key) => {
        const [y, m, d] = key.split("-").map((part) => parseInt(part, 10));
        return new Date(y, m - 1, d);
    };

    const isSameDay = (a, b) =>
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();

    const getISOWeek = (date) => {
        const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = tmp.getUTCDay() || 7;
        tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
        return Math.ceil((((tmp - yearStart) / 86400000) + 1) / 7);
    };

    const parseMinutes = (time) => {
        if (!time) return null;
        const parts = time.split(":");
        if (parts.length < 2) return null;
        const hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);
        if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
        return (hours * 60) + minutes;
    };

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

    const durationMinutes = (start, end) => {
        const startMin = parseMinutes(start);
        const endMin = parseMinutes(end);
        if (startMin === null || endMin === null) return null;
        let diff = endMin - startMin;
        if (diff < 0) diff += 24 * 60;
        return diff;
    };

    const addMinutesToTime = (time, delta) => {
        const base = parseMinutes(time);
        if (base === null) return "";
        let total = (base + delta) % (24 * 60);
        if (total < 0) total += 24 * 60;
        const hours = Math.floor(total / 60);
        const minutes = total % 60;
        return `${pad2(hours)}:${pad2(minutes)}`;
    };

    const parseBirthdate = (value) => {
        const parts = String(value || "").split("-");
        if (parts.length < 3) return null;
        const month = parseInt(parts[1], 10);
        const day = parseInt(parts[2], 10);
        if (!Number.isFinite(month) || !Number.isFinite(day)) return null;
        return { month, day };
    };

    const birthdayInfo = parseBirthdate(birthdateRaw);
    const userName = normalizeText(userNameRaw);
    const ageYears = getAgeYears(birthdateRaw);

    const birthdayTitle = () => {
        const name = userName || "User";
        const endsWithS = name.toLowerCase().endsWith("s");
        return endsWithS ? `${name}' Birthday` : `${name}'s Birthday`;
    };

    const birthdayEventFor = (date) => {
        if (!birthdayInfo) return null;
        if ((date.getMonth() + 1) !== birthdayInfo.month || date.getDate() !== birthdayInfo.day) return null;
        return {
            id: `birthday-${date.getFullYear()}`,
            text: birthdayTitle(),
            date: dateKey(date),
            start: "00:00",
            end: "23:59",
            kind: "event",
            color: "#f3c873",
            locked: true,
        };
    };

    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const ruleApplies = (rule, date) => {
        const dow = date.getDay();
        if (rule.repeat === "daily") return true;
        if (rule.repeat === "weekdays") return dow >= 1 && dow <= 5;
        if (rule.repeat === "weekends") return dow === 0 || dow === 6;
        if (rule.repeat === "day") return Number.isFinite(rule.day) && rule.day === dow;
        return false;
    };

    const pickSleepRule = (date) => {
        const rules = state.rules.filter((rule) => rule.kind === "sleep" && ruleApplies(rule, date));
        if (rules.length === 0) return null;
        const pickOrder = ["day", "weekdays", "weekends", "daily"];
        const sorted = rules.slice().sort((a, b) => {
            const aScore = pickOrder.indexOf(a.repeat);
            const bScore = pickOrder.indexOf(b.repeat);
            return aScore - bScore;
        });
        return sorted[0];
    };

    const formatRepeat = (rule) => {
        if (!rule) return "";
        if (rule.repeat === "weekdays") return "Weekdays";
        if (rule.repeat === "weekends") return "Weekends";
        if (rule.repeat === "daily") return "Daily";
        if (rule.repeat === "day" && Number.isFinite(rule.day)) {
            return dayNames[rule.day] || "Day";
        }
        return "Custom";
    };

    const getCookie = (name) => {
        const match = document.cookie.split("; ").find((row) => row.startsWith(`${name}=`));
        return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : "";
    };

    let clockMode = getCookie(clockCookieKey) === "12" ? "12" : "24";

    const formatTime = (time) => {
        if (!time) return "";
        const minutes = parseMinutes(time);
        if (minutes === null) return time;
        if (clockMode === "24") {
            const hours = Math.floor(minutes / 60);
            return `${String(hours).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
        }
        let hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        const meridiem = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        if (hours === 0) hours = 12;
        return `${hours}:${String(mins).padStart(2, "0")} ${meridiem}`;
    };

    const formatHour = (hour) => formatTime(`${String(hour).padStart(2, "0")}:00`);

    const pad2 = (value) => String(value).padStart(2, "0");

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);


    const parseTimeValue = (value) => {
        const match = String(value || "").match(/^(\d{2}):(\d{2})$/);
        if (!match) return null;
        const hour = parseInt(match[1], 10);
        const minute = parseInt(match[2], 10);
        if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
        return { hour, minute };
    };

    const setFieldValue = (field, value, options = {}) => {
        if (!field) return;
        const output = field.querySelector("[data-time-output]");
        const display = field.querySelector("[data-time-display]");
        const empty = field.dataset.timeEmpty || "--:--";
        const emit = options.emit !== false;
        const nextValue = value ? String(value) : "";
        if (output) output.value = nextValue;
        if (display) {
            display.textContent = nextValue ? formatTime(nextValue) : empty;
        }
        field.classList.toggle("is-empty", !nextValue);
        if (emit) {
            field.dispatchEvent(new CustomEvent("timechange", { bubbles: true }));
        }
    };

    const refreshTimeField = (field) => {
        if (!field) return;
        const output = field.querySelector("[data-time-output]");
        const value = output ? output.value : "";
        setFieldValue(field, value, { emit: false });
    };

    const refreshTimeFields = (scope = document) => {
        scope.querySelectorAll("[data-time-field]").forEach((field) => refreshTimeField(field));
    };

    const clearTimeField = (input) => {
        if (!input) return;
        const field = input.closest("[data-time-field]");
        if (field) {
            setFieldValue(field, "", { emit: false });
        } else {
            input.value = "";
        }
    };


    const timeOverlay = document.querySelector("[data-time-overlay]");
    const timeTitle = timeOverlay ? timeOverlay.querySelector("[data-time-title]") : null;
    const timeHourWheel = timeOverlay ? timeOverlay.querySelector('[data-time-wheel="hour"]') : null;
    const timeMinuteWheel = timeOverlay ? timeOverlay.querySelector('[data-time-wheel="minute"]') : null;
    const timeHourTrack = timeOverlay ? timeOverlay.querySelector("[data-time-hours]") : null;
    const timeMinuteTrack = timeOverlay ? timeOverlay.querySelector("[data-time-minutes]") : null;
    const timeApply = timeOverlay ? timeOverlay.querySelector("[data-time-apply]") : null;
    const timeCancel = timeOverlay ? timeOverlay.querySelector("[data-time-cancel]") : null;
    const timeClose = timeOverlay ? timeOverlay.querySelector("[data-time-close]") : null;
    const timeManualHour = timeOverlay ? timeOverlay.querySelector("[data-time-manual-hour]") : null;
    const timeManualMinute = timeOverlay ? timeOverlay.querySelector("[data-time-manual-minute]") : null;
    const timeMeridiem = timeOverlay ? timeOverlay.querySelector("[data-time-meridiem]") : null;
    const timeMeridiemButtons = timeOverlay ? Array.from(timeOverlay.querySelectorAll("[data-meridiem]")) : [];

    let activeTimeField = null;
    let activeHour = 0;
    let activeMinute = 0;
    let activeMeridiem = "am";

    const formatHourLabel = (hour) => (clockMode === "24" ? pad2(hour) : String(hour));

    const buildWheel = (track, values, formatter) => {
        if (!track) return;
        track.innerHTML = "";
        values.forEach((value) => {
            const item = document.createElement("div");
            item.className = "timeWheelItem";
            item.dataset.timeValue = String(value);
            item.textContent = formatter(value);
            track.appendChild(item);
        });
    };

    const buildTimeWheels = () => {
        const hourValues = clockMode === "24"
            ? Array.from({ length: 24 }, (_, i) => i)
            : Array.from({ length: 12 }, (_, i) => i + 1);
        buildWheel(timeHourTrack, hourValues, formatHourLabel);
        buildWheel(timeMinuteTrack, Array.from({ length: 60 }, (_, i) => i), (value) => pad2(value));
        if (timeMeridiem) {
            timeMeridiem.style.display = clockMode === "12" ? "flex" : "none";
        }
    };

    const displayHourFromActive = () => {
        if (clockMode === "24") return activeHour;
        const raw = activeHour % 12;
        return raw === 0 ? 12 : raw;
    };

    const setActiveHourFromDisplay = (displayHour) => {
        if (clockMode === "24") {
            activeHour = clamp(displayHour, 0, 23);
            return;
        }
        const safe = clamp(displayHour, 1, 12);
        activeHour = safe % 12;
        if (activeMeridiem === "pm") {
            activeHour += 12;
        }
    };

    const getWheelItems = (wheel) => (wheel ? Array.from(wheel.querySelectorAll(".timeWheelItem")) : []);

    const setWheelActive = (wheel, value) => {
        const items = getWheelItems(wheel);
        items.forEach((item) => {
            item.classList.toggle("is-active", parseInt(item.dataset.timeValue, 10) === value);
        });
    };

    const readWheelValue = (wheel) => {
        const items = getWheelItems(wheel);
        if (!items.length) return 0;
        const itemHeight = items[0].offsetHeight || 32;
        const paddingTop = parseFloat(getComputedStyle(wheel).paddingTop) || 0;
        const center = wheel.scrollTop + wheel.clientHeight / 2;
        const index = Math.round((center - paddingTop - itemHeight / 2) / itemHeight);
        const safeIndex = clamp(index, 0, items.length - 1);
        const value = parseInt(items[safeIndex].dataset.timeValue, 10);
        return Number.isFinite(value) ? value : 0;
    };

    const scrollWheelTo = (wheel, value) => {
        const items = getWheelItems(wheel);
        if (!items.length) return;
        const index = items.findIndex((item) => parseInt(item.dataset.timeValue, 10) === value);
        const targetIndex = index >= 0 ? index : 0;
        const itemHeight = items[0].offsetHeight || 32;
        const paddingTop = parseFloat(getComputedStyle(wheel).paddingTop) || 0;
        const offset = paddingTop + (targetIndex * itemHeight) - (wheel.clientHeight / 2) + (itemHeight / 2);
        const maxScroll = Math.max(0, wheel.scrollHeight - wheel.clientHeight);
        wheel.scrollTop = clamp(offset, 0, maxScroll);
        setWheelActive(wheel, value);
    };

    const updateMeridiemButtons = () => {
        if (!timeMeridiemButtons.length) return;
        timeMeridiemButtons.forEach((button) => {
            button.classList.toggle("is-active", button.dataset.meridiem === activeMeridiem);
        });
    };

    const updateManualInputs = (force = false) => {
        const hourFocused = timeManualHour && document.activeElement === timeManualHour;
        const minuteFocused = timeManualMinute && document.activeElement === timeManualMinute;
        if (timeManualHour && (!hourFocused || force)) {
            const displayHour = displayHourFromActive();
            timeManualHour.value = clockMode === "24" ? pad2(displayHour) : String(displayHour);
        }
        if (timeManualMinute && (!minuteFocused || force)) {
            timeManualMinute.value = pad2(activeMinute);
        }
        updateMeridiemButtons();
    };

    const bindWheel = (wheel, onChange) => {
        if (!wheel || wheel.dataset.bound === "true") return;
        wheel.dataset.bound = "true";
        let raf = null;
        let dragActive = false;
        let dragStartY = 0;
        let dragStartScroll = 0;
        let snapTimer = null;
        const handleScroll = () => {
            raf = null;
            const value = readWheelValue(wheel);
            onChange(value);
            setWheelActive(wheel, value);
            updateManualInputs();
            if (!dragActive) scheduleSnap();
        };
        const scheduleSnap = () => {
            if (snapTimer) window.clearTimeout(snapTimer);
            snapTimer = window.setTimeout(() => {
                const value = readWheelValue(wheel);
                scrollWheelTo(wheel, value);
            }, 120);
        };
        wheel.addEventListener("scroll", () => {
            if (raf) return;
            raf = requestAnimationFrame(handleScroll);
        });
        wheel.addEventListener("wheel", (event) => {
            event.preventDefault();
            wheel.scrollTop += event.deltaY;
            scheduleSnap();
        }, { passive: false });
        wheel.addEventListener("click", (event) => {
            const item = event.target.closest(".timeWheelItem");
            if (!item) return;
            const value = parseInt(item.dataset.timeValue, 10);
            if (!Number.isFinite(value)) return;
            scrollWheelTo(wheel, value);
            onChange(value);
            updateManualInputs();
        });
        wheel.addEventListener("pointerdown", (event) => {
            dragActive = true;
            dragStartY = event.clientY;
            dragStartScroll = wheel.scrollTop;
            wheel.setPointerCapture(event.pointerId);
            wheel.classList.add("is-dragging");
            event.preventDefault();
        });
        wheel.addEventListener("pointermove", (event) => {
            if (!dragActive) return;
            const delta = event.clientY - dragStartY;
            wheel.scrollTop = dragStartScroll - delta;
        });
        const endDrag = (event) => {
            if (!dragActive) return;
            dragActive = false;
            wheel.classList.remove("is-dragging");
            if (event && event.pointerId !== undefined) {
                wheel.releasePointerCapture(event.pointerId);
            }
            scheduleSnap();
        };
        wheel.addEventListener("pointerup", endDrag);
        wheel.addEventListener("pointercancel", endDrag);
    };

    const openTimePicker = (field) => {
        if (!timeOverlay || !field) return;
        activeTimeField = field;
        const label = field.dataset.timeLabel || "Set time";
        if (timeTitle) timeTitle.textContent = label;
        buildTimeWheels();
        const output = field.querySelector("[data-time-output]");
        const parsed = output ? parseTimeValue(output.value) : null;
        activeHour = parsed ? parsed.hour : 0;
        activeMinute = parsed ? parsed.minute : 0;
        activeMeridiem = activeHour >= 12 ? "pm" : "am";
        timeOverlay.classList.add("is-open");
        requestAnimationFrame(() => {
            if (timeHourWheel) {
                const hourValue = displayHourFromActive();
                scrollWheelTo(timeHourWheel, hourValue);
            }
            if (timeMinuteWheel) scrollWheelTo(timeMinuteWheel, activeMinute);
        });
        updateManualInputs();
    };

    const closeTimePicker = () => {
        if (!timeOverlay) return;
        timeOverlay.classList.remove("is-open");
        activeTimeField = null;
    };

    const applyTimePicker = () => {
        if (!activeTimeField) return;
        const value = `${pad2(activeHour)}:${pad2(activeMinute)}`;
        setFieldValue(activeTimeField, value);
    };

    const initTimePicker = () => {
        if (!timeOverlay) return;
        buildTimeWheels();
        bindWheel(timeHourWheel, (value) => {
            setActiveHourFromDisplay(value);
        });
        bindWheel(timeMinuteWheel, (value) => {
            activeMinute = value;
        });
        if (timeMeridiemButtons.length) {
            timeMeridiemButtons.forEach((button) => {
                button.addEventListener("click", () => {
                    activeMeridiem = button.dataset.meridiem === "pm" ? "pm" : "am";
                    setActiveHourFromDisplay(displayHourFromActive());
                    updateMeridiemButtons();
                });
            });
        }
        if (timeManualHour) {
            const applyManualHour = (raw) => {
                const safe = clockMode === "24" ? clamp(raw, 0, 23) : clamp(raw, 1, 12);
                setActiveHourFromDisplay(safe);
                if (timeHourWheel) scrollWheelTo(timeHourWheel, safe);
                updateMeridiemButtons();
            };
            const commitManualHour = () => {
                const raw = parseInt(timeManualHour.value, 10);
                if (Number.isFinite(raw)) {
                    applyManualHour(raw);
                }
                updateManualInputs(true);
            };
            timeManualHour.addEventListener("input", () => {
                timeManualHour.value = timeManualHour.value.replace(/[^\d]/g, "");
                const raw = parseInt(timeManualHour.value, 10);
                if (Number.isFinite(raw)) {
                    applyManualHour(raw);
                }
            });
            timeManualHour.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    commitManualHour();
                    timeManualHour.blur();
                }
            });
            timeManualHour.addEventListener("focus", () => {
                timeManualHour.select();
            });
            timeManualHour.addEventListener("blur", commitManualHour);
        }
        if (timeManualMinute) {
            const applyManualMinute = (raw) => {
                activeMinute = clamp(raw, 0, 59);
                if (timeMinuteWheel) scrollWheelTo(timeMinuteWheel, activeMinute);
                updateMeridiemButtons();
            };
            const commitManualMinute = () => {
                const raw = parseInt(timeManualMinute.value, 10);
                if (Number.isFinite(raw)) {
                    applyManualMinute(raw);
                }
                updateManualInputs(true);
            };
            timeManualMinute.addEventListener("input", () => {
                timeManualMinute.value = timeManualMinute.value.replace(/[^\d]/g, "");
                const raw = parseInt(timeManualMinute.value, 10);
                if (Number.isFinite(raw)) {
                    applyManualMinute(raw);
                }
            });
            timeManualMinute.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    commitManualMinute();
                    timeManualMinute.blur();
                }
            });
            timeManualMinute.addEventListener("focus", () => {
                timeManualMinute.select();
            });
            timeManualMinute.addEventListener("blur", commitManualMinute);
        }
        if (timeApply) {
            timeApply.addEventListener("click", () => {
                applyTimePicker();
                closeTimePicker();
            });
        }
        if (timeCancel) timeCancel.addEventListener("click", closeTimePicker);
        if (timeClose) timeClose.addEventListener("click", closeTimePicker);
        timeOverlay.addEventListener("click", (event) => {
            if (event.target === timeOverlay) closeTimePicker();
        });
    };

    const initTimeFields = (scope = document) => {
        scope.querySelectorAll("[data-time-field]").forEach((field) => {
            if (field.dataset.bound === "true") return;
            field.dataset.bound = "true";
            const button = field.querySelector("[data-time-display]");
            if (button) {
                button.addEventListener("click", () => openTimePicker(field));
            }
            refreshTimeField(field);
        });
    };

    const colorToRgba = (hex, alpha) => {
        if (!hex) return "";
        const clean = hex.replace("#", "").trim();
        const value = clean.length === 3
            ? clean.split("").map((c) => c + c).join("")
            : clean;
        if (value.length !== 6) return "";
        const r = parseInt(value.slice(0, 2), 16);
        const g = parseInt(value.slice(2, 4), 16);
        const b = parseInt(value.slice(4, 6), 16);
        if ([r, g, b].some((v) => Number.isNaN(v))) return "";
        const safeAlpha = Math.max(0, Math.min(1, alpha));
        return `rgba(${r}, ${g}, ${b}, ${safeAlpha})`;
    };

    const setClockMode = (value) => {
        clockMode = value === "12" ? "12" : "24";
        document.cookie = `${clockCookieKey}=${clockMode}; path=/; domain=.candor.you; max-age=31536000`;
        buildTimeWheels();
        updateManualInputs();
        refreshTimeFields();
    };

    const overlay = document.querySelector("[data-create-overlay]");
    const createForm = overlay ? overlay.querySelector("[data-create-form]") : null;
    const createKind = overlay ? overlay.querySelector("[data-create-kind]") : null;
    const createTitle = overlay ? overlay.querySelector("#create-title") : null;
    const createNote = overlay ? overlay.querySelector("#create-note") : null;
    const createTime = overlay ? overlay.querySelector("#create-time") : null;
    const createEnd = overlay ? overlay.querySelector("#create-end-time") : null;
    const createDuration = overlay ? overlay.querySelector("#create-duration") : null;
    const createShiftSelect = overlay ? overlay.querySelector("[data-create-shift]") : null;
    const createColor = overlay ? overlay.querySelector("#create-color") : null;
    const createAllDay = overlay ? overlay.querySelector("#create-all-day") : null;
    const createEventTime = overlay ? overlay.querySelectorAll("[data-event-time]") : [];
    const createDateLabel = overlay ? overlay.querySelector("[data-create-date]") : null;
    const createDateInput = overlay ? overlay.querySelector("[data-create-date-input]") : null;
    const createDateField = overlay ? overlay.querySelector("[data-create-date-field]") : null;
    const createDatePicker = overlay ? overlay.querySelector("[data-create-date-picker]") : null;
    const createMeta = overlay ? overlay.querySelector(".createMeta") : null;

    const editOverlay = document.querySelector("[data-edit-overlay]");
    const editTitle = editOverlay ? editOverlay.querySelector("[data-edit-title]") : null;
    const editMeta = editOverlay ? editOverlay.querySelector("[data-edit-meta]") : null;
    const editShiftRow = editOverlay ? editOverlay.querySelector("[data-edit-shift-row]") : null;
    const editShiftSelect = editOverlay ? editOverlay.querySelector("[data-edit-shift-select]") : null;
    const editStartInput = editOverlay ? editOverlay.querySelector("[data-edit-start]") : null;
    const editEndInput = editOverlay ? editOverlay.querySelector("[data-edit-end]") : null;
    const editStartField = editStartInput ? editStartInput.closest("[data-time-field]") : null;
    const editEndField = editEndInput ? editEndInput.closest("[data-time-field]") : null;
    const editDelta = editOverlay ? editOverlay.querySelector("[data-edit-delta]") : null;
    const editClose = editOverlay ? editOverlay.querySelector("[data-edit-close]") : null;
    const editStartNow = editOverlay ? editOverlay.querySelector("[data-edit-start-now]") : null;
    const editFinishNow = editOverlay ? editOverlay.querySelector("[data-edit-finish-now]") : null;
    const editActions = editOverlay ? editOverlay.querySelector("[data-edit-actions]") : null;
    const noteOverlay = document.querySelector("[data-note-overlay]");
    const noteTitleEl = noteOverlay ? noteOverlay.querySelector("[data-note-title]") : null;
    const noteBodyEl = noteOverlay ? noteOverlay.querySelector("[data-note-body]") : null;
    const noteClose = noteOverlay ? noteOverlay.querySelector("[data-note-close]") : null;
    let activeEditKind = "window";
    let activeEditWindow = null;
    let activeEditSleepKey = "";
    let activeEditShiftKey = "";
    let plannedTimes = { start: "", end: "" };
    let editSync = false;

    const calendarRoot = document.querySelector(".calendarShell");
    let calendarApi = null;

    if (calendarRoot) {
        const monthTitle = calendarRoot.querySelector("[data-month-title]");
        const monthGrid = calendarRoot.querySelector("[data-month-grid]");
        const dayTitle = calendarRoot.querySelector("[data-day-title]");
        const daySub = calendarRoot.querySelector("[data-day-sub]");
        const dayShort = calendarRoot.querySelector("[data-day-short]");
        const dayGrid = calendarRoot.querySelector("[data-day-grid]");
        const taskRail = calendarRoot.querySelector("[data-task-rail]");
        const noteRail = calendarRoot.querySelector("[data-note-rail]");
        const daySchedule = calendarRoot.querySelector("[data-day-schedule]");
        const dayAllDay = calendarRoot.querySelector("[data-day-all-day]");
        const dayAllDayList = calendarRoot.querySelector("[data-day-all-day-list]");
        const focusPace = calendarRoot.querySelector("[data-focus-pace]");
        const focusBalance = calendarRoot.querySelector("[data-focus-balance]");
        const focusMomentum = calendarRoot.querySelector("[data-focus-momentum]");
        const balanceBar = calendarRoot.querySelector(".balanceBar");
        const momentumDots = calendarRoot.querySelector(".momentumDots");
        const monthPopover = calendarRoot.querySelector("[data-month-popover]");
        const popoverTitle = calendarRoot.querySelector("[data-popover-title]");
        const popoverList = calendarRoot.querySelector("[data-popover-list]");
        const popoverClose = calendarRoot.querySelector("[data-popover-close]");
        let popoverDateKey = "";

        const now = new Date();
        const stateCal = {
            selected: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            viewYear: now.getFullYear(),
            viewMonth: now.getMonth(),
        };

        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const renderDayHeader = () => {
            if (!dayTitle || !daySub || !dayShort) return;
            const optsLong = { weekday: "long", month: "long", day: "numeric" };
            dayTitle.textContent = stateCal.selected.toLocaleDateString("en-US", optsLong);
            const week = getISOWeek(stateCal.selected);
            daySub.textContent = `Week ${week} - ${stateCal.selected.getFullYear()}`;
            dayShort.textContent = stateCal.selected.toLocaleDateString("en-US", { month: "short", day: "numeric" });
            if (daySchedule) {
                daySchedule.textContent = "";
                daySchedule.classList.add("is-empty");
            }
        };


        const formatHours = (value) => {
            if (!Number.isFinite(value)) return "0";
            const rounded = Math.round(value * 10) / 10;
            return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
        };

        const getSleepLogFor = (key) =>
            state.sleepLogs.find((log) => log.date === key);

        const getPlannedSleepMinutes = (date) => {
            const rule = pickSleepRule(date);
            if (rule && rule.start && rule.end) {
                const minutes = durationMinutes(rule.start, rule.end);
                if (minutes !== null) return minutes;
            }
            return recommendedSleepMinutes(ageYears);
        };

        const getTargetSleepMinutes = (date) => getPlannedSleepMinutes(date);

        const getDefaultShift = () => state.shifts.find((shift) => shift.isDefault) || null;

        const getShiftOverrideForDate = (date) => {
            if (!date) return null;
            const key = dateKey(date);
            const override = state.shiftOverrides[key];
            if (override === undefined) return null;
            if (override && typeof override === "object") {
                return {
                    shiftId: override.shiftId ?? null,
                    start: override.start || "",
                    end: override.end || "",
                };
            }
            if (override === null) {
                return { shiftId: null, start: "", end: "" };
            }
            return { shiftId: override, start: "", end: "" };
        };

        const getShiftForDate = (date) => {
            if (!date) return null;
            const override = getShiftOverrideForDate(date);
            if (override) {
                if (override.shiftId === null) return null;
                if (override.shiftId !== undefined && override.shiftId !== "") {
                    return state.shifts.find((shift) => String(shift.id) === String(override.shiftId)) || null;
                }
            }
            return getDefaultShift();
        };

        const getShiftWindowTimes = (date) => {
            const shift = getShiftForDate(date);
            if (!shift || !shift.start || !shift.end) return null;
            const override = getShiftOverrideForDate(date);
            const overrideStart = override && override.start ? override.start : "";
            const overrideEnd = override && override.end ? override.end : "";
            let startActual = overrideStart || shift.start;
            let endActual = overrideEnd || shift.end;
            if (!overrideStart && !overrideEnd) {
                startActual = addMinutesToTime(shift.start, -(shift.commuteBefore || 0));
                endActual = addMinutesToTime(shift.end, shift.commuteAfter || 0);
            }
            return { shift, start: startActual, end: endActual };
        };

        const isActiveSleep = (key) =>
            state.activeSession && state.activeSession.kind === "sleep" && state.activeSession.key === key;

        const isActiveWindow = (windowItem) =>
            state.activeSession && state.activeSession.kind === "window" && state.activeSession.id === windowItem.id;

        const isActiveShift = (windowItem) =>
            state.activeSession
            && state.activeSession.kind === "shift"
            && state.activeSession.key === (windowItem.date || "");

        const computeMomentum = () => {
            const hasSleep = state.rules.some((rule) => rule.kind === "sleep");
            if (!hasSleep || state.routineCount <= 0) return 0;
            const tasksByDate = state.tasks.reduce((acc, task) => {
                if (!task.date) return acc;
                if (!acc[task.date]) acc[task.date] = [];
                acc[task.date].push(task);
                return acc;
            }, {});
            let streak = 0;
            const cursor = new Date();
            cursor.setDate(cursor.getDate() - 1);
            while (true) {
                const key = dateKey(cursor);
                const dayTasks = tasksByDate[key] || [];
                if (dayTasks.length === 0) break;
                if (!dayTasks.every((task) => task.done)) break;
                streak += 1;
                cursor.setDate(cursor.getDate() - 1);
            }
            return streak;
        };

        const renderFocus = () => {
            const sleepMinutes = getTargetSleepMinutes(stateCal.selected);
            const baseSleep = sleepMinutes / 60;
            const remaining = Math.max(0, 24 - baseSleep);
            const focusHours = remaining / 2;
            const lifeHours = remaining - focusHours;
            if (focusBalance) {
                const longValue = focusBalance.querySelector(".valueLong");
                const shortValue = focusBalance.querySelector(".valueShort");
                const sleepLabel = formatHours(baseSleep);
                const focusLabel = formatHours(focusHours);
                const lifeLabel = formatHours(lifeHours);
                if (longValue) {
                    longValue.textContent = `${sleepLabel}h sleep / ${focusLabel}h focus / ${lifeLabel}h life`;
                }
                if (shortValue) {
                    shortValue.textContent = `${sleepLabel}h/${focusLabel}h/${lifeLabel}h`;
                }
            }
            if (balanceBar) {
                const sleepFr = Math.max(0.5, baseSleep);
                const focusFr = Math.max(0.5, focusHours);
                const lifeFr = Math.max(0.5, lifeHours);
                balanceBar.style.gridTemplateColumns = `${sleepFr}fr ${focusFr}fr ${lifeFr}fr`;
            }
            const momentumDays = computeMomentum();
            if (focusMomentum) {
                const longValue = focusMomentum.querySelector(".valueLong");
                const shortValue = focusMomentum.querySelector(".valueShort");
                if (longValue) longValue.textContent = `${momentumDays}-day momentum`;
                if (shortValue) shortValue.textContent = `${momentumDays}-day`;
            }
            if (momentumDots) {
                const dots = Array.from(momentumDots.querySelectorAll(".dot"));
                dots.forEach((dot, index) => {
                    dot.classList.toggle("is-on", index < Math.min(momentumDays, dots.length));
                });
            }
        };

        const renderAllDay = (items) => {
            if (!dayAllDay || !dayAllDayList) return;
            dayAllDayList.innerHTML = "";
            if (!items || items.length === 0) {
                dayAllDay.classList.add("is-empty");
                return;
            }
            dayAllDay.classList.remove("is-empty");
            items.forEach((item) => {
                const chip = document.createElement("div");
                chip.className = "allDayChip";
                chip.dataset.windowId = item.id;

                const text = document.createElement("span");
                text.className = "chipText";
                text.textContent = item.text;
                chip.appendChild(text);

                if (!item.locked) {
                    const remove = document.createElement("button");
                    remove.type = "button";
                    remove.className = "chipRemove";
                    remove.dataset.removeId = item.id;
                    remove.dataset.removeType = "windows";
                    remove.textContent = "x";
                    chip.appendChild(remove);
                }

                dayAllDayList.appendChild(chip);
            });
        };

        const renderDayGrid = (autoScroll) => {
            if (!dayGrid) return;
            const dayStart = 0;
            const dayEnd = 24;
            dayGrid.innerHTML = "";
            const hourHeight = parseFloat(getComputedStyle(dayGrid).getPropertyValue("--hour-height")) || 42;
            const rows = [];
            for (let hour = dayStart; hour < dayEnd; hour += 1) {
                const row = document.createElement("div");
                row.className = "timeRow";
                row.dataset.hour = String(hour);

                const label = document.createElement("div");
                label.textContent = formatHour(hour);

                const slot = document.createElement("div");
                slot.className = "timeSlot";
                slot.dataset.hour = String(hour);

                row.appendChild(label);
                row.appendChild(slot);
                dayGrid.appendChild(row);
                rows.push({ hour, slot });
            }

            const selectedKey = dateKey(stateCal.selected);
            const windows = state.windows
                .filter((item) => item.date === selectedKey);
            const birthdayEvent = birthdayEventFor(stateCal.selected);
            if (birthdayEvent) {
                windows.push(birthdayEvent);
            }
            const shiftWindow = getShiftWindowTimes(stateCal.selected);
            if (shiftWindow) {
                const { shift, start: startActual, end: endActual } = shiftWindow;
                windows.push({
                    id: `shift-${selectedKey}`,
                    text: shift.name || "Work",
                    date: selectedKey,
                    start: startActual,
                    end: endActual,
                    kind: "window",
                    color: "#b9dbf2",
                    locked: true,
                    source: "shift",
                    shiftId: shift.id,
                    baseStart: shift.start,
                    baseEnd: shift.end,
                });
            }
            windows.sort((a, b) => (parseMinutes(a.start) ?? 0) - (parseMinutes(b.start) ?? 0));

            const windowsByHour = {};
            const blockWindows = [];
            const allDayEvents = [];

            windows.forEach((window) => {
                const minutes = parseMinutes(window.start);
                if (minutes === null) return;
                const endMinutes = parseMinutes(window.end);
                const isAllDay = window.kind === "event" && window.start === "00:00" && window.end === "23:59";
                if (isAllDay) {
                    allDayEvents.push(window);
                    return;
                }
                if (endMinutes !== null) {
                    blockWindows.push({
                        ...window,
                        startMinutes: minutes,
                        endMinutes,
                        isAllDay,
                    });
                    return;
                }
                const hour = Math.floor(minutes / 60);
                if (!windowsByHour[hour]) windowsByHour[hour] = [];
                windowsByHour[hour].push(window);
            });

            rows.forEach(({ hour, slot }) => {
                const list = windowsByHour[hour] || [];
                if (list.length > 1) {
                    slot.classList.add("is-multi");
                }
                list.forEach((window) => {
                    const chip = document.createElement("div");
                    chip.className = "slotChip";
                    chip.dataset.windowId = window.id;
                    if (isActiveWindow(window) || (window.source === "shift" && isActiveShift(window))) {
                        chip.classList.add("is-active");
                    }
                    if (window.color) {
                        const tint = colorToRgba(window.color, 0.2);
                        if (tint) {
                            chip.style.background = tint;
                            chip.style.borderColor = window.color;
                        }
                    }

                    const time = document.createElement("span");
                    time.className = "chipTime";
                    const startText = formatTime(window.start);
                    const endText = window.end ? formatTime(window.end) : "";
                    time.textContent = endText ? `${startText}-${endText}` : startText;

                    const title = document.createElement("span");
                    title.className = "chipText";
                    title.textContent = window.text;

                    const remove = document.createElement("button");
                    remove.type = "button";
                    remove.className = "chipRemove";
                    remove.dataset.removeId = window.id;
                    remove.dataset.removeType = "windows";
                    remove.textContent = "x";

                    chip.appendChild(time);
                    chip.appendChild(title);
                    chip.appendChild(remove);
                    slot.appendChild(chip);
                });
            });

            renderAllDay(allDayEvents);

            const blockSegments = [];
            blockWindows.forEach((window) => {
                const segments = [];
                if (window.endMinutes <= window.startMinutes) {
                    segments.push({ start: window.startMinutes, end: dayEnd * 60 });
                    if (window.endMinutes > dayStart * 60) {
                        segments.push({ start: dayStart * 60, end: window.endMinutes });
                    }
                } else {
                    segments.push({ start: window.startMinutes, end: window.endMinutes });
                }
                segments.forEach((segment) => {
                    blockSegments.push({
                        window,
                        start: segment.start,
                        end: segment.end,
                        allDay: false,
                    });
                });
            });

            const layoutSegments = (segments) => {
                const sorted = segments.slice().sort((a, b) => {
                    if (a.start !== b.start) return a.start - b.start;
                    return a.end - b.end;
                });
                const groups = [];
                let current = null;
                sorted.forEach((segment) => {
                    if (!current || segment.start >= current.end) {
                        current = { items: [], end: segment.end };
                        groups.push(current);
                    } else if (segment.end > current.end) {
                        current.end = segment.end;
                    }
                    current.items.push(segment);
                });
                groups.forEach((group) => {
                    const active = [];
                    group.maxCols = 0;
                    group.items.forEach((segment) => {
                        for (let i = active.length - 1; i >= 0; i -= 1) {
                            if (active[i].end <= segment.start) {
                                active.splice(i, 1);
                            }
                        }
                        const used = new Set(active.map((item) => item.col));
                        let col = 0;
                        while (used.has(col)) col += 1;
                        segment.col = col;
                        active.push(segment);
                        group.maxCols = Math.max(group.maxCols, active.length);
                    });
                    group.items.forEach((segment) => {
                        segment.maxCols = group.maxCols;
                    });
                });
                return sorted;
            };

            const labelWidth = parseFloat(getComputedStyle(dayGrid).getPropertyValue("--timeline-label-width")) || 72;
            const slotLeftVar = parseFloat(getComputedStyle(dayGrid).getPropertyValue("--timeline-slot-left"));
            const slotRightVar = parseFloat(getComputedStyle(dayGrid).getPropertyValue("--timeline-slot-right"));
            const blockGap = parseFloat(getComputedStyle(dayGrid).getPropertyValue("--timeline-block-gap"));
            const blockInset = parseFloat(getComputedStyle(dayGrid).getPropertyValue("--timeline-block-inset"));
            let slotLeft = null;
            let slotRight = null;
            const sampleSlot = dayGrid.querySelector(".timeSlot");
            if (sampleSlot) {
                const gridRect = dayGrid.getBoundingClientRect();
                const slotRect = sampleSlot.getBoundingClientRect();
                slotLeft = slotRect.left - gridRect.left;
                slotRight = gridRect.right - slotRect.right;
            }
            const safeInset = Number.isFinite(blockInset) ? blockInset : 0;
            const leftBase = (Number.isFinite(slotLeft)
                ? slotLeft
                : (Number.isFinite(slotLeftVar) ? slotLeftVar : (labelWidth + 12))) + safeInset;
            const rightBase = (Number.isFinite(slotRight)
                ? slotRight
                : (Number.isFinite(slotRightVar) ? slotRightVar : 16)) + safeInset;
            const columnGap = Number.isFinite(blockGap) ? blockGap : 0;
            const usableWidth = Math.max(0, dayGrid.clientWidth - leftBase - rightBase);

            layoutSegments(blockSegments).forEach((segment) => {
                const { window } = segment;
                const block = document.createElement("div");
                block.className = `slotBlock${window.kind === "event" ? " is-event" : ""}`;
                block.dataset.windowId = window.id;
                if (isActiveWindow(window) || (window.source === "shift" && isActiveShift(window))) {
                    block.classList.add("is-active");
                }

                const tint = colorToRgba(window.color || "#f3c873", window.kind === "event" ? 0.2 : 0.25);
                block.style.borderColor = window.color || "#f3c873";
                if (tint) block.style.background = tint;

                const top = ((segment.start - dayStart * 60) / 60) * hourHeight;
                const height = ((segment.end - segment.start) / 60) * hourHeight;
                block.style.top = `${top}px`;
                block.style.height = `${height}px`;

                const columns = Math.max(1, segment.maxCols || 1);
                const totalGap = columnGap * (columns - 1);
                const columnWidth = columns > 0 ? Math.max(0, (usableWidth - totalGap) / columns) : usableWidth;
                const left = leftBase + segment.col * (columnWidth + columnGap);
                block.style.left = `${left}px`;
                block.style.width = `${columnWidth}px`;

                const time = document.createElement("span");
                time.className = "blockTime";
                const startText = formatTime(window.start);
                const endText = window.end ? formatTime(window.end) : "";
                time.textContent = endText ? `${startText}-${endText}` : startText;

                const title = document.createElement("span");
                title.className = "blockText";
                title.textContent = window.text;

                block.appendChild(time);
                block.appendChild(title);
                if (!window.locked) {
                    const remove = document.createElement("button");
                    remove.type = "button";
                    remove.className = "blockRemove";
                    remove.dataset.removeId = window.id;
                    remove.dataset.removeType = "windows";
                    remove.textContent = "x";
                    block.appendChild(remove);
                }
                dayGrid.appendChild(block);
            });

            const sleepRule = pickSleepRule(stateCal.selected);
            const sleepKey = dateKey(stateCal.selected);
            const sleepLog = getSleepLogFor(sleepKey);
            const baseStart = sleepLog && sleepLog.start ? sleepLog.start : (sleepRule ? sleepRule.start : "");
            const baseEnd = sleepLog && sleepLog.end ? sleepLog.end : (sleepRule ? sleepRule.end : "");
            if (baseStart && baseEnd) {
                const endValue = baseEnd;
                const startMinutes = parseMinutes(baseStart);
                const endMinutes = parseMinutes(endValue);
                if (startMinutes !== null && endMinutes !== null) {
                    const windows = [];
                    if (endMinutes <= startMinutes) {
                        windows.push({ start: startMinutes, end: dayEnd * 60 });
                        if (endMinutes > dayStart * 60) {
                            windows.push({ start: dayStart * 60, end: endMinutes });
                        }
                    } else {
                        windows.push({ start: startMinutes, end: endMinutes });
                    }
                    windows.forEach((window) => {
                        const block = document.createElement("div");
                        block.className = "sleepBlock";
                        block.dataset.sleepDate = sleepKey;
                        if (isActiveSleep(sleepKey)) {
                            block.classList.add("is-active");
                        }
                        const top = ((window.start - dayStart * 60) / 60) * hourHeight;
                        const height = ((window.end - window.start) / 60) * hourHeight;
                        block.style.top = `${top}px`;
                        block.style.height = `${height}px`;

                        const label = document.createElement("span");
                        label.className = "sleepLabel";
                        label.textContent = "Sleep";
                        block.appendChild(label);

                        dayGrid.appendChild(block);
                    });
                }
            }

            if (isSameDay(stateCal.selected, new Date())) {
                const marker = document.createElement("div");
                marker.className = "timeMarker";
                const liveNow = new Date();
                const minutes = liveNow.getHours() * 60 + liveNow.getMinutes();
                const startMinutes = dayStart * 60;
                const endMinutes = dayEnd * 60;
                if (minutes >= startMinutes && minutes <= endMinutes) {
                    const top = ((minutes - startMinutes) / 60) * hourHeight;
                    marker.style.top = `${top}px`;
                    dayGrid.appendChild(marker);
                    if (autoScroll) {
                        dayGrid.scrollTop = Math.max(0, top - dayGrid.clientHeight * 0.4);
                    }
                }
            }
        };

        const renderTaskRail = () => {
            if (!taskRail) return;
            taskRail.innerHTML = "";
            const selectedKey = dateKey(stateCal.selected);
            const tasks = state.tasks
                .filter((task) => task.date === selectedKey)
                .sort((a, b) => (parseMinutes(a.time) ?? 0) - (parseMinutes(b.time) ?? 0));
            const needsBase = state.rules.length === 0;
            if (needsBase) {
                const core = document.createElement("a");
                core.className = "chip coreChip";
                core.href = "https://create.candor.you/";
                core.textContent = "Create core schedule";
                taskRail.appendChild(core);
            }
            if (tasks.length === 0) {
                if (!needsBase) {
                    const empty = document.createElement("span");
                    empty.className = "railEmpty";
                    empty.textContent = "No priority tasks yet.";
                    taskRail.appendChild(empty);
                }
                return;
            }

            tasks.forEach((task) => {
                const chip = document.createElement("div");
                chip.className = `chip taskChip${task.done ? " is-done" : ""}`;
                chip.dataset.taskId = task.id;

                const text = document.createElement("span");
                text.className = "chipText";
                text.textContent = task.text;

                if (task.time || task.duration) {
                    const time = document.createElement("span");
                    time.className = "chipTime";
                    const timeText = task.time ? formatTime(task.time) : "";
                    const durText = task.duration ? `${task.duration}m` : "";
                    time.textContent = timeText && durText ? `${timeText} - ${durText}` : (timeText || durText);
                    chip.appendChild(time);
                }

                const remove = document.createElement("button");
                remove.type = "button";
                remove.className = "chipRemove";
                remove.dataset.removeId = task.id;
                remove.dataset.removeType = "tasks";
                remove.textContent = "x";

                chip.appendChild(text);
                chip.appendChild(remove);
                taskRail.appendChild(chip);
            });
        };

        const renderNoteRail = () => {
            if (!noteRail) return;
            noteRail.innerHTML = "";
            const notes = state.notes.slice(-6).reverse();
            if (notes.length === 0) {
                const empty = document.createElement("span");
                empty.className = "railEmpty";
                empty.textContent = "Capture a note to keep context.";
                noteRail.appendChild(empty);
                return;
            }

            notes.forEach((note) => {
                const chip = document.createElement("div");
                chip.className = "chip noteChip";
                chip.dataset.noteId = note.id;

                const text = document.createElement("span");
                text.className = "chipText";
                const title = note.title || note.body || "Note";
                text.textContent = title.length > 48 ? `${title.slice(0, 48)}…` : title;

                const remove = document.createElement("button");
                remove.type = "button";
                remove.className = "chipRemove";
                remove.dataset.removeId = note.id;
                remove.dataset.removeType = "notes";
                remove.textContent = "x";

                chip.appendChild(text);
                chip.appendChild(remove);
                noteRail.appendChild(chip);
            });
        };

        const renderMonth = () => {
            if (!monthTitle || !monthGrid) return;
            monthTitle.textContent = `${monthNames[stateCal.viewMonth]} ${stateCal.viewYear}`;
            monthGrid.innerHTML = "";

            const firstOfMonth = new Date(stateCal.viewYear, stateCal.viewMonth, 1);
            const startWeekday = firstOfMonth.getDay();
            const daysInMonth = new Date(stateCal.viewYear, stateCal.viewMonth + 1, 0).getDate();
            const prevMonthDays = new Date(stateCal.viewYear, stateCal.viewMonth, 0).getDate();
            const totalCells = Math.ceil((startWeekday + daysInMonth) / 7) * 7;

            const tasksByDate = state.tasks.reduce((acc, task) => {
                if (task.date) {
                    if (!acc[task.date]) acc[task.date] = [];
                    acc[task.date].push(task);
                }
                return acc;
            }, {});

            Object.values(tasksByDate).forEach((list) => {
                list.sort((a, b) => (parseMinutes(a.time) ?? 0) - (parseMinutes(b.time) ?? 0));
            });

            const eventsByDate = state.windows.reduce((acc, item) => {
                if (item.kind === "event" && item.date) {
                    if (!acc[item.date]) acc[item.date] = [];
                    acc[item.date].push({ ...item, isEvent: true });
                }
                return acc;
            }, {});

            if (birthdayInfo) {
                const birthDate = new Date(stateCal.viewYear, birthdayInfo.month - 1, birthdayInfo.day);
                if (!Number.isNaN(birthDate.getTime())) {
                    const key = dateKey(birthDate);
                    if (!eventsByDate[key]) eventsByDate[key] = [];
                    eventsByDate[key].push({
                        id: `birthday-${stateCal.viewYear}`,
                        text: birthdayTitle(),
                        isEvent: true,
                    });
                }
            }

            for (let i = 0; i < totalCells; i += 1) {
                let cellYear = stateCal.viewYear;
                let cellMonth = stateCal.viewMonth;
                let dayNum = i - startWeekday + 1;

                if (dayNum <= 0) {
                    cellMonth -= 1;
                    if (cellMonth < 0) {
                        cellMonth = 11;
                        cellYear -= 1;
                    }
                    dayNum = prevMonthDays + dayNum;
                } else if (dayNum > daysInMonth) {
                    dayNum -= daysInMonth;
                    cellMonth += 1;
                    if (cellMonth > 11) {
                        cellMonth = 0;
                        cellYear += 1;
                    }
                }

                const cellDate = new Date(cellYear, cellMonth, dayNum);
                const key = dateKey(cellDate);
                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = "monthCell";
                btn.dataset.date = key;

                const number = document.createElement("span");
                number.className = "monthNumber";
                number.textContent = String(dayNum);

                const dots = document.createElement("div");
                dots.className = "monthDots";
                const dayItems = [...(tasksByDate[key] || []), ...(eventsByDate[key] || [])];
                if (dayItems.length > 0) {
                    btn.classList.add("has-items");
                }
                const dotCount = Math.min(3, dayItems.length);
                dayItems.slice(0, dotCount).forEach((item) => {
                    const dot = document.createElement("span");
                    const eventClass = item.isEvent ? " is-event" : "";
                    dot.className = `monthDot${item.done ? " is-done" : ""}${eventClass}`;
                    dots.appendChild(dot);
                });
                if (dayItems.length > dotCount) {
                    const more = document.createElement("span");
                    more.className = "monthDot is-more";
                    more.textContent = "+";
                    dots.appendChild(more);
                }

                btn.appendChild(number);
                btn.appendChild(dots);

                if (cellMonth !== stateCal.viewMonth) {
                    btn.classList.add("is-muted");
                }
                if (isSameDay(cellDate, new Date())) {
                    btn.classList.add("is-today");
                }
                if (isSameDay(cellDate, stateCal.selected)) {
                    btn.classList.add("is-selected");
                }

                monthGrid.appendChild(btn);
            }
        };

        const closePopover = () => {
            if (!monthPopover) return;
            monthPopover.classList.remove("is-open");
            popoverDateKey = "";
        };

        const renderPopover = (key) => {
            if (!monthPopover || !popoverTitle || !popoverList) return;
            const date = parseKey(key);
            popoverTitle.textContent = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
            popoverList.innerHTML = "";

            const items = [];
            const tasks = state.tasks.filter((task) => task.date === key);
            tasks.forEach((task) => {
                items.push({
                    type: "Task",
                    text: task.text,
                    time: task.time,
                    duration: task.duration,
                });
            });

            const windows = state.windows.filter((item) => item.date === key);
            windows.forEach((item) => {
                items.push({
                    type: item.kind === "event" ? "Event" : "Window",
                    text: item.text,
                    time: item.start,
                    duration: null,
                });
            });

            const birthdayEvent = birthdayEventFor(date);
            if (birthdayEvent) {
                items.push({
                    type: "Event",
                    text: birthdayEvent.text,
                    time: "00:00",
                    duration: null,
                });
            }

            items.sort((a, b) => {
                const aTime = parseMinutes(a.time) ?? 9999;
                const bTime = parseMinutes(b.time) ?? 9999;
                if (aTime !== bTime) return aTime - bTime;
                return a.text.localeCompare(b.text);
            });

            if (items.length === 0) {
                const empty = document.createElement("div");
                empty.className = "railEmpty";
                empty.textContent = "No extra items yet.";
                popoverList.appendChild(empty);
            } else {
                items.forEach((item) => {
                    const row = document.createElement("div");
                    row.className = "monthPopoverItem";

                    const type = document.createElement("div");
                    type.className = "itemType";
                    type.textContent = item.type;

                    const text = document.createElement("div");
                    text.className = "itemText";
                    const meta = [];
                    if (item.time) meta.push(formatTime(item.time));
                    if (item.duration) meta.push(`${item.duration}m`);
                    const metaText = meta.length ? ` (${meta.join(" ")})` : "";
                    text.textContent = `${item.text}${metaText}`;

                    row.appendChild(type);
                    row.appendChild(text);
                    popoverList.appendChild(row);
                });
            }

            monthPopover.classList.add("is-open");
            popoverDateKey = key;
        };

        const renderAll = (autoScroll) => {
            renderDayHeader();
            renderDayGrid(autoScroll);
            renderFocus();
            renderTaskRail();
            renderNoteRail();
            renderMonth();
        };

        if (editShiftSelect) {
            editShiftSelect.addEventListener("change", () => {
                if (!activeEditShiftKey) return;
                const value = editShiftSelect.value;
                const shiftId = value ? parseInt(value, 10) : null;
                updateShiftOverride(activeEditShiftKey, { shiftId: Number.isFinite(shiftId) ? shiftId : null, start: "", end: "" });
                const shiftWindow = getShiftWindowTimes(parseKey(activeEditShiftKey));
                if (shiftWindow) {
                    editSync = true;
                    if (editStartField) setFieldValue(editStartField, shiftWindow.start || "", { emit: false });
                    if (editEndField) setFieldValue(editEndField, shiftWindow.end || "", { emit: false });
                    editSync = false;
                    plannedTimes = { start: shiftWindow.start || "", end: shiftWindow.end || "" };
                    updateEditDelta();
                }
            });
        }

        calendarRoot.addEventListener("click", (event) => {
            const nav = event.target.closest("[data-month-nav]");
            if (nav) {
                const dir = nav.getAttribute("data-month-nav");
                if (dir === "today") {
                    const fresh = new Date();
                    stateCal.viewYear = fresh.getFullYear();
                    stateCal.viewMonth = fresh.getMonth();
                    stateCal.selected = new Date(fresh.getFullYear(), fresh.getMonth(), fresh.getDate());
                    renderAll(true);
                    closePopover();
                    return;
                }
                stateCal.viewMonth += dir === "next" ? 1 : -1;
                if (stateCal.viewMonth < 0) {
                    stateCal.viewMonth = 11;
                    stateCal.viewYear -= 1;
                }
                if (stateCal.viewMonth > 11) {
                    stateCal.viewMonth = 0;
                    stateCal.viewYear += 1;
                }
                const daysInView = new Date(stateCal.viewYear, stateCal.viewMonth + 1, 0).getDate();
                const safeDay = Math.min(stateCal.selected.getDate(), daysInView);
                stateCal.selected = new Date(stateCal.viewYear, stateCal.viewMonth, safeDay);
                renderAll(true);
                closePopover();
                return;
            }

            const cell = event.target.closest(".monthCell");
            if (!cell || !cell.dataset.date) return;
            const nextDate = parseKey(cell.dataset.date);
            const key = cell.dataset.date;
            if (isSameDay(nextDate, stateCal.selected)) {
                if (popoverDateKey === key) {
                    closePopover();
                } else {
                    renderPopover(key);
                }
                return;
            }
            stateCal.selected = nextDate;
            stateCal.viewYear = nextDate.getFullYear();
            stateCal.viewMonth = nextDate.getMonth();
            renderAll(true);
            closePopover();
        });

        if (popoverClose) {
            popoverClose.addEventListener("click", closePopover);
        }

        document.addEventListener("click", (event) => {
            if (!monthPopover || !monthPopover.classList.contains("is-open")) return;
            if (event.target.closest(".monthPopover")) return;
            if (event.target.closest(".monthCell")) return;
            if (event.target.closest("[data-month-nav]")) return;
            if (event.target.closest("[data-month-add]")) return;
            closePopover();
        });

        calendarApi = {
            renderAll,
            getSelectedKey: () => dateKey(stateCal.selected),
        };

        renderAll(true);
        setInterval(() => {
            if (isSameDay(stateCal.selected, new Date())) {
                renderDayGrid(false);
            }
        }, 60000);
    }

    const refreshUI = (autoScroll) => {
        if (calendarApi) {
            calendarApi.renderAll(autoScroll);
        }
    };

    const nowTime = () => {
        const now = new Date();
        return `${pad2(now.getHours())}:${pad2(now.getMinutes())}`;
    };

    const updateEditDelta = () => {
        if (!editDelta) return;
        const start = editStartInput ? editStartInput.value : "";
        const end = editEndInput ? editEndInput.value : "";
        const plannedDuration = durationMinutes(plannedTimes.start, plannedTimes.end);
        const actualDuration = durationMinutes(start, end);
        if (plannedDuration === null || actualDuration === null) {
            editDelta.textContent = "Adjust start/end or tap Start/Finish.";
            return;
        }
        const diff = actualDuration - plannedDuration;
        if (diff === 0) {
            editDelta.textContent = "On target.";
            return;
        }
        const label = diff > 0 ? `Lost ${diff}m` : `Gained ${Math.abs(diff)}m`;
        editDelta.textContent = label;
    };

    const updateWindowTimes = async (windowId, start, end) => {
        if (!windowId) return;
        if (start === undefined && end === undefined) return;
        const target = state.windows.find((item) => item.id === windowId);
        if (!target) return;
        if (start !== undefined) {
            target.start = start;
            target.time = start;
        }
        if (end !== undefined) {
            target.end = end;
        }
        if (storageMode === "remote") {
            try {
                await apiFetch({ action: "update_window", id: windowId, start, end }, "POST");
            } catch {
                switchToLocal();
            }
        }
        if (storageMode === "local") {
            persistLocal();
        }
        refreshUI(false);
    };

    const updateSleepLog = async (key, start, end) => {
        if (!key) return;
        const existing = state.sleepLogs.find((log) => log.date === key);
        const nextStart = start !== undefined ? start : (existing ? existing.start : "");
        const nextEnd = end !== undefined ? end : (existing ? existing.end : "");
        if (!nextStart && !nextEnd) {
            state.sleepLogs = state.sleepLogs.filter((log) => log.date !== key);
        } else if (existing) {
            existing.start = nextStart;
            existing.end = nextEnd;
        } else {
            state.sleepLogs.push({ date: key, start: nextStart, end: nextEnd });
        }
        if (storageMode === "remote") {
            try {
                await apiFetch({ action: "update_sleep", date: key, start: nextStart, end: nextEnd }, "POST");
            } catch {
                switchToLocal();
            }
        }
        if (storageMode === "local") {
            persistLocal();
        }
        refreshUI(false);
    };

    const updateShiftOverride = async (key, next) => {
        if (!key) return;
        const defaultShift = getDefaultShift();
        const currentRaw = state.shiftOverrides[key];
        const current = currentRaw && typeof currentRaw === "object"
            ? currentRaw
            : { shiftId: currentRaw ?? null, start: "", end: "" };
        const nextObj = next && typeof next === "object" ? next : { shiftId: next };
        const shiftId = nextObj.shiftId !== undefined ? nextObj.shiftId : current.shiftId;
        const start = nextObj.start !== undefined ? nextObj.start : (current.start || "");
        const end = nextObj.end !== undefined ? nextObj.end : (current.end || "");
        const shouldClear = shiftId === null || shiftId === undefined || shiftId === "";
        const isDefaultShift = defaultShift && shiftId !== null && String(shiftId) === String(defaultShift.id);
        const shouldClearRemote = shouldClear || (isDefaultShift && !start && !end);

        if (shouldClearRemote) {
            delete state.shiftOverrides[key];
        } else {
            state.shiftOverrides[key] = { shiftId, start, end };
        }

        if (storageMode === "remote") {
            try {
                await apiFetch({
                    action: "update_shift_override",
                    date: key,
                    shift_id: shouldClearRemote ? null : shiftId,
                    start,
                    end,
                }, "POST");
            } catch {
                switchToLocal();
            }
        }
        if (storageMode === "local") {
            saveJson("shift_overrides", state.shiftOverrides);
        }
        refreshUI(false);
    };

    const renderCreateShiftSelect = (selectedId = "") => {
        if (!createShiftSelect) return;
        createShiftSelect.innerHTML = "";
        const noneOption = document.createElement("option");
        noneOption.value = "";
        noneOption.textContent = "No work";
        createShiftSelect.appendChild(noneOption);
        state.shifts.forEach((shift) => {
            const option = document.createElement("option");
            const label = shift.name || "Work";
            option.value = shift.id;
            option.textContent = shift.isDefault ? `${label} (default)` : label;
            createShiftSelect.appendChild(option);
        });
        if (selectedId) {
            createShiftSelect.value = String(selectedId);
        }
    };

    const renderEditShiftSelect = (key) => {
        if (!editShiftSelect || !editShiftRow) return;
        editShiftRow.classList.add("is-visible");
        editShiftSelect.innerHTML = "";
        const noneOption = document.createElement("option");
        noneOption.value = "";
        noneOption.textContent = "No work";
        editShiftSelect.appendChild(noneOption);
        state.shifts.forEach((shift) => {
            const option = document.createElement("option");
            const label = shift.name || "Work";
            option.value = shift.id;
            option.textContent = shift.isDefault ? `${label} (default)` : label;
            editShiftSelect.appendChild(option);
        });
        const override = state.shiftOverrides[key];
        const overrideId = override && typeof override === "object" ? override.shiftId : (override ?? undefined);
        const defaultShift = getDefaultShift();
        const selectedId = overrideId !== undefined
            ? (overrideId ?? "")
            : (defaultShift ? defaultShift.id : "");
        editShiftSelect.value = selectedId ? String(selectedId) : "";
    };

    const openWindowEdit = (windowItem) => {
        if (!editOverlay || !windowItem) return;
        const isShift = windowItem.source === "shift" || String(windowItem.id || "").startsWith("shift-");
        const isEvent = windowItem.kind === "event";
        activeEditKind = isShift ? "shift" : (isEvent ? "event" : "window");
        activeEditWindow = !isShift && !isEvent ? windowItem : null;
        activeEditSleepKey = "";
        activeEditShiftKey = isShift ? windowItem.date : "";
        plannedTimes = { start: windowItem.start || "", end: windowItem.end || "" };
        if (editTitle) editTitle.textContent = windowItem.text || "Window";
        if (editMeta) {
            editMeta.textContent = isShift ? "Work window" : (isEvent ? "Event" : "Window");
        }
        if (editShiftRow) {
            if (isShift && activeEditShiftKey) {
                renderEditShiftSelect(activeEditShiftKey);
            } else {
                editShiftRow.classList.remove("is-visible");
            }
        }
        if (editActions) {
            editActions.style.display = isEvent ? "none" : "flex";
        }
        editSync = true;
        if (editStartField) setFieldValue(editStartField, windowItem.start || "", { emit: false });
        if (editEndField) setFieldValue(editEndField, windowItem.end || "", { emit: false });
        editSync = false;
        updateEditDelta();
        editOverlay.classList.add("is-open");
    };

    const openSleepEdit = (sleepKey, plannedStart, plannedEnd) => {
        if (!editOverlay || !sleepKey) return;
        activeEditKind = "sleep";
        activeEditWindow = null;
        activeEditSleepKey = sleepKey;
        activeEditShiftKey = "";
        plannedTimes = { start: plannedStart || "", end: plannedEnd || "" };
        if (editTitle) editTitle.textContent = "Sleep";
        if (editMeta) editMeta.textContent = "Sleep log";
        if (editShiftRow) editShiftRow.classList.remove("is-visible");
        if (editActions) editActions.style.display = "flex";
        const log = getSleepLogFor(sleepKey);
        editSync = true;
        if (editStartField) setFieldValue(editStartField, log?.start || plannedStart || "", { emit: false });
        if (editEndField) setFieldValue(editEndField, log?.end || plannedEnd || "", { emit: false });
        editSync = false;
        updateEditDelta();
        editOverlay.classList.add("is-open");
    };

    const closeEdit = () => {
        if (!editOverlay) return;
        editOverlay.classList.remove("is-open");
        activeEditKind = "window";
        activeEditWindow = null;
        activeEditSleepKey = "";
        activeEditShiftKey = "";
        plannedTimes = { start: "", end: "" };
        if (editShiftRow) editShiftRow.classList.remove("is-visible");
    };

    const openNote = (note) => {
        if (!noteOverlay || !note) return;
        if (noteTitleEl) {
            noteTitleEl.textContent = note.title || "Note";
        }
        if (noteBodyEl) {
            noteBodyEl.textContent = note.body || note.title || "No details yet.";
        }
        noteOverlay.classList.add("is-open");
    };

    const closeNote = () => {
        if (!noteOverlay) return;
        noteOverlay.classList.remove("is-open");
    };

    const handleEditTimeChange = () => {
        if (editSync) return;
        const startValue = editStartInput ? editStartInput.value : "";
        const endValue = editEndInput ? editEndInput.value : "";
        const start = startValue ? startValue : undefined;
        const end = endValue ? endValue : undefined;
        if (activeEditKind === "sleep") {
            updateSleepLog(activeEditSleepKey, start, end);
            updateEditDelta();
            return;
        }
        if (activeEditKind === "shift" && activeEditShiftKey) {
            const override = state.shiftOverrides[activeEditShiftKey];
            const overrideId = override && typeof override === "object" ? override.shiftId : (override ?? undefined);
            const baseShift = getDefaultShift();
            const shiftId = overrideId !== undefined ? overrideId : (baseShift ? baseShift.id : null);
            if (shiftId === null) return;
            updateShiftOverride(activeEditShiftKey, {
                shiftId,
                start: startValue || "",
                end: endValue || "",
            });
            updateEditDelta();
            return;
        }
        if (activeEditKind === "event") {
            return;
        }
        if (!activeEditWindow) return;
        updateWindowTimes(activeEditWindow.id, start, end);
        updateEditDelta();
    };

    const updateEventTimeVisibility = () => {
        if (!createEventTime || createEventTime.length === 0) return;
        const isEvent = createKind && createKind.value === "event";
        const allDay = createAllDay && createAllDay.checked;
        if (!isEvent) return;
        createEventTime.forEach((field) => {
            field.style.display = allDay ? "none" : "grid";
        });
    };

    const setCreateKind = (kind) => {
        if (!createKind || !overlay) return;
        createKind.value = kind;
        overlay.querySelectorAll("[data-kind]").forEach((field) => {
            const raw = field.dataset.kind || "";
            const allowedKinds = raw.split(",").map((value) => value.trim()).filter(Boolean);
            const allowed = allowedKinds.includes(kind);
            field.style.display = allowed ? "grid" : "none";
        });
        if (createTime) {
            const isEvent = kind === "event";
            const allDay = createAllDay && createAllDay.checked;
            createTime.required = kind === "window" || (isEvent && !allDay);
        }
        if (kind === "shift") {
            renderCreateShiftSelect(createShiftSelect ? createShiftSelect.value : "");
        }
        updateEventTimeVisibility();
    };

    const setCreateDate = (key) => {
        if (!key) return;
        if (createDateInput) createDateInput.value = key;
        if (createDatePicker) createDatePicker.value = key;
        if (createDateLabel) {
            const date = parseKey(key);
            createDateLabel.textContent = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        }
    };

    const setCreateDateMode = (allowPick) => {
        if (createDateField) {
            createDateField.style.display = allowPick ? "grid" : "none";
        }
        if (createMeta) {
            createMeta.style.display = allowPick ? "none" : "flex";
        }
    };

    const openCreate = (kind, options = {}) => {
        if (!overlay) return;
        const selectedKey = options.dateKey || (calendarApi ? calendarApi.getSelectedKey() : dateKey(new Date()));
        setCreateDate(selectedKey);
        setCreateDateMode(Boolean(options.allowDatePick));
        if (createTitle) createTitle.value = "";
        if (createNote) createNote.value = "";
        clearTimeField(createTime);
        clearTimeField(createEnd);
        if (createDuration) createDuration.value = "";
        if (createShiftSelect) {
            const defaultShift = getDefaultShift();
            renderCreateShiftSelect(defaultShift ? defaultShift.id : "");
        }
        if (createColor && createColor.dataset && createColor.dataset.default) {
            createColor.value = createColor.dataset.default;
        }
        if (createAllDay) createAllDay.checked = false;
        const safeKind = ["task", "note", "window", "event", "shift"].includes(kind) ? kind : "task";
        setCreateKind(safeKind);
        overlay.classList.add("is-open");
        if (createTitle) createTitle.focus();
    };

    const closeCreate = () => {
        if (!overlay) return;
        overlay.classList.remove("is-open");
    };

    document.addEventListener("click", (event) => {
        const addBtn = event.target.closest("[data-add-kind]");
        if (addBtn) {
            const kind = addBtn.getAttribute("data-add-kind") || "task";
            openCreate(kind);
            return;
        }

        const monthAdd = event.target.closest("[data-month-add]");
        if (monthAdd) {
            openCreate("task", { allowDatePick: true });
            return;
        }

        const closeBtn = event.target.closest("[data-create-close]");
        if (closeBtn) {
            closeCreate();
            return;
        }

        if (overlay && event.target === overlay) {
            closeCreate();
        }
    });

    document.addEventListener("click", (event) => {
        const closeBtn = event.target.closest("[data-edit-close]");
        if (closeBtn) {
            closeEdit();
            return;
        }
        if (editOverlay && event.target === editOverlay) {
            closeEdit();
            return;
        }
        if (event.target.closest(".chipRemove, .blockRemove")) return;
        const sleepTarget = event.target.closest(".sleepBlock");
        if (sleepTarget && sleepTarget.dataset.sleepDate) {
            const key = sleepTarget.dataset.sleepDate;
            const selectedDate = calendarApi ? parseKey(calendarApi.getSelectedKey()) : new Date();
            const rule = pickSleepRule(selectedDate);
            const start = rule ? rule.start : "";
            const end = rule ? rule.end : "";
            openSleepEdit(key, start, end);
            return;
        }
        const windowTarget = event.target.closest(".slotBlock, .slotChip, .allDayChip");
        if (!windowTarget || !windowTarget.dataset.windowId) return;
        const id = windowTarget.dataset.windowId;
        const birthday = birthdayEventFor(calendarApi ? parseKey(calendarApi.getSelectedKey()) : new Date());
        const windowItem = state.windows.find((item) => item.id === id) || (birthday && birthday.id === id ? birthday : null);
        if (windowItem) {
            openWindowEdit(windowItem);
        }
    });


    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeCreate();
            closeEdit();
            closeNote();
        }
    });

    if (editStartField) {
        editStartField.addEventListener("timechange", handleEditTimeChange);
    }
    if (editEndField) {
        editEndField.addEventListener("timechange", handleEditTimeChange);
    }
    if (editStartNow) {
        editStartNow.addEventListener("click", () => {
            const value = nowTime();
            editSync = true;
            if (editStartField) setFieldValue(editStartField, value, { emit: false });
            editSync = false;
            const endValue = editEndInput ? editEndInput.value : "";
            if (activeEditKind === "sleep") {
                updateSleepLog(activeEditSleepKey, value, endValue ? endValue : undefined);
                if (activeEditSleepKey) {
                    setActiveSession({ kind: "sleep", key: activeEditSleepKey, start: value });
                }
            } else if (activeEditWindow) {
                updateWindowTimes(activeEditWindow.id, value, endValue ? endValue : undefined);
                setActiveSession({ kind: "window", id: activeEditWindow.id, start: value });
            } else if (activeEditKind === "shift" && activeEditShiftKey) {
                const override = state.shiftOverrides[activeEditShiftKey];
                const overrideId = override && typeof override === "object" ? override.shiftId : (override ?? undefined);
                const baseShift = getDefaultShift();
                const shiftId = overrideId !== undefined ? overrideId : (baseShift ? baseShift.id : null);
                if (shiftId !== null) {
                    updateShiftOverride(activeEditShiftKey, {
                        shiftId,
                        start: value,
                        end: endValue ? endValue : "",
                    });
                    setActiveSession({ kind: "shift", key: activeEditShiftKey, start: value });
                }
            }
            updateEditDelta();
        });
    }
    if (editFinishNow) {
        editFinishNow.addEventListener("click", () => {
            const value = nowTime();
            editSync = true;
            if (editEndField) setFieldValue(editEndField, value, { emit: false });
            editSync = false;
            const startValue = editStartInput ? editStartInput.value : "";
            if (activeEditKind === "sleep") {
                updateSleepLog(activeEditSleepKey, startValue ? startValue : undefined, value);
                if (state.activeSession && state.activeSession.kind === "sleep" && state.activeSession.key === activeEditSleepKey) {
                    clearActiveSession();
                }
            } else if (activeEditWindow) {
                updateWindowTimes(activeEditWindow.id, startValue ? startValue : undefined, value);
                if (state.activeSession && state.activeSession.kind === "window" && state.activeSession.id === activeEditWindow.id) {
                    clearActiveSession();
                }
            } else if (activeEditKind === "shift" && activeEditShiftKey) {
                const override = state.shiftOverrides[activeEditShiftKey];
                const overrideId = override && typeof override === "object" ? override.shiftId : (override ?? undefined);
                const baseShift = getDefaultShift();
                const shiftId = overrideId !== undefined ? overrideId : (baseShift ? baseShift.id : null);
                if (shiftId !== null) {
                    updateShiftOverride(activeEditShiftKey, {
                        shiftId,
                        start: startValue ? startValue : "",
                        end: value,
                    });
                    if (state.activeSession && state.activeSession.kind === "shift" && state.activeSession.key === activeEditShiftKey) {
                        clearActiveSession();
                    }
                }
            }
            updateEditDelta();
        });
    }

    if (noteClose) {
        noteClose.addEventListener("click", closeNote);
    }
    if (noteOverlay) {
        noteOverlay.addEventListener("click", (event) => {
            if (event.target === noteOverlay) closeNote();
        });
    }

    if (createKind) {
        createKind.addEventListener("change", () => setCreateKind(createKind.value));
    }

    if (createAllDay) {
        createAllDay.addEventListener("change", () => {
            updateEventTimeVisibility();
            if (createTime) {
                const kind = createKind ? createKind.value : "";
                const isEvent = kind === "event";
                createTime.required = kind === "window" || (isEvent && !createAllDay.checked);
            }
        });
    }

    if (createDatePicker) {
        createDatePicker.addEventListener("change", () => {
            if (createDatePicker.value) {
                setCreateDate(createDatePicker.value);
            }
        });
    }

    if (createForm) {
        createForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const kind = createKind ? createKind.value : "task";
            const title = normalizeText(createTitle ? createTitle.value : "");
            const noteBody = normalizeText(createNote ? createNote.value : "");
            if (kind === "note" && !noteBody && !title) return;
            if (kind !== "note" && kind !== "shift" && !title) return;
            const date = createDateInput ? createDateInput.value : "";
            const startRaw = normalizeText(createTime ? createTime.value : "");
            const endRaw = normalizeText(createEnd ? createEnd.value : "");
            const durationRaw = normalizeText(createDuration ? createDuration.value : "");
            const color = normalizeText(createColor ? createColor.value : "");
            const allDay = Boolean(createAllDay && createAllDay.checked);
            const start = kind === "event" && allDay ? "00:00" : startRaw;
            const end = kind === "event" && allDay ? "23:59" : endRaw;
            const needsTime = kind === "window" || (kind === "event" && !allDay);
            if (needsTime && !startRaw) return;

            if (kind === "shift") {
                const selected = createShiftSelect ? createShiftSelect.value : "";
                const shiftId = selected ? parseInt(selected, 10) : null;
                await updateShiftOverride(date, {
                    shiftId: Number.isFinite(shiftId) ? shiftId : null,
                    start: "",
                    end: "",
                });
                closeCreate();
                return;
            }

            const typeMap = { task: "tasks", note: "notes", window: "windows", event: "windows" };
            const type = typeMap[kind] || "tasks";
            const payload = {
                action: "add",
                type,
                text: kind === "note" ? (noteBody || title) : title,
            };
            if (kind === "note") {
                payload.title = title;
                payload.body = noteBody;
            }
            if (kind === "task") {
                payload.date = date;
                if (durationRaw) payload.duration = durationRaw;
            }
            if (kind === "window" || kind === "event") {
                payload.date = date;
                payload.time = start;
                if (end) payload.end_time = end;
                payload.kind = kind;
                if (color) payload.color = color;
            }

            if (storageMode === "remote") {
                try {
                    const data = await apiFetch(payload, "POST");
                    const item = data.item;
                    if (!item || !item.id) throw new Error("bad item");
                    if (type === "tasks") state.tasks.push(normalizeTask(item));
                    if (type === "notes") state.notes.push(normalizeNote(item));
                    if (type === "windows") state.windows.push(normalizeWindow(item));
                } catch {
                    switchToLocal();
                }
            }

            if (storageMode === "local") {
                const id = makeId();
                if (type === "tasks") {
                    const parsedDuration = parseInt(durationRaw, 10);
                    state.tasks.push({
                        id,
                        text: title,
                        done: false,
                        date,
                        time: "",
                        duration: Number.isFinite(parsedDuration) && parsedDuration > 0 ? parsedDuration : null,
                    });
                } else if (type === "notes") {
                    state.notes.push({ id, title, body: noteBody });
                } else {
                    state.windows.push({ id, text: title, date, start, end, kind: kind === "event" ? "event" : "window", color });
                }
                persistLocal();
            }

            refreshUI(false);
            closeCreate();
        });
    }

    document.addEventListener("click", async (event) => {
        const removeBtn = event.target.closest("[data-remove-id]");
        if (removeBtn) {
            const id = removeBtn.dataset.removeId;
            const type = removeBtn.dataset.removeType;
            if (!id || !type) return;
            if (storageMode === "remote") {
                try {
                    await apiFetch({ action: "delete", type, id }, "POST");
                } catch {
                    switchToLocal();
                }
            }
            if (type === "tasks") {
                state.tasks = state.tasks.filter((item) => item.id !== id);
            } else if (type === "notes") {
                state.notes = state.notes.filter((item) => item.id !== id);
            } else {
                state.windows = state.windows.filter((item) => item.id !== id);
            }
            if (storageMode === "local") {
                persistLocal();
            }
            refreshUI(false);
            return;
        }

        const taskChip = event.target.closest(".taskChip");
        if (taskChip && !event.target.closest(".chipRemove")) {
            const id = taskChip.dataset.taskId;
            const task = state.tasks.find((item) => item.id === id);
            if (!task) return;
            task.done = !task.done;
            if (storageMode === "remote") {
                try {
                    await apiFetch({ action: "toggle", type: "tasks", id: task.id, done: task.done }, "POST");
                } catch {
                    switchToLocal();
                }
            }
            if (storageMode === "local") {
                persistLocal();
            }
            refreshUI(false);
            return;
        }

        const noteChip = event.target.closest(".noteChip");
        if (noteChip && !event.target.closest(".chipRemove")) {
            const id = noteChip.dataset.noteId;
            const note = state.notes.find((item) => item.id === id);
            if (!note) return;
            openNote(note);
        }
    });

    document.querySelectorAll("[data-unit-select]").forEach((select) => {
        const form = select.closest("form");
        if (!form) return;
        const apply = () => {
            const value = select.value === "imperial" ? "imperial" : "metric";
            form.dataset.unit = value;
        };
        apply();
        select.addEventListener("change", apply);
    });

    document.querySelectorAll("[data-clock-select]").forEach((select) => {
        select.addEventListener("change", () => {
            setClockMode(select.value);
            refreshUI(false);
        });
    });

    init();
})();
