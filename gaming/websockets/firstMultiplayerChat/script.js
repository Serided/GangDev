var testing = false;
var whichServer = testing ? "localhost" : "gaming.gangdev.co";

var webSocket = new WebSocket("wss://" + whichServer + "/game1");

let clientCountElement = document.getElementById("clientCount");

webSocket.onmessage = (event) => {
    if (event.data.type === "cC") {
        clientCountElement.innerHTML = "client count: " + event.data.message
    } else  if (event.data.type === "msg") {
        document.getElementById("messages").innerHTML += "message from server: " + event.data.message + "<br>";
    }
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