<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_set_cookie_params([
	'lifetime' => 7 * 24 * 60 * 60,
	'path' => '/',
	'domain' => '.gangdev.co',
	'secure' => true,
	'httponly' => true,
	'samesite' => 'Lax'
]);

if (session_status() == PHP_SESSION_NONE) {
	session_start();
}

require '/../lib/composer/vendor/autoload.php';
require_once 'db.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable('/..');
$dotenv->load();

define('ROOT_PATH', __DIR__);

if (!isset($_SESSION["user_id"]) && isset($_COOKIE["rememberMe"])) {
	error_log("Remember me cookie found: " . $_COOKIE["rememberMe"]);
	$token = $_COOKIE["rememberMe"];
	$stmt = $pdo->prepare("SELECT user_id, expires_at FROM user_remember_tokens WHERE token = ?");
	$stmt->execute([$token]);
	$tokenData = $stmt->fetch(PDO::FETCH_ASSOC);

	if ($tokenData && strtotime($tokenData['expires_at']) > time()) {
		$stmt = $pdo->prepare("SELECT id, displayname, username, email, verified FROM users WHERE id = ?");
		$stmt->execute([$tokenData['user_id']]);
		$user = $stmt->fetch(PDO::FETCH_ASSOC);

		if ($user) {
			$_SESSION["user_id"] = $user["id"];
			$_SESSION["displayname"] = $user["displayname"];
			$_SESSION["username"] = $user["username"];
			$_SESSION["email"] = $user["email"];
			$_SESSION["verified"] = $user["verified"];

			$newExpiry = date('Y-m-d H:i:s', time() + (30 * 24 * 60 * 60));
			$stmt = $pdo->prepare("UPDATE user_remember_tokens SET expires_at = ? WHERE token = ?");
			$stmt->execute([$newExpiry, $token]);
		}
	} else {
		// Token is invalid or expired, clear the cookie
		setcookie('rememberMe', '', time() - 3600, '/', '.gangdev.co');
	}
}

if (isset($_SESSION["user_id"], $_SESSION["session_token"])) {
	$stmt = $pdo->prepare("SELECT current_session_token FROM users WHERE id = ?");
	$stmt->execute([$_SESSION["user_id"]]);
	$user = $stmt->fetch(PDO::FETCH_ASSOC);
	if (!$user || $user["current_session_token"] !== $_SESSION["session_token"]) {
		session_destroy();
		header("Location: https://account.gangdev.co/login/signin.php?message=session_expired");
		exit();
	}
}

$displayname = isset($_SESSION['displayname']) ? $_SESSION['displayname'] : 'Account';
$userIconUrl = '';
if (isset($_SESSION['user_id'])) {
	$userIconUrl = "https://gangdev.co/user/" . $_SESSION['user_id'] . "/icon/user-icon.jpg";
}

ob_start();
include '/var/www/gangdev/shared/php/navBar.php';
$navbar = ob_get_clean();
ob_start();
include '/var/www/gangdev/shared/php/footer.php';
$footer = ob_get_clean();
ob_start();
include '/var/www/gangdev/shared/php/repetitive.php';
$head = ob_get_clean();

error_log('Session content: ' . print_r($_SESSION, true));
?>