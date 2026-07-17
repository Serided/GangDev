let enabled = false;
let panel = null;
let selectedEl = null;
let selectedTextNode = null;

const edits = new Map();   // Map<Element, { html: string }>
const clones = new Set();
let watermarkEl = null;
let styleEl = null;

// last pointer location (so selection can grab the exact text node under cursor)
let lastClientX = 0;
let lastClientY = 0;

// shift axis guides
let axisGuides = null; // { v:div, h:div, active:null|"x"|"y"|"c" }

// text highlight overlay boxes (for highlighting the exact thing you're editing)
let textHL = []; // array of divs

// textarea display/raw bookkeeping (prevents “cleanup” from changing page accidentally)
let panelTextRaw = "";
let panelTextShown = "";

function injectStyles(){
    if (styleEl) return;
    styleEl = document.createElement("style");
    styleEl.id = "inspectre-injected-style";
    styleEl.textContent = `
    .inspectre-outline{
      outline: 2px dashed rgba(150, 120, 255, .95) !important;
      outline-offset: 3px !important;
      border-radius: 6px !important;
      box-shadow:
        0 0 0 2px rgba(150,120,255,.20),
        0 10px 34px rgba(0,0,0,.28) !important;
    }

    .inspectre-clone{ cursor: move !important; }

    #inspectre-watermark{
      position: fixed;
      right: 12px;
      bottom: 10px;
      z-index: 2147483647;
      font: 600 11px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      letter-spacing: .08em;
      text-transform: lowercase;
      color: rgba(238,240,255,.55);
      background: rgba(10,10,18,.35);
      border: 1px solid rgba(255,255,255,.12);
      padding: 6px 10px;
      border-radius: 999px;
      backdrop-filter: blur(10px);
      pointer-events: none;
    }

    /* Text-node highlight rectangles (no DOM mutation) */
    .inspectre-text-hl{
      position: fixed;
      z-index: 2147483646;
      pointer-events: none;
      border-radius: 6px;
      outline: 2px dashed rgba(150,120,255,.95);
      outline-offset: 2px;
      box-shadow:
        0 0 0 2px rgba(150,120,255,.18),
        0 10px 34px rgba(0,0,0,.28);
      background: rgba(150,120,255,.06);
    }

    .inspectre-axis-guide{
      position: fixed;
      z-index: 2147483646;
      pointer-events: none;
      background: rgba(238,240,255,0.22);
      box-shadow: 0 0 0 1px rgba(0,0,0,0.10);
      opacity: 0;
      transition: opacity 120ms ease, background 120ms ease;
    }
    .inspectre-axis-guide.on{ opacity: 1; }
    .inspectre-axis-guide.active{
      background: rgba(238,240,255,0.45);
    }
  `;
    document.documentElement.appendChild(styleEl);
}

function removeStyles(){
    styleEl?.remove();
    styleEl = null;
}

function setWatermark(on){
    if (!on){
        watermarkEl?.remove();
        watermarkEl = null;
        return;
    }
    if (watermarkEl) return;
    watermarkEl = document.createElement("div");
    watermarkEl.id = "inspectre-watermark";
    watermarkEl.textContent = "inspectre • edited";
    document.documentElement.appendChild(watermarkEl);
}

function isEditableTarget(el){
    if (!el) return false;
    const tag = el.tagName?.toLowerCase();
    if (!tag) return false;
    if (tag === "html" || tag === "body") return false;
    if (tag === "script" || tag === "style") return false;
    return true;
}

function setMinimized(min){
    if (!panel) return;
    panel.classList.toggle("min", !!min);
    const btn = panel.querySelector("#inspMin");
    if (btn){
        btn.textContent = panel.classList.contains("min") ? "˄" : "×";
        btn.title = panel.classList.contains("min") ? "expand" : "minimize";
    }
}

function makePanel(){
    panel = document.createElement("div");
    panel.id = "inspectre-panel";
    panel.innerHTML = `
    <div class="top">
      <div class="left">
        <div class="name">inspectre</div>
        <div class="pill">demo</div>
      </div>
      <button id="inspMin" class="icon-btn" title="minimize">×</button>
    </div>
    <div class="body">
      <div class="small">Click something on the page to select it.</div>
      <textarea id="inspText" placeholder="Selected text will appear here..."></textarea>
      <div class="row">
        <button id="inspApply" class="action primary">Apply</button>
        <button id="inspClone" class="action">Clone</button>
      </div>
      <div class="row">
        <button id="inspDelete" class="action">Delete Clone</button>
        <button id="inspReset" class="action">Reset</button>
      </div>
      <div class="small" id="inspMeta">No selection</div>
    </div>
  `;
    document.documentElement.appendChild(panel);

    panel.querySelector("#inspMin").addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const goingMin = !panel.classList.contains("min");
        setMinimized(goingMin);

        if (goingMin){
            clearTextHighlight();
            setOutline(null);
            selectedEl = null;
            selectedTextNode = null;
            panelTextRaw = "";
            panelTextShown = "";
        }

        updatePanel();
    });

    panel.querySelector("#inspApply").addEventListener("click", applyEdit);
    panel.querySelector("#inspClone").addEventListener("click", cloneSelected);
    panel.querySelector("#inspDelete").addEventListener("click", deleteSelectionIfInCloneWorld);
    panel.querySelector("#inspReset").addEventListener("click", resetAll);

    panel.querySelector("#inspText").addEventListener("keydown", (e) => {
        if (panel.classList.contains("min")) return;
        if (e.key === "Enter" && !e.shiftKey){
            e.preventDefault();
            applyEdit();
        }
    });
}

function destroyPanel(){
    panel?.remove();
    panel = null;
}

function setOutline(el){
    document.querySelectorAll(".inspectre-outline").forEach(n => n.classList.remove("inspectre-outline"));
    if (el) el.classList.add("inspectre-outline");
}

// ---- text highlight overlay ----

function clearTextHighlight(){
    if (!textHL.length) return;
    for (const d of textHL) d.remove();
    textHL = [];
}

function highlightTextNode(node){
    clearTextHighlight();
    if (!node || node.nodeType !== Node.TEXT_NODE) return;

    const r = document.createRange();
    try{
        r.selectNodeContents(node);
    } catch {
        return;
    }

    const rects = Array.from(r.getClientRects ? r.getClientRects() : []);
    if (!rects.length) return;

    for (const rc of rects){
        if (rc.width < 2 || rc.height < 2) continue;

        const d = document.createElement("div");
        d.className = "inspectre-text-hl";
        d.style.left = `${Math.round(rc.left)}px`;
        d.style.top = `${Math.round(rc.top)}px`;
        d.style.width = `${Math.round(rc.width)}px`;
        d.style.height = `${Math.round(rc.height)}px`;
        document.documentElement.appendChild(d);
        textHL.push(d);
    }
}

// ---- text helpers ----

function caretTextNodeFromPoint(x, y){
    let node = null;
    if (document.caretPositionFromPoint){
        const pos = document.caretPositionFromPoint(x, y);
        if (pos?.offsetNode?.nodeType === Node.TEXT_NODE) node = pos.offsetNode;
    } else if (document.caretRangeFromPoint){
        const range = document.caretRangeFromPoint(x, y);
        if (range?.startContainer?.nodeType === Node.TEXT_NODE) node = range.startContainer;
    }
    return node;
}

function getBestTextNodeForElement(el){
    if (!el) return null;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
        acceptNode(n){
            if (!n.textContent) return NodeFilter.FILTER_SKIP;
            return n.textContent.trim().length ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
        }
    });
    return walker.nextNode();
}

function rememberOriginalHTML(el){
    if (!el || edits.has(el)) return;
    edits.set(el, { html: el.innerHTML });
}

// Clean what we SHOW in the textarea (no page mutation)
function prettyForPanel(raw){
    const s = String(raw ?? "").replace(/\r/g, "");
    const lines = s.split("\n")
        .map(l => l.replace(/\s+/g, " ").trim())
        .filter(l => l.length);

    if (!lines.length) return "";
    if (lines.length === 1) return lines[0];
    return lines.join("\n");
}

function getRawSelectionText(){
    if (selectedTextNode && selectedTextNode.nodeType === Node.TEXT_NODE){
        return selectedTextNode.textContent ?? "";
    }
    if (!selectedEl) return "";
    return (selectedEl.innerText ?? selectedEl.textContent ?? "");
}

function applyTextToSelection(nextText){
    if (!selectedEl) return;
    rememberOriginalHTML(selectedEl);

    let node = selectedTextNode;
    if (!node || node.nodeType !== Node.TEXT_NODE || !selectedEl.contains(node)){
        node = getBestTextNodeForElement(selectedEl);
    }

    if (node && node.nodeType === Node.TEXT_NODE){
        node.textContent = nextText;
        selectedTextNode = node;
        highlightTextNode(selectedTextNode);
        return;
    }

    selectedEl.textContent = nextText;
    clearTextHighlight();
}

// ---- clone helpers ----

function getCloneRootFrom(el){
    if (!el) return null;
    return el.closest?.("[data-inspectre-clone='1']") || null;
}
function isInsideCloneWorld(el){ return !!getCloneRootFrom(el); }

function deleteSelectionIfInCloneWorld(){
    if (!enabled || panel?.classList.contains("min")) return;
    if (!selectedEl) return;
    const root = getCloneRootFrom(selectedEl);
    if (!root) return;

    if (selectedEl === root){
        clones.delete(root);
        root.remove();
    } else {
        selectedEl.remove();
    }

    selectedEl = null;
    selectedTextNode = null;
    panelTextRaw = "";
    panelTextShown = "";
    clearTextHighlight();
    setOutline(null);
    updatePanel();
}

// ---- panel update ----

function updatePanel(){
    if (!panel) return;
    if (panel.classList.contains("min")) return;

    const ta = panel.querySelector("#inspText");
    const meta = panel.querySelector("#inspMeta");

    if (!selectedEl){
        ta.value = "";
        meta.textContent = "No selection";
        panelTextRaw = "";
        panelTextShown = "";
        return;
    }

    panelTextRaw = getRawSelectionText();
    panelTextShown = prettyForPanel(panelTextRaw);

    ta.value = panelTextShown;

    const tag = selectedEl.tagName?.toLowerCase() || "node";
    const id = selectedEl.id ? `#${selectedEl.id}` : "";
    const cls = selectedEl.className
        ? `.${String(selectedEl.className).trim().split(/\s+/).slice(0,2).join(".")}`
        : "";

    const root = getCloneRootFrom(selectedEl);
    const isCloneRoot = (root && selectedEl === root);
    const cloneLabel = root ? (isCloneRoot ? " (clone)" : " (inside clone)") : "";

    const nodeLabel = (selectedTextNode && selectedTextNode.nodeType === Node.TEXT_NODE) ? " [text-node]" : "";

    meta.textContent = `Selected: ${tag}${id}${cls}${cloneLabel}${nodeLabel}`;
}

// ---- selection + nav blocking ----

function shouldIntercept(target){
    if (!enabled || !panel) return false;
    if (panel.classList.contains("min")) return false;
    if (panel.contains(target)) return false;
    return true;
}

function selectFromEvent(e){
    if (!shouldIntercept(e.target)) return false;

    lastClientX = e.clientX;
    lastClientY = e.clientY;

    const el0 = e.target;
    if (!isEditableTarget(el0)) return false;

    selectedEl = el0;

    const node = caretTextNodeFromPoint(e.clientX, e.clientY) || getBestTextNodeForElement(el0);
    selectedTextNode = node;

    if (selectedTextNode && selectedTextNode.nodeType === Node.TEXT_NODE){
        setOutline(null);
        highlightTextNode(selectedTextNode);
    } else {
        clearTextHighlight();
        setOutline(el0);
    }

    updatePanel();
    return true;
}

function onPointerDownCapture(e){
    if (!shouldIntercept(e.target)) return;

    selectFromEvent(e);

    const a = e.target.closest?.("a[href]");
    const btnSubmit = e.target.closest?.("button[type='submit'], input[type='submit']");
    const form = e.target.closest?.("form");
    if (a || btnSubmit || form){
        e.preventDefault();
    }

    const insideClone = !!getCloneRootFrom(e.target);
    if (!insideClone){
        e.stopPropagation();
        e.stopImmediatePropagation();
    }
}

function onClickCapture(e){
    if (!shouldIntercept(e.target)) return;

    const a = e.target.closest?.("a[href]");
    const btnSubmit = e.target.closest?.("button[type='submit'], input[type='submit']");
    const form = e.target.closest?.("form");
    if (a || btnSubmit || form){
        e.preventDefault();
    }

    const insideClone = !!getCloneRootFrom(e.target);
    if (!insideClone){
        e.stopPropagation();
        e.stopImmediatePropagation();
    }
}

function onDblClickCapture(e){
    if (!shouldIntercept(e.target)) return;

    selectFromEvent(e);

    const ta = panel?.querySelector("#inspText");
    if (ta){
        ta.focus();
        ta.select();
    }

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
}

// ---- keyboard shortcuts ----

function isTypingTarget(target){
    const t = target?.tagName?.toLowerCase();
    if (!t) return false;
    if (t === "textarea") return true;
    if (t === "input") return true;
    if (target?.isContentEditable) return true;
    return false;
}

function onKeyDown(e){
    if (!enabled || !panel) return;
    if (panel.classList.contains("min")) return;

    if ((e.ctrlKey || e.metaKey) && (e.key === "d" || e.key === "D")){
        e.preventDefault();
        e.stopPropagation();
        cloneSelected();
        return;
    }

    if (isTypingTarget(e.target)) return;

    if (e.key === "Delete" || e.key === "Backspace"){
        if (!selectedEl) return;
        if (!isInsideCloneWorld(selectedEl)) return;
        e.preventDefault();
        e.stopPropagation();
        deleteSelectionIfInCloneWorld();
    }
}

// ---- actions ----

function applyEdit(){
    if (!enabled || !selectedEl || panel?.classList.contains("min")) return;

    const ta = panel.querySelector("#inspText");

    // If user didn't actually change anything (they're just seeing our cleaned display),
    // apply the raw string so we DON'T mutate the page by "cleaning" whitespace.
    const next = (ta.value === panelTextShown) ? panelTextRaw : ta.value;

    applyTextToSelection(next);
    updatePanel();
}

function cloneSelected(){
    if (!enabled || !selectedEl || panel?.classList.contains("min")) return;

    const clone = selectedEl.cloneNode(true);
    clone.classList.add("inspectre-clone");
    clone.dataset.inspectreClone = "1";

    const r = selectedEl.getBoundingClientRect();
    const OFFSET = 22;

    const left = window.scrollX + r.left + OFFSET;
    const top  = window.scrollY + r.top + OFFSET;

    clone.style.position = "absolute";
    clone.style.left = `${Math.max(0, left)}px`;
    clone.style.top = `${Math.max(0, top)}px`;
    clone.style.width = `${r.width}px`;
    clone.style.height = `${r.height}px`;
    clone.style.margin = "0";
    clone.style.zIndex = "2147483646";

    document.body.appendChild(clone);
    clones.add(clone);

    makeDraggable(clone);

    selectedEl = clone;
    selectedTextNode = getBestTextNodeForElement(clone);

    clearTextHighlight();
    setOutline(clone);
    updatePanel();
}

function resetAll(){
    for (const [el, original] of edits.entries()){
        if (el && el.isConnected && original && typeof original.html === "string"){
            el.innerHTML = original.html;
        }
    }
    edits.clear();

    for (const c of clones){
        if (c && c.isConnected) c.remove();
    }
    clones.clear();

    selectedEl = null;
    selectedTextNode = null;
    panelTextRaw = "";
    panelTextShown = "";
    clearTextHighlight();
    setOutline(null);
    updatePanel();
}

// ---- axis guides ----

function ensureAxisGuides(){
    if (axisGuides) return axisGuides;

    const v = document.createElement("div");
    const h = document.createElement("div");
    v.className = "inspectre-axis-guide";
    h.className = "inspectre-axis-guide";

    v.style.top = "0px";
    v.style.bottom = "0px";
    v.style.width = "1px";

    h.style.left = "0px";
    h.style.right = "0px";
    h.style.height = "1px";

    document.documentElement.appendChild(v);
    document.documentElement.appendChild(h);

    axisGuides = { v, h, active: null };
    return axisGuides;
}

function showAxisGuides(clientX, clientY){
    const g = ensureAxisGuides();
    g.v.style.left = `${Math.round(clientX)}px`;
    g.h.style.top = `${Math.round(clientY)}px`;
    g.v.classList.add("on");
    g.h.classList.add("on");
    setAxisActive(null);
}

function setAxisActive(axis){
    if (!axisGuides) return;
    axisGuides.active = axis;

    if (axis === "c"){
        axisGuides.v.classList.add("active");
        axisGuides.h.classList.add("active");
        return;
    }

    axisGuides.v.classList.toggle("active", axis === "x");
    axisGuides.h.classList.toggle("active", axis === "y");
}

function hideAxisGuides(){
    if (!axisGuides) return;
    axisGuides.v.classList.remove("on", "active");
    axisGuides.h.classList.remove("on", "active");
    axisGuides.active = null;
}

// ---- dragging (kept as-is) ----

function makeDraggable(rootClone){
    let dragging = false;

    let grabOffsetX = 0;
    let grabOffsetY = 0;

    let shiftLockActive = false;
    let lockPageX = 0;
    let lockPageY = 0;

    let currentAxis = null; // "x"|"y"|"c"

    const SWITCH_DEADZONE_PX = 10;
    const CENTER_SNAP_PX = 6;
    const RELEASE_CENTER_PX = 10;

    rootClone.addEventListener("dragstart", (e) => {
        e.preventDefault();
    }, true);

    const onDown = (e) => {
        if (!enabled) return;
        if (panel && panel.contains(e.target)) return;

        const root = e.target.closest?.("[data-inspectre-clone='1']");
        if (!root || root !== rootClone) return;

        const r = rootClone.getBoundingClientRect();
        const pageLeft = window.scrollX + r.left;
        const pageTop  = window.scrollY + r.top;

        grabOffsetX = e.pageX - pageLeft;
        grabOffsetY = e.pageY - pageTop;

        dragging = true;
        shiftLockActive = false;
        currentAxis = null;

        e.preventDefault();
        e.stopPropagation();
    };

    const onMove = (e) => {
        if (!dragging) return;

        let desiredLeft = e.pageX - grabOffsetX;
        let desiredTop  = e.pageY - grabOffsetY;

        if (e.shiftKey && !shiftLockActive){
            shiftLockActive = true;
            lockPageX = e.pageX;
            lockPageY = e.pageY;
            currentAxis = null;
            showAxisGuides(e.clientX, e.clientY);
        }

        if (!e.shiftKey && shiftLockActive){
            shiftLockActive = false;
            currentAxis = null;
            hideAxisGuides();
            setAxisActive(null);
        }

        if (shiftLockActive){
            const lockedLeft = lockPageX - grabOffsetX;
            const lockedTop  = lockPageY - grabOffsetY;

            const distX = Math.abs(desiredLeft - lockedLeft);
            const distY = Math.abs(desiredTop - lockedTop);

            if (currentAxis === "c" && (distX > RELEASE_CENTER_PX || distY > RELEASE_CENTER_PX)){
                currentAxis = null;
            }

            const centerCandidate = (distX <= CENTER_SNAP_PX && distY <= CENTER_SNAP_PX);
            if (centerCandidate){
                const diff = Math.abs(distX - distY);
                if (diff <= 2){
                    currentAxis = "c";
                }
            }

            if (currentAxis !== "c"){
                if (distX + SWITCH_DEADZONE_PX < distY){
                    currentAxis = "x";
                } else if (distY + SWITCH_DEADZONE_PX < distX){
                    currentAxis = "y";
                } else {
                    if (!currentAxis){
                        currentAxis = (distX <= distY) ? "x" : "y";
                    }
                }
            }

            if (currentAxis === "c"){
                desiredLeft = lockedLeft;
                desiredTop = lockedTop;
                setAxisActive("c");
            } else if (currentAxis === "x"){
                desiredLeft = lockedLeft;
                setAxisActive("x");
            } else {
                desiredTop = lockedTop;
                setAxisActive("y");
            }
        }

        rootClone.style.left = `${desiredLeft}px`;
        rootClone.style.top  = `${desiredTop}px`;
    };

    const onUp = () => {
        dragging = false;
        if (shiftLockActive){
            shiftLockActive = false;
            currentAxis = null;
            hideAxisGuides();
            setAxisActive(null);
        }
    };

    rootClone.addEventListener("mousedown", onDown, true);
    window.addEventListener("mousemove", onMove, true);
    window.addEventListener("mouseup", onUp, true);
}

// ---- toggle ----

function toggle(on){
    enabled = !!on;

    if (enabled){
        injectStyles();
        if (!panel) makePanel();
        setMinimized(false);
        setWatermark(true);

        window.addEventListener("pointerdown", onPointerDownCapture, true);
        window.addEventListener("click", onClickCapture, true);
        window.addEventListener("dblclick", onDblClickCapture, true);

        document.addEventListener("keydown", onKeyDown, true);

        updatePanel();
    } else {
        window.removeEventListener("pointerdown", onPointerDownCapture, true);
        window.removeEventListener("click", onClickCapture, true);
        window.removeEventListener("dblclick", onDblClickCapture, true);

        document.removeEventListener("keydown", onKeyDown, true);

        hideAxisGuides();
        clearTextHighlight();

        setOutline(null);
        selectedEl = null;
        selectedTextNode = null;

        panelTextRaw = "";
        panelTextShown = "";

        destroyPanel();
        setWatermark(false);
        removeStyles();
    }
}

chrome.runtime.onMessage.addListener((msg) => {
    if (msg?.type === "INSPECTRE_TOGGLE") toggle(!!msg.enabled);
});

async function init(){
    try{
        const res = await chrome.runtime.sendMessage({ type: "GET_ENABLED_GLOBAL" });
        toggle(!!res?.enabled);
    } catch {
        toggle(false);
    }
}

init();
