async function getActiveTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
}

function hostFromUrl(url) {
    try { return new URL(url).hostname; } catch { return ""; }
}

async function getEnabled(){
    const res = await chrome.runtime.sendMessage({ type: "GET_ENABLED_GLOBAL" });
    return !!res?.enabled;
}

async function setEnabled(enabled){
    return await chrome.runtime.sendMessage({ type: "SET_ENABLED_GLOBAL", enabled: !!enabled });
}

async function pingContent(tabId, enabled){
    try {
        await chrome.tabs.sendMessage(tabId, { type: "INSPECTRE_TOGGLE", enabled });
    } catch (e) {
        // If the content script isn't available yet, inject it (rare but happens)
        try {
            await chrome.scripting.insertCSS({ target: { tabId }, files: ["content.css"] });
            await chrome.scripting.executeScript({ target: { tabId }, files: ["content.js"] });
            await chrome.tabs.sendMessage(tabId, { type: "INSPECTRE_TOGGLE", enabled });
        } catch (_) {}
    }
}

async function refresh() {
    const tab = await getActiveTab();
    const host = hostFromUrl(tab?.url || "");
    const tabId = tab?.id;

    const btn = document.getElementById("toggle");
    const hint = document.getElementById("hint");

    const enabled = await getEnabled();
    btn.textContent = enabled ? "Disable" : "Enable";
    hint.textContent = `Ready on: ${host || "(unknown)"}`;
}

document.getElementById("toggle").addEventListener("click", async () => {
    const tab = await getActiveTab();
    if (!tab?.id) return;

    const enabled = await getEnabled();
    const next = !enabled;

    await setEnabled(next);
    await pingContent(tab.id, next);

    refresh();
});

refresh();
