(function () {
    const body = document.body;
    const rawKey = body && body.dataset && body.dataset.userKey ? body.dataset.userKey : "local";
    const userKey = String(rawKey || "local").trim() || "local";
    const keyFor = (name) => `candor_do_${userKey}_${name}`;

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
    };

    const makeId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

    const normalizeText = (value) => String(value ?? "").trim();

    const normalizeTask = (item) => ({
        id: String(item.id ?? makeId()),
        text: normalizeText(item.text ?? item.title ?? ""),
        done: Boolean(item.done ?? item.completed ?? false),
        date: normalizeText(item.date ?? item.due_date ?? ""),
        time: normalizeText(item.time ?? item.due_time ?? ""),
    });

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
    });

    const persistLocal = () => {
        saveItems("tasks", state.tasks);
        saveItems("notes", state.notes);
        saveItems("windows", state.windows);
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
        state.tasks = loadItems("tasks");
        state.notes = loadItems("notes");
        state.windows = loadItems("windows");
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
    };

    const init = async () => {
        try {
            await loadRemote();
        } catch {
            storageMode = "local";
            loadLocal();
        }
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

    const getCookie = (name) => {
        const match = document.cookie.split("; ").find((row) => row.startsWith(`${name}=`));
        return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : "";
    };

    let clockMode = getCookie("candor_time_format") === "12" ? "12" : "24";

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
        const suffix = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        if (hours === 0) hours = 12;
        return `${hours}:${String(mins).padStart(2, "0")} ${suffix}`;
    };

    const formatHour = (hour) => formatTime(`${String(hour).padStart(2, "0")}:00`);

    const setClockMode = (value) => {
        clockMode = value === "12" ? "12" : "24";
        document.cookie = `candor_time_format=${clockMode}; path=/; domain=.candor.you; max-age=31536000`;
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
        };

        const renderDayGrid = (autoScroll) => {
            if (!dayGrid) return;
            const dayStart = 5;
            const dayEnd = 24;
            dayGrid.innerHTML = "";
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
                .filter((item) => item.date === dateKey(stateCal.selected))
                .sort((a, b) => (parseMinutes(a.start) ?? 0) - (parseMinutes(b.start) ?? 0));

            const windowsByHour = windows.reduce((acc, window) => {
                const minutes = parseMinutes(window.start);
                if (minutes === null) return acc;
                const hour = Math.floor(minutes / 60);
                if (!acc[hour]) acc[hour] = [];
                acc[hour].push(window);
                return acc;
            }, {});

            rows.forEach(({ hour, slot }) => {
                const list = windowsByHour[hour] || [];
                if (list.length > 1) {
                    slot.classList.add("is-multi");
                }
                list.forEach((window) => {
                    const chip = document.createElement("div");
                    chip.className = "slotChip";
                    chip.dataset.windowId = window.id;

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

            if (isSameDay(stateCal.selected, new Date())) {
                const marker = document.createElement("div");
                marker.className = "timeMarker";
                const hourHeight = parseFloat(getComputedStyle(dayGrid).getPropertyValue("--hour-height")) || 42;
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
            if (tasks.length === 0) {
                const empty = document.createElement("span");
                empty.className = "railEmpty";
                empty.textContent = "No priority tasks yet.";
                taskRail.appendChild(empty);
                return;
            }

            tasks.forEach((task) => {
                const chip = document.createElement("div");
                chip.className = `chip taskChip${task.done ? " is-done" : ""}`;
                chip.dataset.taskId = task.id;

                const text = document.createElement("span");
                text.className = "chipText";
                text.textContent = task.text;

                if (task.time) {
                    const time = document.createElement("span");
                    time.className = "chipTime";
                    time.textContent = formatTime(task.time);
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
            const startWeekday = (firstOfMonth.getDay() + 6) % 7;
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
                const dayTasks = (tasksByDate[key] || []).slice(0, 2);
                dayTasks.forEach((task) => {
                    const pill = document.createElement("div");
                    pill.className = `monthPill${task.done ? " is-done" : ""}`;
                    pill.textContent = task.text;
                    tasks.appendChild(pill);
                });
                if ((tasksByDate[key] || []).length > 2) {
                    const more = document.createElement("div");
                    more.className = "monthMore";
                    more.textContent = `+${tasksByDate[key].length - 2} more`;
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
    const createDateLabel = overlay ? overlay.querySelector("[data-create-date]") : null;
    const createDateInput = overlay ? overlay.querySelector("[data-create-date-input]") : null;

    const setCreateKind = (kind) => {
        if (!createKind || !overlay) return;
        createKind.value = kind;
        overlay.querySelectorAll("[data-kind]").forEach((field) => {
            const allowed = field.dataset.kind === kind;
            field.style.display = allowed ? "grid" : "none";
        });
        if (createTime) {
            createTime.required = kind === "window";
        }
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

    if (createForm) {
        createForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const kind = createKind ? createKind.value : "task";
            const title = normalizeText(createTitle ? createTitle.value : "");
            const noteBody = normalizeText(createNote ? createNote.value : "");
            if (kind === "note" && !noteBody && !title) return;
            if (kind !== "note" && !title) return;
            const date = createDateInput ? createDateInput.value : "";
            const start = normalizeText(createTime ? createTime.value : "");
            const end = normalizeText(createEnd ? createEnd.value : "");

            const typeMap = { task: "tasks", note: "notes", window: "windows" };
            const type = typeMap[kind] || "tasks";
            const payload = {
                action: "add",
                type,
                text: kind === "note" ? (noteBody || title) : title,
            };
            if (kind === "task") {
                payload.date = date;
            }
            if (kind === "window") {
                payload.date = date;
                payload.time = start;
                if (end) payload.end_time = end;
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
                    state.tasks.push({ id, text: title, done: false, date, time: "" });
                } else if (type === "notes") {
                    state.notes.push({ id, text: noteBody || title });
                } else {
                    state.windows.push({ id, text: title, date, start, end });
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
