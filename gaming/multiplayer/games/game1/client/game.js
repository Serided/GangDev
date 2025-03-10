const ws = new WebSocket("wss://gaming.gangdev.co/game1");  // Connect to Game1 server

ws.onopen = () => {
    console.log("✅ Connected to Game1 WebSocket server!");
    ws.send("Hello from the client!");
    updateStatus("Connected ✅");
};

ws.onmessage = (event) => {
    console.log("📩 Message from server:", event.data);
    appendMessage(event.data);
};

ws.onerror = (error) => {
    console.error("❌ WebSocket error:", error);
    updateStatus("Error ❌");
};

ws.onclose = () => {
    console.log("🔌 Disconnected from Game1 WebSocket server.");
    updateStatus("Disconnected 🔌");
};

// Helper function to update connection status in the UI
function updateStatus(status) {
    const statusEl = document.getElementById("status");
    if (statusEl) statusEl.innerText = status;
}

// Helper function to append messages to a chatbox (for debugging)
function appendMessage(message) {
    const messagesEl = document.getElementById("messages");
    if (messagesEl) {
        const msg = document.createElement("p");
        msg.textContent = message;
        messagesEl.appendChild(msg);
    }
}
