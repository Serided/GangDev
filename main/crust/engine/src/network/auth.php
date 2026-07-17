<?php
require_once '/var/www/gangdev/shared/php/init.php';

if (!isset($_SESSION["user_id"])) {
	$uriParts = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
    $redirect = '/' . $uriParts[0];
	header("Location: https://account.gangdev.co/login/signin.php?redirect=$redirect");
	exit();
}

use \Firebase\JWT\JWT;
$secretKey = $_ENV['SECRET_KEY'];
$issuedAt   = time();
$expiration = $issuedAt + (60 * 60); // 1 hour expiration

$payload = [
	'iat'      => $issuedAt,
	'exp'      => $expiration,
	'uid'      => $_SESSION["user_id"],
	'username' => $_SESSION["username"],
];

$authToken = JWT::encode($payload, $secretKey, 'HS256');
?>

<!-- Export authentication variables to JS -->
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