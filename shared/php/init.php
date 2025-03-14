<?php
if (session_status() == PHP_SESSION_NONE) session_start();

if (!isset($_SESSION["user_id"]) && isset($_COOKIE["rememberme"])) {
	require_once "/var/www/gangdev/account/php"; // or adjust path accordingly

	$token = $_COOKIE["rememberme"];
	$stmt = $pdo->prepare("SELECT user_id, expires_at FROM user_remember_tokens WHERE token = ?");
	$stmt->execute([$token]);
	$tokenData = $stmt->fetch(PDO::FETCH_ASSOC);

	// Check token validity and expiration
	if ($tokenData && strtotime($tokenData['expires_at']) > time()) {
		// Token is valid, fetch the user info
		$stmt = $pdo->prepare("SELECT id, displayname, username, email FROM users WHERE id = ?");
		$stmt->execute([$tokenData['user_id']]);
		$user = $stmt->fetch(PDO::FETCH_ASSOC);

		if ($user) {
			$_SESSION["user_id"] = $user["id"];
			$_SESSION["displayname"] = $user["displayname"];
			$_SESSION["username"] = $user["username"];
			$_SESSION["email"] = $user["email"];

			// Optionally, refresh the token's expiration
			$newExpiry = date('Y-m-d H:i:s', time() + (30 * 24 * 60 * 60));
			$stmt = $pdo->prepare("UPDATE user_remember_tokens SET expires_at = ? WHERE token = ?");
			$stmt->execute([$newExpiry, $token]);
		}
	} else {
		// Token is invalid or expired, clear the cookie
		setcookie('rememberme', '', time() - 3600, '/', '.gangdev.co');
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

error_log('Session content: ' . print_r($_SESSION, true)); // Check your Apache error log for this output.