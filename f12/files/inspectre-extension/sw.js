const KEY = "inspectre_enabled_global";

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    (async () => {
        if (msg?.type === "SET_ENABLED_GLOBAL") {
            await chrome.storage.local.set({ [KEY]: !!msg.enabled });
            sendResponse({ ok: true });
            return;
        }

        if (msg?.type === "GET_ENABLED_GLOBAL") {
            const data = await chrome.storage.local.get([KEY]);
            sendResponse({ enabled: !!data[KEY] });
            return;
        }

        sendResponse({ ok: false });
    })();

    return true;
});
