var testing = false;
var whichServer = testing ? "localhost" : "gaming.gangdev.co";

var webSocket = new WebSocket("wss://" + whichServer + "/game1");

var clientCountElement = document.getElementById("clientCount");

webSocket.onmessage = async (event) => {
    let data = event.data instanceof Blob ? await event.data.text() : event.data;

    if (data.startsWith("{")) {
        JSON.parse(data);
        if (data.type === "clientCount") {
            clientCountElement.innerHTML = `clients connected: ${data.count}`;
            return;
        }
    }
    document.getElementById("messages").innerHTML += "message from server: " + data + "<br>";
};

webSocket.addEventListener("open", () => {
    console.log("we are connected");
});

function sendMessage(event) {
    let inputMessage = document.getElementById("message");
    if (inputMessage.value !== "")
        webSocket.send(inputMessage.value);
        inputMessage.value = "";
        event.preventDefault();
}

document.getElementById("input-form").addEventListener("submit", sendMessage);