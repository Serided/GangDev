export const chatButton = document.getElementById("chatButton");
export const chatPanel = document.getElementById("chatPanel");

chatButton.addEventListener("click", (event) => {
    if (chatPanel.style.right === "0vw") {
        chatPanel.style.right = "-30vw";
    } else {
        chatPanel.style.right = "0vw";
    }
});

window.addEventListener("resize", (event) => {
    const gameCanvas = document.getElementById("gameCanvas");
    gameCanvas.width = window.innerWidth;
    gameCanvas.height = window.innerHeight;
});