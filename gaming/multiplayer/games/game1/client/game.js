let activeSocket;
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const players = {};
players[userId] = { x: canvas.width / 2, y: canvas.height / 2, displayName: displayName, userId: userId };
const speed = 200;
const keys = {};
let lastTime = performance.now();

const gatewaySocket = new WebSocket("wss://gaming.gangdev.co/socket");

gatewaySocket.onopen = () => {
    console.log("Connected to gateway");
    updateStatus(true);
    const authPayload = JSON.stringify({
        type: "auth",
        token: authToken,
        username: username,
        userId: userId
    });
    console.log("Sending auth payload:", authPayload);
    gatewaySocket.send(authPayload);
};

gatewaySocket.onmessage = (event) => {
    try {
        const data = JSON.parse(event.data);
        console.log("Gateway response:", data);
        if (data.type === "authAck") {
            const joinPayload = JSON.stringify({ game: "game1" });
            console.log("Sending join payload:", joinPayload);
            gatewaySocket.send(joinPayload);
        } else if (data.redirect) {
            gatewaySocket.close();
            connectToGame(data.redirect, data.game);
        } else if (data.error) {
            console.error("Gateway error:", data.error);
        } else if (data.message) {
            appendMessage(data.message);
        }
    } catch (err) {
        console.error("Error parsing gateway message:", err);
    }
};

function connectToGame(gameUrl, gameName) {
    console.log(`Connecting to game server: ${gameUrl}`);
    if (!gameUrl.startsWith("wss://")) {
        gameUrl = `wss://${window.location.host}${gameUrl}`;
    }
    const gameSocket = new WebSocket(gameUrl);
    gameSocket.onopen = () => {
        console.log(`Connected to ${gameName} server`);
        activeSocket = gameSocket;
        sendData('chatMessage', 'Player connected!');
        updateStatus(true);
        lastTime = performance.now();
        requestAnimationFrame(gameLoop);
    };
    gameSocket.onmessage = async (event) => {
        let data;
        if (event.data instanceof Blob && typeof event.data.text === "function") {
            data = JSON.parse(await event.data.text());
        } else {
            data = JSON.parse(event.data);
        }
        switch (data.type) {
            case "chatMessage":
                appendMessage(data.data);
                break;
            case "playerCount":
                updatePlayerCount(data.data);
                break;
            case "movement":
                handleMovementUpdate(data.data);
                break;
            default:
                console.error("Invalid data:", data);
        }
    };
    gameSocket.onerror = (event) => {
        console.error("WebSocket error:", event);
        updateStatus(false);
    };
    gameSocket.onclose = () => {
        console.log(`Disconnected from ${gameName} server`);
        updateStatus(false);
    };
}

function sendData(type, data) {
    if (activeSocket && activeSocket.readyState === WebSocket.OPEN) {
        const payload = typeof data === "string" ? { text: data } : data;
        const enrichedData = {
            ...payload,
            user: {
                userId: userId,
                username: username,
                displayName: displayName
            }
        };
        const message = JSON.stringify({ type, data: enrichedData });
        console.log("Sending data:", message);
        const blob = new Blob([message], { type: 'application/json' });
        activeSocket.send(blob);
    } else {
        console.warn("Cannot send data. WebSocket closed.");
    }
}

function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
        sendData('chatMessage', message);
        chatInput.value = "";
    }
}

function gameLoop(timestamp) {
    const delta = (timestamp - lastTime) / 1000;
    lastTime = timestamp;
    if (keys["ArrowUp"] || keys["w"]) localPlayer.y -= speed * delta;
    if (keys["ArrowDown"] || keys["s"]) localPlayer.y += speed * delta;
    if (keys["ArrowLeft"] || keys["a"]) localPlayer.x -= speed * delta;
    if (keys["ArrowRight"] || keys["d"]) localPlayer.x += speed * delta;
    sendData("movement", { x: localPlayer.x, y: localPlayer.y });
    drawGame();
    requestAnimationFrame(gameLoop);
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const id in players) {
        const p = players[id];
        ctx.fillStyle = p.userId === userId ? "green" : "red";
        ctx.fillRect(p.x - 25, p.y - 25, 50, 50);
        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.fillText(p.displayName, p.x - 25, p.y - 30);
    }
}

function handleMovementUpdate(data) {
    if (data && data.user && data.user.userId) {
        players[data.user.userId] = { ...players[data.user.userId], ...data };
    }
}

window.addEventListener("keydown", (event) => { keys[event.key] = true; });
window.addEventListener("keyup", (event) => { keys[event.key] = false; });
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

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

function updateStatus(status) {
    const statusElement = document.getElementById("status");
    statusElement.style.color = status ? 'green' : 'red';
    statusElement.textContent = status ? "Online" : "Offline";
}

function updatePlayerCount(count) {
    const playerCountElement = document.getElementById("players");
    playerCountElement.textContent = count.toString();
}

function appendMessage(msg) {
    const messagesElement = document.getElementById("messages");
    const messageElement = document.createElement("p");
    let messageText = "";
    let color = "red";
    if (typeof msg === "object" && msg !== null) {
        if (msg.text && msg.user && msg.user.displayName) {
            messageText = `${msg.user.displayName}: ${msg.text}`;
            if (msg.user.userId === userId) color = "green";
        } else {
            messageText = JSON.stringify(msg);
        }
    } else {
        messageText = msg.toString();
    }
    messageElement.textContent = messageText;
    messageElement.style.color = color;
    messagesElement.appendChild(messageElement);
}