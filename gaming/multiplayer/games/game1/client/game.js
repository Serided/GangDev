const gatewaySocket = new WebSocket("wss://gaming.gangdev.co/socket");

gatewaySocket.onopen = () => {
    console.log("Connected to gateway");

    // Send login request
    const loginData = JSON.stringify({
        type: "signin",
        username: "user1",   // Change this dynamically with an input field
        password: "hashed_password_1" // Replace with user input
    });

    gatewaySocket.send(loginData);
};

gatewaySocket.onmessage = (event) => {
    try {
        const data = JSON.parse(event.data);
        console.log("Server Response:", data);

        if (data.token) {
            console.log(`✅ Login successful! Token: ${data.token}`);
            localStorage.setItem("userToken", data.token); // Store token for future use
        } else {
            console.error("❌ Login failed:", data.error);
        }
    } catch (err) {
        console.error("Error parsing server response:", err);
    }
};

console.log(localStorage.getItem("userToken"));