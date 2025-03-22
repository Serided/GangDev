<?php
require_once '/var/www/gangdev/shared/php/init.php';

if (!isset($_SESSION["user_id"])) {
    header("Location: https://account.gangdev.co/login/signin.php?message=please_sign_in");
    exit();
}

use \Firebase\JWT\JWT;

$secretKey = 'your-very-secure-secret';
$issuedAt   = time();
$expiration = $issuedAt + (24 * 60 * 60);
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
      <script src="/multiplayer/games/game1/client/game.js" defer></script>
      <link rel="stylesheet" href="/multiplayer/games/game1/client/style.css">
    </head>
    <body>
      <canvas id="gameCanvas"></canvas>

      <script>
        const username = <?php echo json_encode($_SESSION["username"]); ?>;
        const userId = <?php echo json_encode($_SESSION["user_id"]); ?>;
        const authToken = <?php echo json_encode($authToken); ?>;
        console.log("User authenticated as:", username);
      </script>
    </body>
</html>
