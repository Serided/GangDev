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
        let dragMoved = false;
        let pendingValue = null;
        let snapTimer = null;
        const applyWheelValue = (value) => {
            scrollWheelTo(wheel, value);
            onChange(value);
            updateManualInputs();
        };
        const handleWheelItemClick = (event) => {
            const direct = event.target.closest(".timeWheelItem");
            if (!direct) return false;
            const value = parseInt(direct.dataset.timeValue, 10);
            if (!Number.isFinite(value)) return false;
            applyWheelValue(value);
            return true;
        };
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
            handleWheelItemClick(event);
        });
        wheel.addEventListener("pointerdown", (event) => {
            dragActive = true;
            dragStartY = event.clientY;
            dragStartScroll = wheel.scrollTop;
            dragMoved = false;
            pendingValue = null;
            const direct = event.target.closest(".timeWheelItem");
            if (direct) {
                const value = parseInt(direct.dataset.timeValue, 10);
                if (Number.isFinite(value)) pendingValue = value;
            }
            wheel.setPointerCapture(event.pointerId);
            wheel.classList.add("is-dragging");
            event.preventDefault();
        });
        wheel.addEventListener("pointermove", (event) => {
            if (!dragActive) return;
            const delta = event.clientY - dragStartY;
            if (Math.abs(delta) > 3) {
                dragMoved = true;
                pendingValue = null;
            }
            wheel.scrollTop = dragStartScroll - delta;
        });
        const endDrag = (event) => {
            if (!dragActive) return;
            dragActive = false;
            wheel.classList.remove("is-dragging");
            if (event && event.pointerId !== undefined) {
                wheel.releasePointerCapture(event.pointerId);
            }
            if (!dragMoved) {
                if (pendingValue !== null) {
                    applyWheelValue(pendingValue);
                    pendingValue = null;
                    return;
                }
                if (handleWheelItemClick(event)) return;
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

    const normalizeText = (value) => String(value ?? "").trim();
    const normalizeColor = (value, fallback = "") => {
        const raw = normalizeText(value).toLowerCase();
        if (!raw) return fallback;
        const hex = raw.startsWith("#") ? raw.slice(1) : raw;
        if (!/^[0-9a-f]{6}$/.test(hex)) return fallback;
        return `#${hex}`;
    };

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
            color: normalizeColor(item.color ?? item.hex ?? ""),
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
            color: normalizeColor(item.color ?? item.hex ?? ""),
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
        const text = await res.text();
        let data = null;
        if (text) {
            try {
                data = JSON.parse(text);
            } catch {
                data = null;
            }
        }
        if (!res.ok) {
            const detail = data && typeof data === "object" ? data : text;
            console.error("API error", res.status, detail);
            throw new Error(`api ${res.status}`);
        }
        return data || {};
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

            const actions = document.createElement("div");
            actions.className = "itemActions";

            const edit = document.createElement("button");
            edit.type = "button";
            edit.className = "itemEdit";
            edit.dataset.sleepEdit = rule.id;
            edit.textContent = "Edit";

            const remove = document.createElement("button");
            remove.type = "button";
            remove.className = "itemRemove";
            remove.dataset.removeId = rule.id;
            remove.dataset.removeKind = "sleep";
            remove.textContent = "Remove";

            row.appendChild(text);
            actions.appendChild(edit);
            actions.appendChild(remove);
            row.appendChild(actions);
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

    const renderShiftSelect = () => {
        if (!routineShiftSelect) return;
        routineShiftSelect.innerHTML = '<option value="">Select a shift</option>';
        if (state.shifts.length === 0) return;
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
        });
        if (routineShiftId && routineShiftId.value) {
            routineShiftSelect.value = routineShiftId.value;
        }
    };

    const renderRoutineUseSelect = () => {
        if (!routineUseSelect) return;
        routineUseSelect.innerHTML = '<option value="">Select a routine</option>';
        const routines = state.routines.filter((routine) => routine.type === "routine");
        if (routines.length === 0) return;
        routines
            .slice()
            .sort((a, b) => (a.title || "").localeCompare(b.title || ""))
            .forEach((routine) => {
                const option = document.createElement("option");
                const anchorLabel = routine.anchor === "morning"
                    ? "Morning"
                    : (routine.anchor === "evening" ? "Evening" : "Custom");
                option.value = routine.id;
                option.textContent = routine.title ? `${routine.title} (${anchorLabel})` : `${anchorLabel} routine`;
                routineUseSelect.appendChild(option);
            });
    };

    const renderAll = () => {
        renderSleep();
        renderTasks();
        renderRoutines();
        renderShiftSelect();
        renderRoutineUseSelect();
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

    const resolveRoutineEnd = (routine, startTime, sleepRule) => {
        if (!routine) return "";
        if (routine.end) return routine.end;
        if (!startTime) return "";
        if (routine.type === "routine" && routine.anchor === "evening" && sleepRule && sleepRule.start) {
            return sleepRule.start;
        }
        const duration = routineDuration(routine);
        return duration > 0 ? addMinutes(startTime, duration) : "";
    };

    const getWeekItems = (targetDay) => {
        const items = [];
        const sleepRule = pickSleepRuleForDay(targetDay);
        state.routines.forEach((routine) => {
            if (!appliesToDay(routine.repeat, routine.day, routine.days, targetDay)) return;
            const startTime = resolveRoutineTime(routine, sleepRule);
            const endTime = resolveRoutineEnd(routine, startTime, sleepRule);
            items.push({
                kind: routine.type || "routine",
                title: routine.title || "Routine",
                time: startTime,
                end: endTime,
                duration: routineDuration(routine),
                anchor: routine.anchor || "custom",
                shiftId: routine.shiftId ?? null,
            });
        });
        state.tasks.forEach((rule) => {
            if (!appliesToDay(rule.repeat, rule.day, [], targetDay)) return;
            items.push({
                kind: "task",
                title: rule.title || "Repeat task",
                time: rule.start,
                end: "",
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

    const setWeekBlock = (block, label, timeValue, timeEnd = "") => {
        if (!block) return;
        block.innerHTML = "";
        const labelSpan = document.createElement("span");
        labelSpan.className = "weekBlockLabel";
        labelSpan.textContent = label;
        block.appendChild(labelSpan);

        let timeText = "";
        if (timeValue && timeEnd) {
            timeText = `${formatTime(timeValue)}-${formatTime(timeEnd)}`;
        } else if (timeValue) {
            timeText = formatTime(timeValue);
        }
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
            const stack = column.querySelector(".weekStack");
            if (!list || !stack) return;
            list.innerHTML = "";
            stack.innerHTML = "";
            const safeDay = Number.isFinite(day) ? day : 0;
            const sleepRule = pickSleepRuleForDay(safeDay);
            const items = getWeekItems(safeDay);
            const workItems = items.filter((item) => item.kind === "work");
            const hasWork = workItems.length > 0;
            const hasFocus = items.some((item) => item.kind === "focus");
            const hasCustom = items.some((item) => item.kind === "custom");
            const workItem = workItems
                .slice()
                .sort((a, b) => {
                    const aTime = parseMinutes(a.time) ?? 9999;
                    const bTime = parseMinutes(b.time) ?? 9999;
                    return aTime - bTime;
                })[0];

            const pushBlock = (label, className, timeValue, timeEnd = "") => {
                const block = document.createElement("div");
                block.className = `weekBlock ${className}`.trim();
                setWeekBlock(block, label, timeValue, timeEnd);
                stack.appendChild(block);
            };

            const morningRoutine = items.find((item) => item.kind === "routine" && item.anchor === "morning");
            const eveningRoutine = items.find((item) => item.kind === "routine" && item.anchor === "evening");

            pushBlock("Wake", "is-sleep", sleepRule && sleepRule.end ? sleepRule.end : "");
            pushBlock(
                "Morning routine",
                "is-morning",
                morningRoutine && morningRoutine.time ? morningRoutine.time : "",
                morningRoutine && morningRoutine.end ? morningRoutine.end : ""
            );
            if (hasWork) {
                let workStart = workItem ? workItem.time : "";
                let workEnd = workItem ? workItem.end : "";
                if (workItem && workItem.shiftId) {
                    const shift = state.shifts.find((item) => String(item.id) === String(workItem.shiftId));
                    if (shift) {
                        const baseStart = shift.start || workStart;
                        const baseEnd = shift.end || workEnd;
                        workStart = baseStart
                            ? addMinutes(baseStart, -(shift.commuteBefore || 0))
                            : workStart;
                        workEnd = baseEnd
                            ? addMinutes(baseEnd, shift.commuteAfter || 0)
                            : workEnd;
                    }
                }
                const block = document.createElement("div");
                block.className = "weekBlock is-work";
                setWeekBlock(block, "Work", workStart, workEnd);
                stack.appendChild(block);
            }
            if (hasFocus) pushBlock("Focus", "is-focus", "");
            if (hasCustom) pushBlock("Window", "is-life", "");
            if (!hasWork && !hasFocus && !hasCustom) {
                pushBlock("Focus/Work", "is-focus", "");
            }
            pushBlock(
                "Evening routine",
                "is-evening",
                eveningRoutine && eveningRoutine.time ? eveningRoutine.time : "",
                eveningRoutine && eveningRoutine.end ? eveningRoutine.end : ""
            );
            pushBlock("Bed", "is-sleep", sleepRule && sleepRule.start ? sleepRule.start : "");

            items.forEach((item) => {
                if (item.kind === "work") return;
                if (item.kind === "routine" && (item.anchor === "morning" || item.anchor === "evening")) return;
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

    const applyRoutineDayDefaults = (repeat, options = {}) => {
        const dayInputs = Array.from(document.querySelectorAll("[data-routine-day]"));
        if (!dayInputs.length) return;
        const shouldClearForDay = options.clearForDay === true;
        if (repeat === "daily") {
            dayInputs.forEach((input) => {
                input.checked = true;
            });
            return;
        }
        if (repeat === "weekdays") {
            dayInputs.forEach((input) => {
                const value = parseInt(input.value, 10);
                input.checked = value >= 1 && value <= 5;
            });
            return;
        }
        if (repeat === "weekends") {
            dayInputs.forEach((input) => {
                const value = parseInt(input.value, 10);
                input.checked = value === 0 || value === 6;
            });
            return;
        }
        if (repeat === "day" && shouldClearForDay) {
            dayInputs.forEach((input) => {
                input.checked = false;
            });
        }
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
            const updateRoutineRepeat = (clearForDay = false) => {
                applyRepeatToggle(routineRepeat, routineDayField);
                applyRoutineDayDefaults(routineRepeat.value, { clearForDay });
            };
            updateRoutineRepeat(false);
            routineRepeat.addEventListener("change", () => updateRoutineRepeat(true));
        }
    };

    const upsertRule = (rule) => {
        const index = state.rules.findIndex((item) => item.id === rule.id);
        if (index >= 0) {
            state.rules[index] = rule;
        } else {
            state.rules.push(rule);
        }
    };

    const addRule = async (payload) => {
        const isUpdate = payload.action === "update_rule";
        if (storageMode === "remote") {
            try {
                const data = await apiFetch(payload, "POST");
                if (data && data.rule) {
                    const normalized = normalizeRule(data.rule);
                    if (isUpdate) {
                        upsertRule(normalized);
                    } else {
                        state.rules.push(normalized);
                    }
                    splitRules();
                    renderAll();
                    return;
                }
            } catch {
                switchToLocal();
            }
        }

        if (storageMode === "local") {
            const id = isUpdate && payload.id
                ? String(payload.id)
                : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
            const localRule = normalizeRule({ id, ...payload });
            if (isUpdate) {
                upsertRule(localRule);
            } else {
                state.rules.push(localRule);
            }
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
                    const routine = normalizeRoutine(data.routine);
                    upsertRoutine(routine);
                    renderAll();
                    return routine;
                }
            } catch {
                switchToLocal();
            }
            if (storageMode === "remote") {
                switchToLocal();
            }
        }

        if (storageMode === "local") {
            const id = payload.id || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
            const localRoutine = normalizeRoutine({ id, ...payload });
            upsertRoutine(localRoutine);
            persistLocal();
            renderAll();
            return localRoutine;
        }
        return null;
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
                    const shift = normalizeShift(data.shift);
                    upsertShift(shift);
                    renderAll();
                    return shift;
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
            return localShift;
        }
        return null;
    };

    const updateShift = async (payload) => {
        if (!payload || !payload.id) return null;
        if (storageMode === "remote") {
            try {
                const data = await apiFetch(payload, "POST");
                if (data && data.shift) {
                    const shift = normalizeShift(data.shift);
                    upsertShift(shift);
                    renderAll();
                    return shift;
                }
            } catch {
                switchToLocal();
            }
        }
        if (storageMode === "local") {
            const id = String(payload.id);
            const index = state.shifts.findIndex((item) => String(item.id) === id);
            if (index < 0) return null;
            const localShift = normalizeShift({
                id,
                name: payload.name ?? "",
                start: payload.start ?? "",
                end: payload.end ?? "",
                commute_before: payload.commute_before ?? 0,
                commute_after: payload.commute_after ?? 0,
                is_default: payload.is_default,
            });
            if (payload.is_default) {
                state.shifts = state.shifts.map((item) => ({ ...item, isDefault: false }));
                localShift.isDefault = true;
            }
            upsertShift(localShift);
            persistLocal();
            renderAll();
            return localShift;
        }
        return null;
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
    const sleepColorInput = sleepForm ? sleepForm.querySelector("#sleep-color") : null;
    let editingSleepId = null;
    let sleepEndManual = false;
    let sleepEndProgrammatic = false;
    let sleepStartManual = false;
    let sleepStartProgrammatic = false;

    const sleepMinutesForRepeat = () => {
        return recommendedSleepMinutes(ageYears);
    };

    const computeRecommendedSleepEnd = (start) => {
        if (!start) return "";
        const duration = sleepMinutesForRepeat();
        const endValue = addMinutes(start, duration);
        const parsed = parseTimeValue(endValue);
        if (!parsed) return "";
        return `${pad2(parsed.hour)}:${pad2(parsed.minute)}`;
    };

    const computeRecommendedSleepStart = (end) => {
        if (!end) return "";
        const duration = sleepMinutesForRepeat();
        const startValue = addMinutes(end, -duration);
        const parsed = parseTimeValue(startValue);
        if (!parsed) return "";
        return `${pad2(parsed.hour)}:${pad2(parsed.minute)}`;
    };

    const setSleepEndValue = (value, options = {}) => {
        if (!sleepEndField) return;
        sleepEndProgrammatic = true;
        setFieldValue(sleepEndField, value, options);
        sleepEndProgrammatic = false;
    };

    const setSleepStartValue = (value, options = {}) => {
        if (!sleepStartField) return;
        sleepStartProgrammatic = true;
        setFieldValue(sleepStartField, value, options);
        sleepStartProgrammatic = false;
    };

    const updateSleepEnd = () => {
        if (!sleepStartInput || !sleepEndField) return;
        const start = normalizeText(sleepStartInput.value);
        const currentEnd = normalizeText(sleepEndInput ? sleepEndInput.value : "");
        if (!start) {
            if (!sleepEndManual && currentEnd) {
                setSleepEndValue("", { emit: false });
            }
            return;
        }
        if (sleepEndManual) return;
        const recommended = computeRecommendedSleepEnd(start);
        if (!recommended) return;
        setSleepEndValue(recommended);
    };

    const updateSleepStart = () => {
        if (!sleepEndInput || !sleepStartField) return;
        const end = normalizeText(sleepEndInput.value);
        const currentStart = normalizeText(sleepStartInput ? sleepStartInput.value : "");
        if (!end) {
            if (!sleepStartManual && currentStart) {
                setSleepStartValue("", { emit: false });
            }
            return;
        }
        if (sleepStartManual) return;
        const recommended = computeRecommendedSleepStart(end);
        if (!recommended) return;
        setSleepStartValue(recommended);
    };

    const startSleepEdit = (rule) => {
        if (!sleepForm || !rule) return;
        editingSleepId = rule.id;
        const nextStart = rule.start || "";
        const nextEnd = rule.end || "";
        sleepStartManual = false;
        sleepEndManual = false;
        if (nextStart && nextEnd) {
            const recommendedEnd = computeRecommendedSleepEnd(nextStart);
            if (recommendedEnd) {
                sleepEndManual = normalizeText(nextEnd) !== normalizeText(recommendedEnd);
            }
            const recommendedStart = computeRecommendedSleepStart(nextEnd);
            if (recommendedStart) {
                sleepStartManual = normalizeText(nextStart) !== normalizeText(recommendedStart);
            }
        }
        if (sleepStartField) {
            setSleepStartValue(nextStart, { emit: false });
        }
        if (sleepEndField) {
            setSleepEndValue(nextEnd, { emit: false });
        }
        if (sleepRepeatSelect) {
            sleepRepeatSelect.value = rule.repeat || "daily";
        }
        if (sleepDaySelect) {
            sleepDaySelect.value = Number.isFinite(rule.day) ? String(rule.day) : "0";
        }
        if (sleepColorInput) {
            const fallback = sleepColorInput.dataset.default || "#b9dbf2";
            sleepColorInput.value = rule.color || fallback;
        }
        applyRepeatToggle(sleepRepeatSelect, sleepForm.querySelector("[data-day-field]"));
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
            const color = normalizeColor(formData.get("color"));
            addRule({
                action: editingSleepId ? "update_rule" : "add",
                id: editingSleepId,
                kind: "sleep",
                start,
                end,
                repeat,
                day,
                color,
            });
            editingSleepId = null;
            sleepForm.reset();
            clearTimeFields(sleepForm);
            sleepStartManual = false;
            sleepEndManual = false;
            const sleepRepeat = sleepForm.querySelector("[data-repeat-select]");
            const sleepDayField = sleepForm.querySelector("[data-day-field]");
            applyRepeatToggle(sleepRepeat, sleepDayField);
        });
    }

    if (sleepStartField) {
        sleepStartField.addEventListener("timechange", () => {
            if (sleepStartProgrammatic) return;
            const value = normalizeText(sleepStartInput ? sleepStartInput.value : "");
            sleepStartManual = Boolean(value);
            updateSleepEnd();
        });
    }
    if (sleepEndField) {
        sleepEndField.addEventListener("timechange", () => {
            if (sleepEndProgrammatic) return;
            const value = normalizeText(sleepEndInput ? sleepEndInput.value : "");
            sleepEndManual = Boolean(value);
            updateSleepStart();
        });
    }
    if (sleepRepeatSelect) {
        sleepRepeatSelect.addEventListener("change", () => {
            updateSleepEnd();
            updateSleepStart();
        });
    }
    if (sleepDaySelect) {
        sleepDaySelect.addEventListener("change", () => {
            updateSleepEnd();
            updateSleepStart();
        });
    }

    const sleepClear = document.querySelector("[data-sleep-clear]");
    if (sleepClear) {
        sleepClear.addEventListener("click", () => {
            if (sleepStartField) setSleepStartValue("", { emit: false });
            if (sleepEndField) setSleepEndValue("", { emit: false });
            clearRules("sleep");
            editingSleepId = null;
            sleepStartManual = false;
            sleepEndManual = false;
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
    const routineTypeRow = routineForm ? routineForm.querySelector("[data-type-row]") : null;
    const routineColorField = routineForm ? routineForm.querySelector("[data-routine-color-field]") : null;
    const routineTitleInput = routineForm ? routineForm.querySelector("#routine-title") : null;
    const routineTitleLabel = routineTitleField ? routineTitleField.querySelector("[data-title-label]") : null;
    const routineTimeRow = routineForm ? routineForm.querySelector("[data-time-row]") : null;
    const routineTimeFieldWrap = routineForm ? routineForm.querySelector("[data-time-field-wrap]") : null;
    const routineStartField = routineForm ? routineForm.querySelector("#routine-time")?.closest("[data-time-field]") : null;
    const routineEndWrap = routineForm ? routineForm.querySelector("[data-work-end-field]") : null;
    const routineEndInput = routineForm ? routineForm.querySelector("#routine-end") : null;
    const routineEndField = routineEndInput ? routineEndInput.closest("[data-time-field]") : null;
    const routineUseField = routineForm ? routineForm.querySelector("[data-routine-use-select]") : null;
    const routineUseSelect = routineForm ? routineForm.querySelector("[data-routine-select]") : null;
    const routineUseButton = routineForm ? routineForm.querySelector("[data-routine-use]") : null;
    const routineShiftSelect = routineForm ? routineForm.querySelector("[data-shift-select]") : null;
    const routineShiftUse = routineForm ? routineForm.querySelector("[data-shift-use]") : null;
    const routineShiftId = routineForm ? routineForm.querySelector("[data-shift-id]") : null;
    const routineCustomButton = routineForm ? routineForm.querySelector("[data-custom-window]") : null;
    const routineAnchorField = routineForm ? routineForm.querySelector("[data-anchor-field]") : null;
    const routineAnchorNote = routineForm ? routineForm.querySelector("[data-anchor-note]") : null;
    const routineColorInput = routineForm ? routineForm.querySelector("#routine-color") : null;
    const routineSubmit = routineForm ? routineForm.querySelector("[data-routine-submit]") : null;
    const routineCancel = routineForm ? routineForm.querySelector("[data-routine-cancel]") : null;
    const shiftTimingRow = routineForm ? routineForm.querySelector("[data-shift-timing-row]") : null;
    const shiftLine = routineForm ? routineForm.querySelector("[data-shift-line]") : null;
    const shiftDefaultLine = routineForm ? routineForm.querySelector("[data-shift-default]") : null;
    const shiftStartInput = routineForm ? routineForm.querySelector("#shift-start") : null;
    const shiftEndInput = routineForm ? routineForm.querySelector("#shift-end") : null;
    const shiftStartField = shiftStartInput ? shiftStartInput.closest("[data-time-field]") : null;
    const shiftEndField = shiftEndInput ? shiftEndInput.closest("[data-time-field]") : null;
    const shiftCommuteBeforeInput = routineForm ? routineForm.querySelector("#shift-commute-before") : null;
    const shiftCommuteAfterInput = routineForm ? routineForm.querySelector("#shift-commute-after") : null;
    const shiftDefaultInput = routineForm ? routineForm.querySelector("#shift-default") : null;
    let editingRoutineId = null;

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

    const placeRoutineTitleField = (isRoutine) => {
        if (!routineTitleField) return;
        if (isRoutine) {
            if (routineUseField) {
                routineUseField.insertAdjacentElement("afterend", routineTitleField);
            }
            return;
        }
        if (routineTypeRow && routineColorField) {
            routineTypeRow.insertBefore(routineTitleField, routineColorField);
        }
    };

    const updateRoutineFormVisibility = () => {
        if (!routineForm) return;
        const type = routineTypeSelect ? routineTypeSelect.value : "routine";
        const isRoutine = type === "routine";
        const isWork = type === "work";
        placeRoutineTitleField(isRoutine);
        if (routineAnchorField) {
            routineAnchorField.style.display = isRoutine ? "grid" : "none";
        }
        if (routineUseField) {
            routineUseField.style.display = isRoutine ? "grid" : "none";
        }
        const anchor = isRoutine && routineAnchorSelect ? routineAnchorSelect.value : "custom";
        const needsCustomTitle = !isRoutine || anchor === "custom";
        if (routineTypeRow) {
            routineTypeRow.classList.toggle("is-custom-anchor", isRoutine && anchor === "custom");
        }
        if (routineTitleField) {
            routineTitleField.style.display = needsCustomTitle ? "grid" : "none";
            const useLeft = !isWork && isRoutine && anchor === "custom";
            routineTitleField.classList.toggle("fieldWide", false);
            routineTitleField.classList.toggle("fieldLeft", useLeft);
        }
        if (routineTitleLabel) {
            routineTitleLabel.textContent = isWork ? "Shift Name (optional)" : "Name";
        }
        if (routineTitleInput) {
            routineTitleInput.placeholder = isWork
                ? "Work"
                : (isRoutine ? "Custom routine" : "e.g. Deep work sprint");
        }
        const showTimeFields = !isWork && (!isRoutine || anchor === "custom");
        const showTimeRow = isWork || showTimeFields || (isRoutine && anchor !== "custom");
        if (routineTimeRow) {
            routineTimeRow.style.display = showTimeRow ? "grid" : "none";
            routineTimeRow.classList.toggle("is-repeat-only", isWork || (isRoutine && anchor !== "custom"));
        }
        if (routineTimeFieldWrap) {
            routineTimeFieldWrap.style.display = showTimeFields ? "grid" : "none";
        }
        if (routineEndWrap) {
            routineEndWrap.style.display = showTimeFields ? "grid" : "none";
        }
        if (routineShiftSelect) {
            routineShiftSelect.closest("[data-work-shift-select]")?.style.setProperty("display", isWork ? "grid" : "none");
        }
        if (shiftTimingRow) {
            shiftTimingRow.classList.toggle("is-work", isWork);
        }
        if (shiftLine) {
            shiftLine.style.display = isWork ? "grid" : "none";
        }
        if (shiftDefaultLine) {
            shiftDefaultLine.style.display = isWork ? "inline-flex" : "none";
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
            routineAnchorNote.style.display = "none";
        }
        renderRoutines();
    };

    const resetRoutineRepeat = () => {
        if (!routineForm) return;
        const routineRepeat = routineForm.querySelector("[data-routine-repeat]");
        const routineDayField = routineForm.querySelector("[data-routine-day-field]");
        if (routineRepeat) routineRepeat.value = "daily";
        applyRepeatToggle(routineRepeat, routineDayField);
        applyRoutineDayDefaults("daily");
    };

    let lastRoutineType = routineTypeSelect ? routineTypeSelect.value : "routine";
    const handleRoutineTypeChange = () => {
        const nextType = routineTypeSelect ? routineTypeSelect.value : "routine";
        if (nextType !== lastRoutineType) {
            resetRoutineRepeat();
            if (routineUseSelect) routineUseSelect.value = "";
        }
        lastRoutineType = nextType;
        updateRoutineFormVisibility();
    };

    const applyShiftToRoutine = (shiftId, options = {}) => {
        if (!shiftId) return;
        const shift = state.shifts.find((item) => String(item.id) === String(shiftId));
        if (!shift) return;
        const shouldLink = options.link !== false;
        if (routineTypeSelect) {
            routineTypeSelect.value = "work";
        }
        handleRoutineTypeChange();
        if (routineShiftSelect) routineShiftSelect.value = shouldLink ? String(shift.id) : "";
        if (routineShiftId) routineShiftId.value = shouldLink ? String(shift.id) : "";
        if (routineTitleInput && !routineTitleInput.value.trim()) {
            routineTitleInput.value = shift.name || "Work";
        }
        if (shiftStartField) {
            setFieldValue(shiftStartField, shift.start || "", { emit: false });
        }
        if (shiftEndField) {
            setFieldValue(shiftEndField, shift.end || "", { emit: false });
        }
        if (shiftCommuteBeforeInput) {
            shiftCommuteBeforeInput.value = shift.commuteBefore ? String(shift.commuteBefore) : "";
        }
        if (shiftCommuteAfterInput) {
            shiftCommuteAfterInput.value = shift.commuteAfter ? String(shift.commuteAfter) : "";
        }
        if (shiftDefaultInput) {
            shiftDefaultInput.checked = shouldLink ? shift.isDefault : false;
        }
    };

    const applyRoutineTemplate = (routineId) => {
        if (!routineId) return;
        const routine = state.routines.find((item) => String(item.id) === String(routineId));
        if (!routine || routine.type !== "routine") return;
        if (routineTypeSelect) routineTypeSelect.value = "routine";
        if (routineAnchorSelect) routineAnchorSelect.value = routine.anchor || "custom";
        handleRoutineTypeChange();
        if (routineTitleInput) routineTitleInput.value = routine.title || "";
        if (routineColorInput) {
            const fallback = routineColorInput.dataset.default || "#f3c873";
            routineColorInput.value = routine.color || fallback;
        }
        if (routineStartField) {
            setFieldValue(routineStartField, routine.time || "", { emit: false });
        }
        if (routineEndField) {
            setFieldValue(routineEndField, routine.end || "", { emit: false });
        }
        const repeatSelect = routineForm ? routineForm.querySelector("[data-routine-repeat]") : null;
        if (repeatSelect) repeatSelect.value = routine.repeat || "daily";
        const dayInputs = Array.from(routineForm ? routineForm.querySelectorAll("[data-routine-day]") : []);
        dayInputs.forEach((input) => {
            const value = parseInt(input.value, 10);
            input.checked = Array.isArray(routine.days) ? routine.days.includes(value) : value === routine.day;
        });
        applyRepeatToggle(repeatSelect, routineForm ? routineForm.querySelector("[data-routine-day-field]") : null);
        fillRoutineTasks(routine.tasks);
    };

    if (routineTypeSelect) {
        routineTypeSelect.addEventListener("change", handleRoutineTypeChange);
    }
    if (routineAnchorSelect) {
        routineAnchorSelect.addEventListener("change", updateRoutineFormVisibility);
    }
    if (routineCustomButton && routineTypeSelect) {
        routineCustomButton.addEventListener("click", () => {
            routineTypeSelect.value = "custom";
            handleRoutineTypeChange();
        });
    }

    if (routineShiftUse) {
        routineShiftUse.addEventListener("click", () => {
            const shiftId = routineShiftSelect ? routineShiftSelect.value : "";
            if (!shiftId) return;
            applyShiftToRoutine(shiftId, { link: false });
        });
    }

    if (routineUseButton) {
        routineUseButton.addEventListener("click", () => {
            const routineId = routineUseSelect ? routineUseSelect.value : "";
            if (!routineId) return;
            applyRoutineTemplate(routineId);
        });
    }

    // Shift creation happens when saving a work window.

    if (routineCancel) {
        routineCancel.addEventListener("click", () => {
            if (!routineForm) return;
            routineForm.reset();
            clearTimeFields(routineForm);
            const routineRepeat = routineForm.querySelector("[data-routine-repeat]");
            const routineDayField = routineForm.querySelector("[data-routine-day-field]");
            applyRepeatToggle(routineRepeat, routineDayField);
            applyRoutineDayDefaults(routineRepeat ? routineRepeat.value : "daily");
            if (routineShiftId) routineShiftId.value = "";
            if (routineShiftSelect) routineShiftSelect.value = "";
            clearRoutineTasks();
            setRoutineEditState(null);
            updateRoutineFormVisibility();
            if (routineTypeSelect) {
                lastRoutineType = routineTypeSelect.value;
            }
        });
    }

    const clearShiftLink = () => {
        if (routineTypeSelect && routineTypeSelect.value !== "work") return;
        if (editingRoutineId) return;
        if (routineShiftId) routineShiftId.value = "";
        if (routineShiftSelect) routineShiftSelect.value = "";
    };

    if (routineStartField) {
        routineStartField.addEventListener("timechange", () => {
            clearShiftLink();
        });
    }
    if (routineEndField) {
        routineEndField.addEventListener("timechange", () => {
            clearShiftLink();
        });
    }
    if (routineTitleInput) {
        routineTitleInput.addEventListener("input", clearShiftLink);
    }
    if (shiftCommuteBeforeInput) {
        shiftCommuteBeforeInput.addEventListener("input", clearShiftLink);
    }
    if (shiftCommuteAfterInput) {
        shiftCommuteAfterInput.addEventListener("input", clearShiftLink);
    }
    if (shiftStartField) {
        shiftStartField.addEventListener("timechange", clearShiftLink);
    }
    if (shiftEndField) {
        shiftEndField.addEventListener("timechange", clearShiftLink);
    }

    const buildShiftPayload = () => ({
        name: normalizeText(routineTitleInput ? routineTitleInput.value : ""),
        start: normalizeText(shiftStartInput ? shiftStartInput.value : ""),
        end: normalizeText(shiftEndInput ? shiftEndInput.value : ""),
        commuteBefore: shiftCommuteBeforeInput && shiftCommuteBeforeInput.value
            ? parseInt(shiftCommuteBeforeInput.value, 10)
            : 0,
        commuteAfter: shiftCommuteAfterInput && shiftCommuteAfterInput.value
            ? parseInt(shiftCommuteAfterInput.value, 10)
            : 0,
        isDefault: Boolean(shiftDefaultInput && shiftDefaultInput.checked),
    });

    const shiftMatches = (shift, payload) => {
        if (!shift || !payload) return false;
        return normalizeText(shift.name) === normalizeText(payload.name || "")
            && normalizeText(shift.start) === normalizeText(payload.start || "")
            && normalizeText(shift.end) === normalizeText(payload.end || "")
            && (shift.commuteBefore || 0) === (payload.commuteBefore || 0)
            && (shift.commuteAfter || 0) === (payload.commuteAfter || 0);
    };

    const ensureWorkShift = async () => {
        const payload = buildShiftPayload();
        if (!payload.start || !payload.end) return null;
        const selectedId = routineShiftId && routineShiftId.value ? parseInt(routineShiftId.value, 10) : null;
        const selectedShift = selectedId
            ? state.shifts.find((item) => String(item.id) === String(selectedId))
            : null;
        if (selectedShift) {
            const matches = shiftMatches(selectedShift, payload);
            if (matches && payload.isDefault === selectedShift.isDefault) {
                return selectedShift.id;
            }
            const shiftPayload = {
                action: "update_shift",
                id: selectedShift.id,
                name: payload.name || selectedShift.name || "Work",
                start: payload.start,
                end: payload.end,
                commute_before: Number.isFinite(payload.commuteBefore) ? payload.commuteBefore : 0,
                commute_after: Number.isFinite(payload.commuteAfter) ? payload.commuteAfter : 0,
                is_default: payload.isDefault,
            };
            const updated = await updateShift(shiftPayload);
            if (updated) return updated.id;
            return selectedShift.id;
        }
        const existingMatch = state.shifts.find((item) => shiftMatches(item, payload));
        if (existingMatch) {
            if (payload.isDefault && !existingMatch.isDefault) {
                await setDefaultShift(existingMatch.id);
            }
            return existingMatch.id;
        }
        const shiftPayload = {
            action: "add_shift",
            name: payload.name || "Work",
            start: payload.start,
            end: payload.end,
            commute_before: Number.isFinite(payload.commuteBefore) ? payload.commuteBefore : 0,
            commute_after: Number.isFinite(payload.commuteAfter) ? payload.commuteAfter : 0,
            is_default: payload.isDefault,
        };
        const created = await addShift(shiftPayload);
        return created ? created.id : null;
    };

    if (routineForm) {
        routineForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const formData = new FormData(routineForm);
            const type = routineTypeSelect ? routineTypeSelect.value : "routine";
            const anchor = type === "routine" && routineAnchorSelect ? routineAnchorSelect.value : "custom";
            const customTitle = normalizeText(formData.get("title"));
            const title = type === "routine" && anchor !== "custom" ? anchorTitle(anchor) : customTitle;
            const shiftValues = buildShiftPayload();
            const time = type === "work" ? shiftValues.start : normalizeText(formData.get("time"));
            const end = type === "work" ? shiftValues.end : normalizeText(formData.get("end"));
            const repeat = normalizeText(formData.get("repeat")) || "daily";
            const color = normalizeColor(formData.get("color"), routineColorInput ? routineColorInput.dataset.default : "");
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
            const shiftId = type === "work" ? await ensureWorkShift() : null;
            const payload = {
                action: editingRoutineId ? "update_routine" : "add_routine",
                id: editingRoutineId,
                title: title || (type === "work" ? (shiftValues.name || "Work") : ""),
                time: type === "routine" && anchor !== "custom" ? "" : time,
                end: type === "work" ? end : "",
                repeat,
                day: days[0],
                days,
                tasks,
                color,
                block_type: type,
                anchor,
                shift_id: shiftId,
            };
            const saved = await addRoutine(payload);
            if (!saved) return;
            routineForm.reset();
            clearTimeFields(routineForm);
            const routineRepeat = routineForm.querySelector("[data-routine-repeat]");
            const routineDayField = routineForm.querySelector("[data-routine-day-field]");
            applyRepeatToggle(routineRepeat, routineDayField);
            applyRoutineDayDefaults(routineRepeat ? routineRepeat.value : "daily");
            if (routineShiftId) routineShiftId.value = "";
            if (routineShiftSelect) routineShiftSelect.value = "";
            clearRoutineTasks();
            setRoutineEditState(null);
            updateRoutineFormVisibility();
            if (routineTypeSelect) {
                lastRoutineType = routineTypeSelect.value;
            }
        });
    }

    const routineTaskStack = document.querySelector("[data-routine-tasks]");
    const routineAddTask = document.querySelector("[data-routine-add-task]");
    const routineTotal = document.querySelector("[data-routine-total]");
    let draggedTaskRow = null;
    let dragHandleRow = null;

    const buildRoutineTaskRow = (task = {}) => {
        const row = document.createElement("div");
        row.className = "taskRow";
        row.dataset.taskRow = "true";
        row.draggable = false;

        const drag = document.createElement("button");
        drag.type = "button";
        drag.className = "taskDrag";
        drag.dataset.taskDrag = "true";
        drag.textContent = "||";
        drag.setAttribute("aria-label", "Drag to reorder");
        drag.setAttribute("draggable", "false");

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
        if (routineColorInput) {
            const fallback = routineColorInput.dataset.default || "#f3c873";
            routineColorInput.value = routine.color || fallback;
        }
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
        if (routine.shiftId) {
            applyShiftToRoutine(routine.shiftId);
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
        if (routineTypeSelect) {
            lastRoutineType = routineTypeSelect.value;
        }
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
        routineTaskStack.addEventListener("pointerdown", (event) => {
            const handle = event.target.closest("[data-task-drag]");
            if (!handle) return;
            const row = handle.closest("[data-task-row]");
            if (!row) return;
            dragHandleRow = row;
            row.draggable = true;
        });

        routineTaskStack.addEventListener("pointerup", () => {
            if (dragHandleRow) {
                dragHandleRow.draggable = false;
                dragHandleRow = null;
            }
        });

        routineTaskStack.addEventListener("dragstart", (event) => {
            const target = event.target instanceof Element ? event.target : null;
            const row = target ? target.closest("[data-task-row]") : null;
            if (!row || row !== dragHandleRow) {
                event.preventDefault();
                return;
            }
            if (target && target.closest("input, textarea, select")) {
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
            draggedTaskRow.draggable = false;
            draggedTaskRow = null;
            dragHandleRow = null;
            updateRoutineTotal();
        });

        routineTaskStack.addEventListener("dragend", () => {
            if (draggedTaskRow) {
                draggedTaskRow.classList.remove("is-dragging");
                draggedTaskRow.draggable = false;
            }
            draggedTaskRow = null;
            dragHandleRow = null;
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
        const sleepEdit = event.target.closest("[data-sleep-edit]");
        if (sleepEdit) {
            const id = sleepEdit.dataset.sleepEdit;
            const rule = state.sleep.find((item) => item.id === id);
            if (rule) {
                startSleepEdit(rule);
            }
            return;
        }
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
        updateSleepStart();
    };

    init();
})();
