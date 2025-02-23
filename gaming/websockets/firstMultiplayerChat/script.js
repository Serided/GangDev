var testing = false;
var whichServer = testing ? "localhost" : "gaming.gangdev.co";

var webSocket = new WebSocket("wss://" + whichServer + ":10001/");
webSocket.onmessage = (event) => {
    console.log(event);
    document.getElementById("messages").innerHTML += "Message from server: " + event.data + "<br>";
};
webSocket.addEventListener("open", () => {
    console.log("We are connected");
});
function sendMessage(event) {
    var inputMessage = document.getElementById("message");
    webSocket.send(inputMessage.value);
    inputMessage.value = "";
    event.preventDefault();
}
document.getElementById("input-form").addEventListener("submit", sendMessage);