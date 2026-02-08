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

    const state = {
        tasks: [],
        notes: [],
        windows: [],
        rules: [],
    };

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
        text: normalizeText(item.text ?? item.body ?? item.title ?? ""),
    });

    const normalizeWindow = (item) => ({
        id: String(item.id ?? makeId()),
        text: normalizeText(item.text ?? item.title ?? ""),
        date: normalizeText(item.date ?? ""),
        start: normalizeText(item.start ?? item.time ?? ""),
        end: normalizeText(item.end ?? item.end_time ?? ""),
        kind: item.kind === "event" ? "event" : "window",
        color: normalizeText(item.color ?? ""),
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

    const persistLocal = () => {
        saveItems("tasks", state.tasks);
        saveItems("notes", state.notes);
        saveItems("windows", state.windows);
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
        state.tasks = loadItems("tasks").map(normalizeTask);
        state.notes = loadItems("notes").map(normalizeNote);
        state.windows = loadItems("windows").map(normalizeWindow);
        state.rules = loadItems("rules").map(normalizeRule);
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
    };

    const init = async () => {
        try {
            await loadRemote();
        } catch {
            storageMode = "local";
            loadLocal();
        }
        refreshTimeSelects();
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
        hours = hours % 12;
        if (hours === 0) hours = 12;
        return `${hours}:${String(mins).padStart(2, "0")}`;
    };

    const formatHour = (hour) => formatTime(`${String(hour).padStart(2, "0")}:00`);

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
        refreshTimeSelects();
    };

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
                const rule = pickSleepRule(stateCal.selected);
                if (rule && rule.start && rule.end) {
                    const range = `${formatTime(rule.start)}-${formatTime(rule.end)}`;
                    daySchedule.textContent = `Sleep ${range} - ${formatRepeat(rule)}`;
                    daySchedule.classList.remove("is-empty");
                } else {
                    daySchedule.textContent = "";
                    daySchedule.classList.add("is-empty");
                }
            }
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

            const windows = state.windows
                .filter((item) => item.date === dateKey(stateCal.selected));
            const birthdayEvent = birthdayEventFor(stateCal.selected);
            if (birthdayEvent) {
                windows.push(birthdayEvent);
            }
            windows.sort((a, b) => (parseMinutes(a.start) ?? 0) - (parseMinutes(b.start) ?? 0));

            const windowsByHour = {};
            const blockWindows = [];

            windows.forEach((window) => {
                const minutes = parseMinutes(window.start);
                if (minutes === null) return;
                const endMinutes = parseMinutes(window.end);
                const isAllDay = window.kind === "event" && window.start === "00:00" && window.end === "23:59";
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

            const blockSegments = [];
            blockWindows.forEach((window) => {
                const segments = [];
                if (window.isAllDay) {
                    segments.push({ start: dayStart * 60, end: dayStart * 60 + 60, allDay: true });
                } else if (window.endMinutes <= window.startMinutes) {
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
                        allDay: !!segment.allDay,
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
            const slotLeft = parseFloat(getComputedStyle(dayGrid).getPropertyValue("--timeline-slot-left"));
            const slotRight = parseFloat(getComputedStyle(dayGrid).getPropertyValue("--timeline-slot-right"));
            const blockGap = parseFloat(getComputedStyle(dayGrid).getPropertyValue("--timeline-block-gap"));
            const blockInset = parseFloat(getComputedStyle(dayGrid).getPropertyValue("--timeline-block-inset"));
            const safeInset = Number.isFinite(blockInset) ? blockInset : 0;
            const leftBase = (Number.isFinite(slotLeft) ? slotLeft : (labelWidth + 12)) + safeInset;
            const rightBase = (Number.isFinite(slotRight) ? slotRight : 16) + safeInset;
            const columnGap = Number.isFinite(blockGap) ? blockGap : 8;
            const usableWidth = Math.max(0, dayGrid.clientWidth - leftBase - rightBase);

            layoutSegments(blockSegments).forEach((segment) => {
                const { window } = segment;
                const block = document.createElement("div");
                block.className = `slotBlock${window.kind === "event" ? " is-event" : ""}${segment.allDay ? " is-all-day" : ""}`;

                const tint = colorToRgba(window.color || "#f3c873", window.kind === "event" ? 0.2 : 0.25);
                block.style.borderColor = window.color || "#f3c873";
                if (tint) block.style.background = tint;

                const top = segment.allDay ? 6 : ((segment.start - dayStart * 60) / 60) * hourHeight;
                const height = segment.allDay
                    ? Math.max(26, hourHeight * 0.75)
                    : ((segment.end - segment.start) / 60) * hourHeight;
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
                time.textContent = segment.allDay ? "All day" : (endText ? `${startText}-${endText}` : startText);

                const title = document.createElement("span");
                title.className = "blockText";
                title.textContent = window.text;

                const remove = document.createElement("button");
                remove.type = "button";
                remove.className = "blockRemove";
                remove.dataset.removeId = window.id;
                remove.dataset.removeType = "windows";
                remove.textContent = "x";

                block.appendChild(time);
                block.appendChild(title);
                block.appendChild(remove);
                dayGrid.appendChild(block);
            });

            const sleepRule = pickSleepRule(stateCal.selected);
            if (sleepRule && sleepRule.start && sleepRule.end) {
                const startMinutes = parseMinutes(sleepRule.start);
                const endMinutes = parseMinutes(sleepRule.end);
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
                core.textContent = "Create base schedule";
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
                text.textContent = note.text;

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

                const tasks = document.createElement("div");
                tasks.className = "monthTasks";
                const dayItems = [...(tasksByDate[key] || []), ...(eventsByDate[key] || [])];
                if (dayItems.length > 0) {
                    btn.classList.add("has-items");
                }
                dayItems.slice(0, 2).forEach((task) => {
                    const pill = document.createElement("div");
                    const eventClass = task.isEvent ? " is-event" : "";
                    pill.className = `monthPill${task.done ? " is-done" : ""}${eventClass}`;
                    pill.textContent = task.text;
                    tasks.appendChild(pill);
                });
                if (dayItems.length > 2) {
                    const more = document.createElement("div");
                    more.className = "monthMore";
                    more.textContent = `+${dayItems.length - 2} more`;
                    tasks.appendChild(more);
                }

                btn.appendChild(number);
                btn.appendChild(tasks);

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

        const renderAll = (autoScroll) => {
            renderDayHeader();
            renderDayGrid(autoScroll);
            renderTaskRail();
            renderNoteRail();
            renderMonth();
        };

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
                return;
            }

            const cell = event.target.closest(".monthCell");
            if (!cell || !cell.dataset.date) return;
            const nextDate = parseKey(cell.dataset.date);
            stateCal.selected = nextDate;
            stateCal.viewYear = nextDate.getFullYear();
            stateCal.viewMonth = nextDate.getMonth();
            renderAll(true);
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

    const overlay = document.querySelector("[data-create-overlay]");
    const createForm = overlay ? overlay.querySelector("[data-create-form]") : null;
    const createKind = overlay ? overlay.querySelector("[data-create-kind]") : null;
    const createTitle = overlay ? overlay.querySelector("#create-title") : null;
    const createNote = overlay ? overlay.querySelector("#create-note") : null;
    const createTime = overlay ? overlay.querySelector("#create-time") : null;
    const createEnd = overlay ? overlay.querySelector("#create-end-time") : null;
    const createDuration = overlay ? overlay.querySelector("#create-duration") : null;
    const createColor = overlay ? overlay.querySelector("#create-color") : null;
    const createAllDay = overlay ? overlay.querySelector("#create-all-day") : null;
    const createEventTime = overlay ? overlay.querySelectorAll("[data-event-time]") : [];
    const createDateLabel = overlay ? overlay.querySelector("[data-create-date]") : null;
    const createDateInput = overlay ? overlay.querySelector("[data-create-date-input]") : null;

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
        updateEventTimeVisibility();
    };

    const openCreate = (kind) => {
        if (!overlay) return;
        const selectedKey = calendarApi ? calendarApi.getSelectedKey() : dateKey(new Date());
        if (createDateLabel) {
            const date = parseKey(selectedKey);
            createDateLabel.textContent = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        }
        if (createDateInput) {
            createDateInput.value = selectedKey;
        }
        if (createTitle) createTitle.value = "";
        if (createNote) createNote.value = "";
        if (createTime) createTime.value = "";
        if (createEnd) createEnd.value = "";
        if (createDuration) createDuration.value = "";
        if (createColor && createColor.dataset && createColor.dataset.default) {
            createColor.value = createColor.dataset.default;
        }
        if (createAllDay) createAllDay.checked = false;
        const safeKind = ["task", "note", "window"].includes(kind) ? kind : "task";
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

        const closeBtn = event.target.closest("[data-create-close]");
        if (closeBtn) {
            closeCreate();
            return;
        }

        if (overlay && event.target === overlay) {
            closeCreate();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeCreate();
        }
    });

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

    if (createForm) {
        createForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const kind = createKind ? createKind.value : "task";
            const title = normalizeText(createTitle ? createTitle.value : "");
            const noteBody = normalizeText(createNote ? createNote.value : "");
            if (kind === "note" && !noteBody && !title) return;
            if (kind !== "note" && !title) return;
            const date = createDateInput ? createDateInput.value : "";
            const startRaw = normalizeText(createTime ? createTime.value : "");
            const endRaw = normalizeText(createEnd ? createEnd.value : "");
            const durationRaw = normalizeText(createDuration ? createDuration.value : "");
            const color = normalizeText(createColor ? createColor.value : "");
            const allDay = Boolean(createAllDay && createAllDay.checked);
            const start = kind === "event" && allDay ? "00:00" : startRaw;
            const end = kind === "event" && allDay ? "23:59" : endRaw;

            const typeMap = { task: "tasks", note: "notes", window: "windows", event: "windows" };
            const type = typeMap[kind] || "tasks";
            const payload = {
                action: "add",
                type,
                text: kind === "note" ? (noteBody || title) : title,
            };
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
                    state.notes.push({ id, text: noteBody || title });
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
