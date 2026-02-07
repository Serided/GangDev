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
})();
