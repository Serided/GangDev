<?php require_once '/var/www/gangdev/gaming/multiplayer/engine/src/network/auth.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Crust</title>
  <link rel="stylesheet" href="/multiplayer/games/game1/client/style.css">
  <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet">

</head>
<body>
  <canvas id="gameCanvas"></canvas>
  <div class="header">
    <h1>Crust</h1>
    <p class="status">Status: <span id="status">Offline</span></p>
    <p class="players">Players: <span id="players">0</span></p>
  </div>
  <div id="chatButton">
    <div class="chatBubble"><span>...</span></div>
  </div>
  <div id="chatPanel">
    <div id="messages"></div>
    <input type="text" id="chatInput" placeholder="Type a message...">
    <button id="sendButton">Send</button>
  </div>
  <div id="leftMenu"></div>
  <script type="module" src="/multiplayer/games/game1/client/client.js"></script>
</body>
</html>