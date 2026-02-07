(function () {
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

    const addTask = (list, text) => {
        const li = document.createElement("li");
        li.className = "item";

        const label = document.createElement("label");
        label.className = "check";

        const cb = document.createElement("input");
        cb.type = "checkbox";

        const s = document.createElement("span");
        s.textContent = text;

        label.appendChild(cb);
        label.appendChild(s);
        li.appendChild(label);
        li.appendChild(buildRemove());
        list.appendChild(li);
    };

    const addNote = (list, text) => {
        const li = document.createElement("li");
        li.className = "item";
        li.appendChild(buildText(text, ""));
        li.appendChild(buildRemove());
        list.appendChild(li);
    };

    const addBlock = (list, text, time) => {
        const li = document.createElement("li");
        li.className = "item";
        li.appendChild(buildText(text, time));
        li.appendChild(buildRemove());
        list.appendChild(li);
    };

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

        if (target === "tasks") {
            addTask(list, text);
        } else if (target === "notes") {
            addNote(list, text);
        } else {
            addBlock(list, text, time);
        }

        textInput.value = "";
        if (timeInput) timeInput.value = "";
        textInput.focus();
    });

    document.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-remove]");
        if (!btn) return;
        const item = btn.closest("li");
        if (item) item.remove();
    });
})();
