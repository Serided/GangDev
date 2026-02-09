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
        shifts: [],
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
        const meridiem = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        if (hours === 0) hours = 12;
        return `${hours}:${String(mins).padStart(2, "0")} ${meridiem}`;
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

    const clearTimeFields = (scope) => {
        if (!scope) return;
        scope.querySelectorAll("[data-time-field]").forEach((field) => setFieldValue(field, ""));
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
        const typeValue = normalizeText(item.block_type ?? item.type ?? "routine");
        const anchorValue = normalizeText(item.anchor ?? item.routine_anchor ?? "custom");
        const allowed = ["daily", "weekdays", "weekends", "day"];
        const repeat = allowed.includes(repeatValue) ? repeatValue : "daily";
        const type = ["routine", "work", "focus", "custom"].includes(typeValue) ? typeValue : "routine";
        const anchor = ["morning", "evening", "custom"].includes(anchorValue) ? anchorValue : "custom";
        return {
            id: String(item.id ?? ""),
            title: normalizeText(item.title ?? ""),
            time: normalizeText(item.time ?? item.routine_time ?? ""),
            end: normalizeText(item.end ?? item.end_time ?? ""),
            tasks: normalizeRoutineTasks(item.tasks ?? item.tasks_json ?? ""),
            type,
            anchor,
            repeat,
            day: Number.isFinite(parsedDay) ? parsedDay : (days[0] ?? null),
            days,
            shiftId: item.shift_id ?? item.shiftId ?? null,
        };
    };

    const normalizeShift = (item) => ({
        id: String(item.id ?? ""),
        name: normalizeText(item.name ?? ""),
        start: normalizeText(item.start ?? item.start_time ?? ""),
        end: normalizeText(item.end ?? item.end_time ?? ""),
        commuteBefore: Number.isFinite(item.commute_before) ? item.commute_before : parseInt(item.commute_before ?? "0", 10) || 0,
        commuteAfter: Number.isFinite(item.commute_after) ? item.commute_after : parseInt(item.commute_after ?? "0", 10) || 0,
        isDefault: Boolean(item.is_default),
    });

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
        saveItems("shifts", state.shifts);
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
        state.shifts = loadItems("shifts").map(normalizeShift);
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
        state.shifts = Array.isArray(data.shifts) ? data.shifts.map(normalizeShift) : [];
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
        const preferred = routineTypeSelect ? routineTypeSelect.value : "";
        const sorted = state.routines.slice().sort((a, b) => {
            const aPref = preferred && a.type === preferred ? 0 : 1;
            const bPref = preferred && b.type === preferred ? 0 : 1;
            if (aPref !== bPref) return aPref - bPref;
            return a.title.localeCompare(b.title);
        });
        sorted.forEach((routine) => {
            const row = document.createElement("div");
            row.className = "itemRow";

            const text = document.createElement("div");
            const title = document.createElement("div");
            title.className = "itemTitle";
            const typeLabel = routine.type === "work"
                ? "Work"
                : (routine.type === "focus"
                    ? "Focus"
                    : (routine.type === "custom" ? "Custom" : "Routine"));
            title.textContent = routine.title || `${typeLabel} block`;

            const meta = document.createElement("div");
            meta.className = "itemMeta";
            let time = routine.time ? formatTime(routine.time) : "Anytime";
            if (routine.type === "work" && routine.time && routine.end) {
                time = `${formatTime(routine.time)}-${formatTime(routine.end)}`;
            } else if (!routine.time && routine.type === "routine") {
                if (routine.anchor === "morning") time = "Wake time";
                if (routine.anchor === "evening") time = "Bedtime";
            }
            const repeat = formatRepeatRule(routine.repeat, routine.day, routine.days);
            const tasks = Array.isArray(routine.tasks) ? routine.tasks : [];
            const total = routineDuration(routine);
            const detail = total > 0 ? `${total} min` : (tasks.length ? `${tasks.length} tasks` : "No tasks");
            meta.textContent = `${typeLabel} - ${time} - ${repeat} - ${detail}`;

            text.appendChild(title);
            text.appendChild(meta);

            const actions = document.createElement("div");
            actions.className = "itemActions";

            const edit = document.createElement("button");
            edit.type = "button";
            edit.className = "itemEdit";
            edit.dataset.editId = routine.id;
            edit.textContent = "Edit";

            const remove = document.createElement("button");
            remove.type = "button";
            remove.className = "itemRemove";
            remove.dataset.removeId = routine.id;
            remove.dataset.removeKind = "routine";
            remove.textContent = "Remove";

            actions.appendChild(edit);
            actions.appendChild(remove);

            row.appendChild(text);
            row.appendChild(actions);
            routineList.appendChild(row);
        });
    };

    const renderShifts = () => {
        if (!shiftList || !shiftEmpty || !routineShiftSelect) return;
        shiftList.innerHTML = "";
        routineShiftSelect.innerHTML = '<option value="">Select a shift</option>';
        if (state.shifts.length === 0) {
            shiftEmpty.style.display = "block";
            return;
        }
        shiftEmpty.style.display = "none";
        const sorted = state.shifts.slice().sort((a, b) => {
            if (a.isDefault !== b.isDefault) return a.isDefault ? -1 : 1;
            return (a.name || "").localeCompare(b.name || "");
        });
        sorted.forEach((shift) => {
            const option = document.createElement("option");
            const label = shift.name || "Work";
            option.value = shift.id;
            option.textContent = shift.isDefault ? `${label} (default)` : label;
            routineShiftSelect.appendChild(option);

            const row = document.createElement("div");
            row.className = "itemRow";

            const text = document.createElement("div");
            const title = document.createElement("div");
            title.className = "itemTitle";
            title.textContent = label;

            const meta = document.createElement("div");
            meta.className = "itemMeta";
            const commuteParts = [];
            if (shift.commuteBefore) commuteParts.push(`-${shift.commuteBefore}m`);
            if (shift.commuteAfter) commuteParts.push(`+${shift.commuteAfter}m`);
            const commuteText = commuteParts.length ? ` - commute ${commuteParts.join(" / ")}` : "";
            meta.textContent = `${formatTime(shift.start)}-${formatTime(shift.end)}${commuteText}`;

            text.appendChild(title);
            text.appendChild(meta);

            const actions = document.createElement("div");
            actions.className = "itemActions";

            const useBtn = document.createElement("button");
            useBtn.type = "button";
            useBtn.className = "itemEdit";
            useBtn.dataset.shiftUseId = shift.id;
            useBtn.textContent = "Use";

            const defaultBtn = document.createElement("button");
            defaultBtn.type = "button";
            defaultBtn.className = "itemEdit";
            defaultBtn.dataset.shiftDefaultId = shift.id;
            defaultBtn.textContent = shift.isDefault ? "Default" : "Set default";

            const removeBtn = document.createElement("button");
            removeBtn.type = "button";
            removeBtn.className = "itemRemove";
            removeBtn.dataset.shiftRemoveId = shift.id;
            removeBtn.textContent = "Remove";

            actions.appendChild(useBtn);
            actions.appendChild(defaultBtn);
            actions.appendChild(removeBtn);

            row.appendChild(text);
            row.appendChild(actions);
            shiftList.appendChild(row);
        });
        if (routineShiftId && routineShiftId.value) {
            routineShiftSelect.value = routineShiftId.value;
        }
    };

    const renderAll = () => {
        renderSleep();
        renderTasks();
        renderRoutines();
        renderShifts();
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

    const pickSleepRuleForDay = (targetDay) => {
        const matches = state.sleep.filter((rule) =>
            appliesToDay(rule.repeat, rule.day, [], targetDay)
        );
        if (!matches.length) return null;
        const priority = ["day", "weekdays", "weekends", "daily"];
        matches.sort((a, b) => priority.indexOf(a.repeat) - priority.indexOf(b.repeat));
        return matches[0];
    };

    const resolveRoutineTime = (routine, sleepRule) => {
        if (!routine) return "";
        if (routine.type === "routine" && routine.anchor && routine.anchor !== "custom") {
            if (!sleepRule) return "";
            if (routine.anchor === "morning") {
                return sleepRule.end || "";
            }
            if (routine.anchor === "evening") {
                if (!sleepRule.start) return "";
                const duration = routineDuration(routine);
                return duration > 0 ? addMinutes(sleepRule.start, -duration) : sleepRule.start;
            }
        }
        return routine.time || "";
    };

    const getWeekItems = (targetDay) => {
        const items = [];
        const sleepRule = pickSleepRuleForDay(targetDay);
        state.routines.forEach((routine) => {
            if (!appliesToDay(routine.repeat, routine.day, routine.days, targetDay)) return;
            items.push({
                kind: routine.type || "routine",
                title: routine.title || "Routine",
                time: resolveRoutineTime(routine, sleepRule),
                duration: routineDuration(routine),
            });
        });
        state.tasks.forEach((rule) => {
            if (!appliesToDay(rule.repeat, rule.day, [], targetDay)) return;
            items.push({
                kind: "task",
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

    const setWeekBlock = (block, label, timeValue) => {
        if (!block) return;
        block.innerHTML = "";
        const labelSpan = document.createElement("span");
        labelSpan.className = "weekBlockLabel";
        labelSpan.textContent = label;
        block.appendChild(labelSpan);

        const timeText = timeValue ? formatTime(timeValue) : "";
        block.classList.toggle("is-set", Boolean(timeText));
        if (timeText) {
            const timeSpan = document.createElement("span");
            timeSpan.className = "weekBlockTime";
            timeSpan.textContent = timeText;
            const check = document.createElement("span");
            check.className = "weekBlockCheck";
            check.textContent = "OK";
            timeSpan.appendChild(check);
            block.appendChild(timeSpan);
        }
    };

    const renderWeekTemplate = () => {
        if (!weekColumns.length) return;
        weekColumns.forEach((column) => {
            const day = parseInt(column.dataset.weekDay, 10);
            const list = column.querySelector("[data-week-list]");
            if (!list) return;
            list.innerHTML = "";
            const safeDay = Number.isFinite(day) ? day : 0;
            const sleepRule = pickSleepRuleForDay(safeDay);
            const sleepBlocks = column.querySelectorAll(".weekBlock.is-sleep");
            if (sleepBlocks.length >= 2) {
                const wakeBlock = sleepBlocks[0];
                const bedBlock = sleepBlocks[sleepBlocks.length - 1];
                setWeekBlock(wakeBlock, "Wake", sleepRule && sleepRule.end ? sleepRule.end : "");
                setWeekBlock(bedBlock, "Bed", sleepRule && sleepRule.start ? sleepRule.start : "");
            }
            const items = getWeekItems(safeDay);
            items.forEach((item) => {
                const row = document.createElement("div");
                const kindClass = item.kind === "sleep"
                    ? "is-sleep"
                    : (item.kind === "work"
                        ? "is-work"
                        : (item.kind === "focus"
                            ? "is-focus"
                            : (item.kind === "task" ? "is-task" : "is-routine")));
                row.className = `weekItem ${kindClass}`;

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

    const upsertRoutine = (routine) => {
        const index = state.routines.findIndex((item) => item.id === routine.id);
        if (index >= 0) {
            state.routines[index] = routine;
        } else {
            state.routines.push(routine);
        }
    };

    const addRoutine = async (payload) => {
        if (storageMode === "remote") {
            try {
                const data = await apiFetch(payload, "POST");
                if (data && data.routine) {
                    upsertRoutine(normalizeRoutine(data.routine));
                    renderAll();
                    return;
                }
            } catch {
                switchToLocal();
            }
        }

        if (storageMode === "local") {
            const id = payload.id || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
            const localRoutine = normalizeRoutine({ id, ...payload });
            upsertRoutine(localRoutine);
            persistLocal();
            renderAll();
        }
    };

    const upsertShift = (shift) => {
        const index = state.shifts.findIndex((item) => item.id === shift.id);
        if (index >= 0) {
            state.shifts[index] = shift;
        } else {
            state.shifts.push(shift);
        }
    };

    const addShift = async (payload) => {
        if (storageMode === "remote") {
            try {
                const data = await apiFetch(payload, "POST");
                if (data && data.shift) {
                    upsertShift(normalizeShift(data.shift));
                    renderAll();
                    return;
                }
            } catch {
                switchToLocal();
            }
        }
        if (storageMode === "local") {
            const id = payload.id || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
            const localShift = normalizeShift({ id, ...payload });
            if (payload.is_default) {
                state.shifts = state.shifts.map((item) => ({ ...item, isDefault: false }));
                localShift.isDefault = true;
            }
            upsertShift(localShift);
            persistLocal();
            renderAll();
        }
    };

    const setDefaultShift = async (id) => {
        if (!id) return;
        if (storageMode === "remote") {
            try {
                await apiFetch({ action: "set_default_shift", id }, "POST");
            } catch {
                switchToLocal();
            }
        }
        state.shifts = state.shifts.map((shift) => ({
            ...shift,
            isDefault: String(shift.id) === String(id),
        }));
        if (storageMode === "local") {
            persistLocal();
        }
        renderAll();
    };

    const removeShift = async (id) => {
        if (!id) return;
        if (storageMode === "remote") {
            try {
                await apiFetch({ action: "delete_shift", id }, "POST");
            } catch {
                switchToLocal();
            }
        }
        state.shifts = state.shifts.filter((shift) => shift.id !== id);
        if (storageMode === "local") {
            persistLocal();
        }
        renderAll();
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
        if (editingRoutineId && editingRoutineId === id && routineForm) {
            routineForm.reset();
            clearTimeFields(routineForm);
            clearRoutineTasks();
            setRoutineEditState(null);
            updateRoutineFormVisibility();
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
    const sleepStartField = sleepStartInput ? sleepStartInput.closest("[data-time-field]") : null;
    const sleepEndField = sleepEndInput ? sleepEndInput.closest("[data-time-field]") : null;
    const sleepRepeatSelect = sleepForm ? sleepForm.querySelector("[data-repeat-select]") : null;
    const sleepDaySelect = sleepForm ? sleepForm.querySelector("#sleep-day") : null;

    const sleepMinutesForRepeat = () => {
        return recommendedSleepMinutes(ageYears);
    };

    const updateSleepEnd = () => {
        if (!sleepStartInput || !sleepEndField) return;
        const start = normalizeText(sleepStartInput.value);
        if (!start) {
            setFieldValue(sleepEndField, "");
            return;
        }
        const duration = sleepMinutesForRepeat();
        const endValue = addMinutes(start, duration);
        const parsed = parseTimeValue(endValue);
        if (!parsed) return;
        setFieldValue(sleepEndField, `${pad2(parsed.hour)}:${pad2(parsed.minute)}`);
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
            clearTimeFields(sleepForm);
            const sleepRepeat = sleepForm.querySelector("[data-repeat-select]");
            const sleepDayField = sleepForm.querySelector("[data-day-field]");
            applyRepeatToggle(sleepRepeat, sleepDayField);
        });
    }

    if (sleepStartField) {
        sleepStartField.addEventListener("timechange", updateSleepEnd);
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
            if (sleepStartField) setFieldValue(sleepStartField, "", { emit: false });
            if (sleepEndField) setFieldValue(sleepEndField, "", { emit: false });
            clearRules("sleep");
            if (sleepForm) {
                sleepForm.reset();
                clearTimeFields(sleepForm);
                const sleepRepeat = sleepForm.querySelector("[data-repeat-select]");
                const sleepDayField = sleepForm.querySelector("[data-day-field]");
                applyRepeatToggle(sleepRepeat, sleepDayField);
            }
        });
    }

    const routineForm = document.querySelector("[data-routine-form]");
    const routineTypeSelect = routineForm ? routineForm.querySelector("[data-block-type]") : null;
    const routineAnchorSelect = routineForm ? routineForm.querySelector("[data-anchor-select]") : null;
    const routineTitleField = routineForm ? routineForm.querySelector("[data-title-field]") : null;
    const routineTitleInput = routineForm ? routineForm.querySelector("#routine-title") : null;
    const routineTimeFieldWrap = routineForm ? routineForm.querySelector("[data-time-field-wrap]") : null;
    const routineStartField = routineForm ? routineForm.querySelector("#routine-time")?.closest("[data-time-field]") : null;
    const routineEndInput = routineForm ? routineForm.querySelector("#routine-end") : null;
    const routineEndField = routineEndInput ? routineEndInput.closest("[data-time-field]") : null;
    const routineShiftSelect = routineForm ? routineForm.querySelector("[data-shift-select]") : null;
    const routineShiftUse = routineForm ? routineForm.querySelector("[data-shift-use]") : null;
    const routineShiftId = routineForm ? routineForm.querySelector("[data-shift-id]") : null;
    const routineCustomButton = routineForm ? routineForm.querySelector("[data-custom-window]") : null;
    const routineAnchorField = routineForm ? routineForm.querySelector("[data-anchor-field]") : null;
    const routineAnchorNote = routineForm ? routineForm.querySelector("[data-anchor-note]") : null;
    const routineSubmit = routineForm ? routineForm.querySelector("[data-routine-submit]") : null;
    const routineCancel = routineForm ? routineForm.querySelector("[data-routine-cancel]") : null;
    const shiftPanel = routineForm ? routineForm.querySelector("[data-shift-panel]") : null;
    const shiftNameInput = routineForm ? routineForm.querySelector("#shift-name") : null;
    const shiftStartInput = routineForm ? routineForm.querySelector("#shift-start") : null;
    const shiftEndInput = routineForm ? routineForm.querySelector("#shift-end") : null;
    const shiftStartField = shiftStartInput ? shiftStartInput.closest("[data-time-field]") : null;
    const shiftEndField = shiftEndInput ? shiftEndInput.closest("[data-time-field]") : null;
    const shiftCommuteBeforeInput = routineForm ? routineForm.querySelector("#shift-commute-before") : null;
    const shiftCommuteAfterInput = routineForm ? routineForm.querySelector("#shift-commute-after") : null;
    const shiftDefaultInput = routineForm ? routineForm.querySelector("#shift-default") : null;
    const shiftSaveBtn = routineForm ? routineForm.querySelector("[data-shift-save]") : null;
    const shiftClearBtn = routineForm ? routineForm.querySelector("[data-shift-clear]") : null;
    const shiftList = routineForm ? routineForm.querySelector("[data-shift-list]") : null;
    const shiftEmpty = routineForm ? routineForm.querySelector("[data-shift-empty]") : null;
    let editingRoutineId = null;
    let editingShiftId = null;

    const anchorTitle = (anchor) => {
        if (anchor === "morning") return "Morning routine";
        if (anchor === "evening") return "Evening routine";
        return "Routine";
    };

    const setRoutineEditState = (routine) => {
        editingRoutineId = routine ? routine.id : null;
        if (routineSubmit) {
            routineSubmit.textContent = "Save";
        }
        if (routineCancel) {
            routineCancel.style.display = routine ? "inline-flex" : "none";
        }
    };

    const updateRoutineFormVisibility = () => {
        if (!routineForm) return;
        const type = routineTypeSelect ? routineTypeSelect.value : "routine";
        const isRoutine = type === "routine";
        const isWork = type === "work";
        if (routineAnchorField) {
            routineAnchorField.style.display = isRoutine ? "grid" : "none";
        }
        const anchor = isRoutine && routineAnchorSelect ? routineAnchorSelect.value : "custom";
        const needsCustomTitle = !isRoutine || anchor === "custom";
        if (routineTitleField) {
            routineTitleField.style.display = needsCustomTitle || isWork ? "grid" : "none";
        }
        if (routineTimeFieldWrap) {
            routineTimeFieldWrap.style.display = (!isRoutine || anchor === "custom") ? "grid" : "none";
        }
        if (routineEndField) {
            routineEndField.style.display = isWork ? "grid" : "none";
        }
        if (routineShiftSelect) {
            routineShiftSelect.closest("[data-work-shift-select]")?.style.setProperty("display", isWork ? "grid" : "none");
        }
        if (shiftPanel) {
            shiftPanel.classList.toggle("is-active", isWork);
        }
        if (!isWork) {
            if (routineShiftId) routineShiftId.value = "";
            if (routineShiftSelect) routineShiftSelect.value = "";
        }
        if (routineTitleInput) {
            routineTitleInput.required = needsCustomTitle && !isWork;
        }
        if (routineAnchorNote) {
            routineAnchorNote.textContent = "";
            routineAnchorNote.style.display = isRoutine ? "block" : "none";
            if (isRoutine && anchor !== "custom") {
                routineAnchorNote.textContent = anchor === "morning"
                    ? "Anchored to wake time after your sleep schedule."
                    : "Ends at bedtime based on your sleep schedule.";
            }
        }
        renderRoutines();
    };

    const clearShiftForm = () => {
        editingShiftId = null;
        if (shiftNameInput) shiftNameInput.value = "";
        if (shiftStartField) setFieldValue(shiftStartField, "", { emit: false });
        if (shiftEndField) setFieldValue(shiftEndField, "", { emit: false });
        if (shiftCommuteBeforeInput) shiftCommuteBeforeInput.value = "";
        if (shiftCommuteAfterInput) shiftCommuteAfterInput.value = "";
        if (shiftDefaultInput) shiftDefaultInput.checked = false;
    };

    const fillShiftForm = (shift) => {
        if (!shift) return;
        editingShiftId = shift.id;
        if (shiftNameInput) shiftNameInput.value = shift.name || "";
        if (shiftStartField) setFieldValue(shiftStartField, shift.start || "", { emit: false });
        if (shiftEndField) setFieldValue(shiftEndField, shift.end || "", { emit: false });
        if (shiftCommuteBeforeInput) shiftCommuteBeforeInput.value = shift.commuteBefore ? String(shift.commuteBefore) : "";
        if (shiftCommuteAfterInput) shiftCommuteAfterInput.value = shift.commuteAfter ? String(shift.commuteAfter) : "";
        if (shiftDefaultInput) shiftDefaultInput.checked = shift.isDefault;
    };

    const applyShiftToRoutine = (shiftId) => {
        if (!shiftId) return;
        const shift = state.shifts.find((item) => String(item.id) === String(shiftId));
        if (!shift) return;
        if (routineTypeSelect) {
            routineTypeSelect.value = "work";
        }
        updateRoutineFormVisibility();
        if (routineShiftSelect) routineShiftSelect.value = String(shift.id);
        if (routineShiftId) routineShiftId.value = String(shift.id);
        if (routineTitleInput && !routineTitleInput.value.trim()) {
            routineTitleInput.value = shift.name || "Work";
        }
        if (routineStartField) {
            setFieldValue(routineStartField, shift.start || "", { emit: false });
        }
        if (routineEndField) {
            setFieldValue(routineEndField, shift.end || "", { emit: false });
        }
    };

    if (routineTypeSelect) {
        routineTypeSelect.addEventListener("change", updateRoutineFormVisibility);
    }
    if (routineAnchorSelect) {
        routineAnchorSelect.addEventListener("change", updateRoutineFormVisibility);
    }
    if (routineCustomButton && routineTypeSelect) {
        routineCustomButton.addEventListener("click", () => {
            routineTypeSelect.value = "custom";
            updateRoutineFormVisibility();
        });
    }

    if (routineShiftUse) {
        routineShiftUse.addEventListener("click", () => {
            const shiftId = routineShiftSelect ? routineShiftSelect.value : "";
            if (!shiftId) return;
            applyShiftToRoutine(shiftId);
        });
    }

    if (shiftSaveBtn) {
        shiftSaveBtn.addEventListener("click", () => {
            const name = normalizeText(shiftNameInput ? shiftNameInput.value : "");
            const start = normalizeText(shiftStartInput ? shiftStartInput.value : "");
            const end = normalizeText(shiftEndInput ? shiftEndInput.value : "");
            if (!start || !end) return;
            const commuteBefore = shiftCommuteBeforeInput && shiftCommuteBeforeInput.value
                ? parseInt(shiftCommuteBeforeInput.value, 10)
                : 0;
            const commuteAfter = shiftCommuteAfterInput && shiftCommuteAfterInput.value
                ? parseInt(shiftCommuteAfterInput.value, 10)
                : 0;
            const payload = {
                action: editingShiftId ? "update_shift" : "add_shift",
                id: editingShiftId,
                name,
                start,
                end,
                commute_before: Number.isFinite(commuteBefore) ? commuteBefore : 0,
                commute_after: Number.isFinite(commuteAfter) ? commuteAfter : 0,
                is_default: Boolean(shiftDefaultInput && shiftDefaultInput.checked),
            };
            addShift(payload);
            clearShiftForm();
        });
    }

    if (shiftClearBtn) {
        shiftClearBtn.addEventListener("click", clearShiftForm);
    }

    if (routineCancel) {
        routineCancel.addEventListener("click", () => {
            if (!routineForm) return;
            routineForm.reset();
            clearTimeFields(routineForm);
            const routineRepeat = routineForm.querySelector("[data-routine-repeat]");
            const routineDayField = routineForm.querySelector("[data-routine-day-field]");
            applyRepeatToggle(routineRepeat, routineDayField);
            routineForm.querySelectorAll("[data-routine-day]").forEach((input) => {
                input.checked = false;
            });
            if (routineShiftId) routineShiftId.value = "";
            if (routineShiftSelect) routineShiftSelect.value = "";
            clearRoutineTasks();
            setRoutineEditState(null);
            updateRoutineFormVisibility();
        });
    }

    if (routineStartField) {
        routineStartField.addEventListener("timechange", () => {
            if (routineShiftId) routineShiftId.value = "";
            if (routineShiftSelect) routineShiftSelect.value = "";
        });
    }
    if (routineEndField) {
        routineEndField.addEventListener("timechange", () => {
            if (routineShiftId) routineShiftId.value = "";
            if (routineShiftSelect) routineShiftSelect.value = "";
        });
    }

    if (routineForm) {
        routineForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const formData = new FormData(routineForm);
            const type = routineTypeSelect ? routineTypeSelect.value : "routine";
            const anchor = type === "routine" && routineAnchorSelect ? routineAnchorSelect.value : "custom";
            const customTitle = normalizeText(formData.get("title"));
            const title = type === "routine" && anchor !== "custom" ? anchorTitle(anchor) : customTitle;
            const time = normalizeText(formData.get("time"));
            const end = normalizeText(formData.get("end"));
            const repeat = normalizeText(formData.get("repeat")) || "daily";
            const dayInputs = Array.from(routineForm.querySelectorAll("[data-routine-day]"));
            const days = dayInputs
                .filter((input) => input.checked)
                .map((input) => parseInt(input.value, 10))
                .filter((value) => Number.isFinite(value) && value >= 0 && value <= 6);
            if (repeat === "day" && days.length === 0) return;
            if (type === "work") {
                if (!time || !end) return;
            } else if ((type !== "routine" || anchor === "custom") && !time) return;
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
            const shiftId = routineShiftId && routineShiftId.value ? parseInt(routineShiftId.value, 10) : null;
            const payload = {
                action: editingRoutineId ? "update_routine" : "add_routine",
                id: editingRoutineId,
                title: title || (type === "work" ? "Work" : ""),
                time: type === "routine" && anchor !== "custom" ? "" : time,
                end: type === "work" ? end : "",
                repeat,
                day: days[0],
                days,
                tasks,
                block_type: type,
                anchor,
                shift_id: shiftId,
            };
            addRoutine(payload);
            routineForm.reset();
            clearTimeFields(routineForm);
            const routineRepeat = routineForm.querySelector("[data-routine-repeat]");
            const routineDayField = routineForm.querySelector("[data-routine-day-field]");
            applyRepeatToggle(routineRepeat, routineDayField);
            dayInputs.forEach((input) => {
                input.checked = false;
            });
            if (routineShiftId) routineShiftId.value = "";
            if (routineShiftSelect) routineShiftSelect.value = "";
            clearRoutineTasks();
            setRoutineEditState(null);
            updateRoutineFormVisibility();
        });
    }

    const routineTaskStack = document.querySelector("[data-routine-tasks]");
    const routineAddTask = document.querySelector("[data-routine-add-task]");
    const routineTotal = document.querySelector("[data-routine-total]");
    let draggedTaskRow = null;

    const buildRoutineTaskRow = (task = {}) => {
        const row = document.createElement("div");
        row.className = "taskRow";
        row.dataset.taskRow = "true";
        row.draggable = true;
        row.setAttribute("draggable", "true");

        const drag = document.createElement("button");
        drag.type = "button";
        drag.className = "taskDrag";
        drag.dataset.taskDrag = "true";
        drag.textContent = "||";
        drag.setAttribute("aria-label", "Drag to reorder");
        drag.draggable = true;
        drag.setAttribute("draggable", "true");
        drag.addEventListener("mousedown", (event) => event.preventDefault());

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

        row.appendChild(drag);
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

    const fillRoutineTasks = (tasks) => {
        if (!routineTaskStack) return;
        routineTaskStack.innerHTML = "";
        if (Array.isArray(tasks) && tasks.length > 0) {
            tasks.forEach((task) => {
                routineTaskStack.appendChild(buildRoutineTaskRow(task));
            });
        } else {
            routineTaskStack.appendChild(buildRoutineTaskRow());
        }
        updateRoutineTotal();
    };

    const startRoutineEdit = (routine) => {
        if (!routineForm || !routine) return;
        if (routineTypeSelect) routineTypeSelect.value = routine.type || "routine";
        if (routineAnchorSelect) routineAnchorSelect.value = routine.anchor || "custom";
        if (routineTitleInput) routineTitleInput.value = routine.title || "";
        const timeField = routineForm.querySelector("#routine-time");
        if (timeField) {
            const fieldWrap = timeField.closest("[data-time-field]");
            setFieldValue(fieldWrap, routine.time || "");
        }
        if (routineEndInput) {
            const endField = routineEndInput.closest("[data-time-field]");
            setFieldValue(endField, routine.end || "");
        }
        if (routineShiftId) {
            routineShiftId.value = routine.shiftId ? String(routine.shiftId) : "";
        }
        if (routineShiftSelect) {
            routineShiftSelect.value = routine.shiftId ? String(routine.shiftId) : "";
        }
        const repeatSelect = routineForm.querySelector("[data-routine-repeat]");
        if (repeatSelect) repeatSelect.value = routine.repeat || "daily";
        const dayInputs = Array.from(routineForm.querySelectorAll("[data-routine-day]"));
        dayInputs.forEach((input) => {
            const value = parseInt(input.value, 10);
            input.checked = Array.isArray(routine.days) ? routine.days.includes(value) : value === routine.day;
        });
        applyRepeatToggle(repeatSelect, routineForm.querySelector("[data-routine-day-field]"));
        fillRoutineTasks(routine.tasks);
        setRoutineEditState(routine);
        updateRoutineFormVisibility();
    };

    const getTaskRowAfter = (container, y) => {
        const rows = Array.from(container.querySelectorAll(".taskRow:not(.is-dragging)"));
        return rows.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset, element: child };
            }
            return closest;
        }, { offset: Number.NEGATIVE_INFINITY, element: null }).element;
    };

    if (routineTaskStack) {
        routineTaskStack.addEventListener("dragstart", (event) => {
            const row = event.target.closest("[data-task-row]");
            if (!row) return;
            if (event.target.closest("input, textarea, select")) {
                event.preventDefault();
                return;
            }
            draggedTaskRow = row;
            row.classList.add("is-dragging");
            if (event.dataTransfer) {
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text/plain", "task");
            }
        });

        routineTaskStack.addEventListener("dragover", (event) => {
            if (!draggedTaskRow) return;
            event.preventDefault();
            const after = getTaskRowAfter(routineTaskStack, event.clientY);
            if (after === null) {
                routineTaskStack.appendChild(draggedTaskRow);
            } else {
                routineTaskStack.insertBefore(draggedTaskRow, after);
            }
        });

        routineTaskStack.addEventListener("drop", (event) => {
            if (!draggedTaskRow) return;
            event.preventDefault();
            draggedTaskRow.classList.remove("is-dragging");
            draggedTaskRow = null;
            updateRoutineTotal();
        });

        routineTaskStack.addEventListener("dragend", () => {
            if (draggedTaskRow) {
                draggedTaskRow.classList.remove("is-dragging");
            }
            draggedTaskRow = null;
        });
    }

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
        const shiftUse = event.target.closest("[data-shift-use-id]");
        if (shiftUse) {
            applyShiftToRoutine(shiftUse.dataset.shiftUseId);
            return;
        }
        const shiftDefault = event.target.closest("[data-shift-default-id]");
        if (shiftDefault) {
            setDefaultShift(shiftDefault.dataset.shiftDefaultId);
            return;
        }
        const shiftRemove = event.target.closest("[data-shift-remove-id]");
        if (shiftRemove) {
            removeShift(shiftRemove.dataset.shiftRemoveId);
            return;
        }
        const editBtn = event.target.closest("[data-edit-id]");
        if (editBtn) {
            const id = editBtn.dataset.editId;
            const routine = state.routines.find((item) => item.id === id);
            if (routine) {
                startRoutineEdit(routine);
            }
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
            clearTimeFields(repeatForm);
            closeRepeatOverlay();
        });
    }

    const init = async () => {
        initRepeatSelects();
        initTimePicker();
        initTimeFields();
        ensureRoutineTaskRow();
        updateRoutineTotal();
        updateRoutineFormVisibility();
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
