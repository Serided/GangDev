<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Test Multiplayer Game</title>
    <link rel="stylesheet" href="/css/games/testMultiplayerGame.css">
</head>
<body>
    <div>
        <h1>
            Test
        </h1>
    </div>
    <script>
        let ws = new WebSocket("ws://localhost:9090")
        ws.onmessage = message => {
            // message.data
            const response = JSON.parse(message.data);
            console.log(response);
        }
    </script>
</body>
</html>
