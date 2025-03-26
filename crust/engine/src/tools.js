export function sendData(activeSocket, type, data, userId, username, displayName) {
    if (activeSocket && activeSocket.readyState === WebSocket.OPEN) {
        let payload = (typeof data === "string" || data instanceof String) ? { text: data } : data;
        const enrichedData = { ...payload, user: { userId, username, displayName } };
        const message = JSON.stringify({ type, data: enrichedData });
        const blob = new Blob([message], { type: "application/json" });
        activeSocket.send(blob);
    } else {
        console.warn("Cannot send data. WebSocket closed.");
    }
}