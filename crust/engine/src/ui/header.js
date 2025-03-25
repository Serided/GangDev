export function updateStatus(status) {
    const statusElement = document.getElementById("status");
    statusElement.style.color = status ? "green" : "red";
    statusElement.textContent = status ? "Online" : "Offline";
}

export function updatePlayerCount(count) {
    const playerCountElement = document.getElementById("players");
    playerCountElement.textContent = count.toString();
}