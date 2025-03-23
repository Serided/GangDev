<?php
require_once '/var/www/gangdev/shared/php/init.php';
if (!isset($_SESSION["user_id"])) {
    header("Location: https://account.gangdev.co/login/signin.php?redirect=/game1");
    exit();
}

use \Firebase\JWT\JWT;
$secretKey = $_ENV['SECRET_KEY'];
$issuedAt   = time();
$expiration = $issuedAt + (60 * 60);
$payload = [
    'iat'      => $issuedAt,
    'exp'      => $expiration,
    'uid'      => $_SESSION["user_id"],
    'username' => $_SESSION["username"],
];
$authToken = JWT::encode($payload, $secretKey, 'HS256');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crust</title>
    <link rel="stylesheet" href="/multiplayer/games/game1/client/style.css">
    <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet">
    <script>
        const authToken = <?php echo json_encode($authToken); ?>;
        const username = <?php echo json_encode($_SESSION["username"]); ?>;
        const userId = <?php echo json_encode($_SESSION["userId"] ?? $_SESSION["user_id"]); ?>;
        const displayName = <?php echo json_encode($_SESSION["displayname"]); ?>;
        window.authToken = authToken;
        window.username = username;
        window.userId = userId;
        window.displayName = displayName;
    </script>
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
