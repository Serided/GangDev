(function () {
    const body = document.body;
    const rawKey = body && body.dataset && body.dataset.userKey ? body.dataset.userKey : "local";
    const userKey = rawKey.trim() || "local";
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
        blocks: [],
    };

    const listEls = {
        tasks: document.querySelector('[data-list="tasks"]'),
        notes: document.querySelector('[data-list="notes"]'),
        blocks: document.querySelector('[data-list="blocks"]'),
    };

    const makeId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

    const persistLocal = () => {
        saveItems("tasks", state.tasks);
        saveItems("notes", state.notes);
        saveItems("blocks", state.blocks);
    };

    const renderList = (name, list) => {
        const el = listEls[name];
        if (!el) return;
        el.innerHTML = "";
        list.forEach((item) => {
            if (name === "tasks") {
                addTask(el, item);
            } else if (name === "notes") {
                addNote(el, item);
            } else {
                addBlock(el, item);
            }
        });
    };

    const renderAll = () => {
        renderList("tasks", state.tasks);
        renderList("notes", state.notes);
        renderList("blocks", state.blocks);
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
        state.blocks = loadItems("blocks");
        renderAll();
    };

    const switchToLocal = () => {
        storageMode = "local";
        persistLocal();
    };

    const loadRemote = async () => {
        const data = await apiFetch({ action: "load" }, "GET");
        state.tasks = Array.isArray(data.tasks) ? data.tasks : [];
        state.notes = Array.isArray(data.notes) ? data.notes : [];
        state.blocks = Array.isArray(data.blocks) ? data.blocks : [];
        renderAll();
    };

    const init = async () => {
        try {
            await loadRemote();
        } catch {
            storageMode = "local";
            loadLocal();
        }
    };

    const buildText = (text, time) => {
        const wrap = document.createElement("div");
        wrap.className = "itemText";

        if (time) {
            const t = document.createElement("span");
            t.className = "itemTime";
            t.textContent = time;
            wrap.appendChild(t);
        }

        const s = document.createElement("span");
        s.textContent = text;
        wrap.appendChild(s);
        return wrap;
    };

    const buildRemove = () => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "removeBtn";
        btn.setAttribute("data-remove", "1");
        btn.textContent = "remove";
        return btn;
    };

    const addTask = (list, item) => {
        const li = document.createElement("li");
        li.className = "item";
        li.dataset.itemId = item.id;
        li.dataset.list = "tasks";

        const label = document.createElement("label");
        label.className = "check";

        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.checked = Boolean(item.done);
        cb.setAttribute("data-task-check", "1");

        const s = document.createElement("span");
        s.textContent = item.text;

        label.appendChild(cb);
        label.appendChild(s);
        li.appendChild(label);
        li.appendChild(buildRemove());
        li.classList.toggle("is-done", cb.checked);
        list.appendChild(li);
    };

    const addNote = (list, item) => {
        const li = document.createElement("li");
        li.className = "item";
        li.dataset.itemId = item.id;
        li.dataset.list = "notes";
        li.appendChild(buildText(item.text, ""));
        li.appendChild(buildRemove());
        list.appendChild(li);
    };

    const addBlock = (list, item) => {
        const li = document.createElement("li");
        li.className = "item";
        li.dataset.itemId = item.id;
        li.dataset.list = "blocks";
        li.appendChild(buildText(item.text, item.time || ""));
        li.appendChild(buildRemove());
        list.appendChild(li);
    };

    const todayString = () => {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, "0");
        const d = String(now.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    };

    init();

    document.addEventListener("submit", async (e) => {
        const form = e.target.closest("[data-add-target]");
        if (!form) return;

        e.preventDefault();
        const target = form.getAttribute("data-add-target");
        const list = document.querySelector(`[data-list="${target}"]`);
        const textInput = form.querySelector("[data-input]");
        const timeInput = form.querySelector("[data-time]");

        if (!list || !textInput) return;
        const text = textInput.value.trim();
        if (text === "") return;

        const time = timeInput ? timeInput.value.trim() : "";

        if (storageMode === "remote") {
            try {
                const payload = {
                    action: "add",
                    type: target,
                    text,
                };
                if (target === "blocks") {
                    payload.time = time;
                    payload.date = todayString();
                }
                const data = await apiFetch(payload, "POST");
                const item = data.item;
                if (!item || !item.id) throw new Error("bad item");
                if (target === "tasks") state.tasks.push(item);
                if (target === "notes") state.notes.push(item);
                if (target === "blocks") state.blocks.push(item);
                renderList(target, state[target]);
            } catch {
                switchToLocal();
            }
        }

        if (storageMode === "local") {
            const id = makeId();
            if (target === "tasks") {
                const item = { id, text, done: false };
                state.tasks.push(item);
                addTask(list, item);
            } else if (target === "notes") {
                const item = { id, text };
                state.notes.push(item);
                addNote(list, item);
            } else {
                const item = { id, text, time };
                state.blocks.push(item);
                addBlock(list, item);
            }
            persistLocal();
        }

        textInput.value = "";
        if (timeInput) timeInput.value = "";
        textInput.focus();
    });

    document.addEventListener("click", async (e) => {
        const btn = e.target.closest("[data-remove]");
        if (!btn) return;
        const item = btn.closest("li");
        if (!item) return;
        const listName = item.dataset.list;
        const itemId = item.dataset.itemId;
        if (!listName || !itemId) return;

        if (storageMode === "remote") {
            try {
                await apiFetch({ action: "delete", type: listName, id: itemId }, "POST");
            } catch {
                switchToLocal();
            }
        }

        state[listName] = state[listName].filter((entry) => entry.id !== itemId);
        item.remove();
        if (storageMode === "local") persistLocal();
    });

    document.addEventListener("change", async (e) => {
        const cb = e.target.closest("[data-task-check]");
        if (!cb) return;
        const item = cb.closest("li");
        if (!item) return;
        const itemId = item.dataset.itemId;
        const entry = state.tasks.find((task) => task.id === itemId);
        if (!entry) return;
        entry.done = cb.checked;
        item.classList.toggle("is-done", cb.checked);

        if (storageMode === "remote") {
            try {
                await apiFetch({ action: "toggle", type: "tasks", id: itemId, done: entry.done }, "POST");
            } catch {
                switchToLocal();
            }
        }

        if (storageMode === "local") persistLocal();
    });

    const calendarRoot = document.querySelector(".calendarShell");
    if (calendarRoot) {
        const monthTitle = calendarRoot.querySelector("[data-month-title]");
        const monthGrid = calendarRoot.querySelector("[data-month-grid]");
        const dayTitle = calendarRoot.querySelector("[data-day-title]");
        const daySub = calendarRoot.querySelector("[data-day-sub]");
        const dayShort = calendarRoot.querySelector("[data-day-short]");
        const dayGrid = calendarRoot.querySelector("[data-day-grid]");

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

        const pad = (num) => String(num).padStart(2, "0");
        const dateKey = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
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

        const renderDayHeader = () => {
            if (!dayTitle || !daySub || !dayShort) return;
            const optsLong = { weekday: "long", month: "long", day: "numeric" };
            dayTitle.textContent = stateCal.selected.toLocaleDateString("en-US", optsLong);
            const week = getISOWeek(stateCal.selected);
            daySub.textContent = `Week ${week} • ${stateCal.selected.getFullYear()}`;
            dayShort.textContent = stateCal.selected.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        };

        const renderDayGrid = (autoScroll) => {
            if (!dayGrid) return;
            dayGrid.innerHTML = "";
            for (let hour = 0; hour < 24; hour += 1) {
                const row = document.createElement("div");
                row.className = "timeRow";
                const label = document.createElement("div");
                label.textContent = `${pad(hour)}:00`;
                const slot = document.createElement("div");
                slot.className = "timeSlot";
                row.appendChild(label);
                row.appendChild(slot);
                dayGrid.appendChild(row);
            }

            if (isSameDay(stateCal.selected, new Date())) {
                const marker = document.createElement("div");
                marker.className = "timeMarker";
                const hourHeight = parseFloat(getComputedStyle(dayGrid).getPropertyValue("--hour-height")) || 42;
                const liveNow = new Date();
                const minutes = liveNow.getHours() * 60 + liveNow.getMinutes();
                const top = (minutes / 60) * hourHeight;
                marker.style.top = `${top}px`;
                dayGrid.appendChild(marker);
                if (autoScroll) {
                    dayGrid.scrollTop = Math.max(0, top - dayGrid.clientHeight * 0.4);
                }
            }
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
                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = "monthCell";
                btn.textContent = String(dayNum);
                btn.dataset.date = dateKey(cellDate);

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

        const syncCalendar = () => {
            renderDayHeader();
            renderDayGrid(true);
            renderMonth();
        };

        calendarRoot.addEventListener("click", (event) => {
            const nav = event.target.closest("[data-month-nav]");
            if (nav) {
                const dir = nav.getAttribute("data-month-nav");
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
                syncCalendar();
                return;
            }

            const cell = event.target.closest(".monthCell");
            if (!cell || !cell.dataset.date) return;
            const nextDate = parseKey(cell.dataset.date);
            stateCal.selected = nextDate;
            stateCal.viewYear = nextDate.getFullYear();
            stateCal.viewMonth = nextDate.getMonth();
            syncCalendar();
        });

        syncCalendar();
        setInterval(() => {
            if (isSameDay(stateCal.selected, new Date())) {
                renderDayGrid(false);
            }
        }, 60000);
    }
})();
