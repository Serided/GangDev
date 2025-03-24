export function setupCanvas() {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    window.canvas = canvas;
    window.ctx = ctx;
    return { canvas, ctx };
}


export function setupUI(sendMessage) {
    const chatButton = document.getElementById("chatButton");
    const chatPanel = document.getElementById("chatPanel");
    const sendButton = document.getElementById("sendButton");
    const chatInput = document.getElementById("chatInput");

    chatButton.addEventListener("click", () => {
        chatPanel.style.right = (chatPanel.style.right === "0vw") ? "-30vw" : "0vw";
    });
    sendButton.addEventListener("click", sendMessage);
    chatInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") sendMessage();
    });
    return chatInput;
}