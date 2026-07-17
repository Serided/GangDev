<?php
/**
 * init.php — gangdev.co main site init.
 * Session, auth, remember-me, nav/footer/head rendering.
 */
require_once '/var/www/gangdev/shared/php/init_base.php';

gangdev_init([
	'domain' => '.gangdev.co',
	'session_lifetime' => 7 * 24 * 60 * 60,
]);

$rootPath = $_ENV['ROOT_PATH'] ?? '';

// Remember-me cookie restoration
if (!isset($_SESSION["user_id"]) && isset($_COOKIE["rememberMe"])) {
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
		setcookie('rememberMe', '', time() - 3600, '/', '.gangdev.co');
	}
}

// Session token validation
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

// User context
$displayname = $_SESSION['displayname'] ?? 'Account';
$userIconUrl = '';
if (isset($_SESSION['user_id'])) {
	$userIconUrl = "https://user.gangdev.co/" . $_SESSION['user_id'] . "/icon/user-icon.jpg";
}

// Render shared components
$navbar = gangdev_render('/var/www/gangdev/main/src/php/navBar.php', compact('displayname', 'userIconUrl'));
$footer = gangdev_render('/var/www/gangdev/main/src/php/footer.php');
$head = gangdev_render('/var/www/gangdev/main/src/php/repetitive.php');
$warn = gangdev_render('/var/www/gangdev/main/src/php/warning.php');

// Background images
$backgrounds = glob("/var/www/gangdev/main/src/img/background/landscape/*.jpg", GLOB_BRACE);
$backgroundURLs = array_map(function($background) {
	return "https://gangdev.co/" . str_replace("/var/www/gangdev/main", "", $background);
}, $backgrounds);
$jsonBackgrounds = json_encode($backgroundURLs);
?>

<script>
    let backgrounds = <?php echo $jsonBackgrounds; ?>;
</script>
