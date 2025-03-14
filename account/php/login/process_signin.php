<?php
require_once '/var/www/gangdev/shared/php/init.php';
require_once "../db.php";

$error = '';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
	$username = trim($_POST["username"]);
	$password = trim($_POST["password"]);
	$rememberme = isset($_POST["rememberme"]);

	$stmt = $pdo->prepare("SELECT id, displayname, username, email, password FROM users WHERE username = ?");
	$stmt->execute([$username]);
	$user = $stmt->fetch(PDO::FETCH_ASSOC);

	if ($user && password_verify($password, $user["password"])) {
		$_SESSION["user_id"] = $user["id"];
		$_SESSION["displayname"] = $user["displayname"];
		$_SESSION["username"] = $user["username"];
		$_SESSION["email"] = $user["email"];

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

		if ($rememberme) {
			$token = bin2hex(random_bytes(16));
			$expiry = date("Y-m-d H:i:s", time() + (30 * 24 * 60 * 60)); // 30 days

			$stmt = $pdo->prepare("INSERT INTO user_remember_tokens (user_id, token, expires_at) VALUES (?, ?)");
			$stmt->execute([$user["id"], $token, $expiry]);
		}

		header("Location: https://account.gangdev.co");
		exit();
	} else {
		// Optionally, log an error here for debugging
		error_log("Failed login attempt for user: " . $username);
		header("Location: signin.php?error=1");
		exit();
	}
} else {
	header("Location: signin.php");
	exit();
}
?>
