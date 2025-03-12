const loginForm = document.getElementById('loginForm');
const gatewaySocket = new WebSocket("wss://gaming.gangdev.co/socket");

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const redirectUrl = new URLSearchParams(window.location.search).get('redirect');

    const payload = JSON.stringify({
        username: username,
        game: `https://game.gangdev.co/game1`,
    });

    console.log("Sending data to gateway:", payload);

    gatewaySocket.onopen = () => {
        console.log("Gateway Connected");
        gatewaySocket.send(payload);
    };

    gatewaySocket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        console.log("Gateway response:", data);

        if (data.redirect) {
            window.location.href = `${data.redirect}?username=${username}`; // redirect to game
        } else if (data.error) {
            alert(`Error: ${data.error}`);
        }
    };
});