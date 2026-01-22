<?php
require_once '/var/www/gangdev/shared/php/init.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
	$username = trim($_POST["username"]);
	$password = trim($_POST["password"]);
	$rememberMe = isset($_POST["rememberMe"]);

	$stmt = $pdo->prepare("SELECT id, displayname, username, email, password FROM users WHERE username = ?");
	$stmt->execute([$username]);
	$user = $stmt->fetch(PDO::FETCH_ASSOC);

	if ($user && password_verify($password, $user["password"])) {
		$sessionToken = bin2hex(random_bytes(16));

		$_SESSION["user_id"] = $user["id"];
		$_SESSION["displayname"] = $user["displayname"];
		$_SESSION["username"] = $user["username"];
		$_SESSION["email"] = $user["email"];
		$_SESSION["session_token"] = $sessionToken;

		$stmtToken = $pdo->prepare("UPDATE users SET current_session_token = ? WHERE id = ?");
		$stmtToken->execute([$sessionToken, $user["id"]]);

		$folder = '/var/www/gangdev/user/' . $user["id"];
		if (!file_exists($folder)) {
			mkdir($folder, 0755, true);
		}
		if (!file_exists($folder . '/icon')) {
			mkdir($folder . '/icon', 0755, true);
		}
		if (!file_exists($folder . '/data')) {
			mkdir($folder . '/data', 0755, true);
		}

		if ($rememberMe) {
			$token = bin2hex(random_bytes(16));
			$expiry = date("Y-m-d H:i:s", time() + (30 * 24 * 60 * 60)); // 30 days
			// Corrected query with 3 placeholders
			$stmt = $pdo->prepare("INSERT INTO user_remember_tokens (user_id, token, expires_at) VALUES (?, ?, ?)");
			$stmt->execute([$user["id"], $token, $expiry]);

			// Set persistent cookie for 30 days
			setcookie('rememberMe', $token, time() + (30 * 24 * 60 * 60), '/', '.gangdev.co', false, true);
		}

		$redirect = isset($_POST["redirect"]) ? trim($_POST["redirect"]) : '';

		if (!empty($redirect) && str_starts_with($redirect, "/")) {
			header("Location: https://crust.gangdev.co/" . $redirect);
		} else {
			header("Location: https://account.gangdev.co");
		}

		exit();
	} else {
		error_log("Failed login attempt for user: " . $username);
		header("Location: signin.php?error=1");
		exit();
	}
} else {
	header("Location: signin.php");
	exit();
}
?>
