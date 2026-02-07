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
        tasks: loadItems("tasks"),
        notes: loadItems("notes"),
        blocks: loadItems("blocks"),
    };

    const listEls = {
        tasks: document.querySelector('[data-list="tasks"]'),
        notes: document.querySelector('[data-list="notes"]'),
        blocks: document.querySelector('[data-list="blocks"]'),
    };

    const makeId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

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

    renderList("tasks", state.tasks);
    renderList("notes", state.notes);
    renderList("blocks", state.blocks);

    document.addEventListener("submit", (e) => {
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
        const id = makeId();

        if (target === "tasks") {
            const item = { id, text, done: false };
            state.tasks.push(item);
            saveItems("tasks", state.tasks);
            addTask(list, item);
        } else if (target === "notes") {
            const item = { id, text };
            state.notes.push(item);
            saveItems("notes", state.notes);
            addNote(list, item);
        } else {
            const item = { id, text, time };
            state.blocks.push(item);
            saveItems("blocks", state.blocks);
            addBlock(list, item);
        }

        textInput.value = "";
        if (timeInput) timeInput.value = "";
        textInput.focus();
    });

    document.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-remove]");
        if (!btn) return;
        const item = btn.closest("li");
        if (!item) return;
        const listName = item.dataset.list;
        const itemId = item.dataset.itemId;
        if (listName && itemId && state[listName]) {
            state[listName] = state[listName].filter((entry) => entry.id !== itemId);
            saveItems(listName, state[listName]);
        }
        item.remove();
    });

    document.addEventListener("change", (e) => {
        const cb = e.target.closest("[data-task-check]");
        if (!cb) return;
        const item = cb.closest("li");
        if (!item) return;
        const itemId = item.dataset.itemId;
        const entry = state.tasks.find((task) => task.id === itemId);
        if (!entry) return;
        entry.done = cb.checked;
        saveItems("tasks", state.tasks);
        item.classList.toggle("is-done", cb.checked);
    });
})();
