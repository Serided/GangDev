var testing = false;
var whichServer = testing ? "localhost" : "gaming.gangdev.co";

var webSocket = new WebSocket("wss://" + whichServer + "/game1");

let clientCountElement = document.getElementById("clientCount");

webSocket.onmessage = async (event) => {
    let data = event.data;

    if (data instanceof Blob) {
        data = await data.text();
    }

    try {
        const parsedData = JSON.parse(data);

        if (parsedData.type === "clientCount") {
            clientCountElement.innerHTML = `clients connected: ${parsedData.count}`
        }
    } catch (e) {
        document.getElementById("messages").innerHTML += "message from server: " + data + "<br>";
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