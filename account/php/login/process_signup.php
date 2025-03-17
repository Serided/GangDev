<?php
require_once '/var/www/gangdev/shared/php/init.php';
require_once "../db.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
	$displayname = trim($_POST["displayname"]);
	$username = trim($_POST["username"]);
	$email = trim($_POST["email"]);
	$confirmEmail = trim($_POST["confirmEmail"]);
	$password = trim($_POST["password"]);
	$confirmPassword = trim($_POST["confirmPassword"]);
	$rememberMe = isset($_POST["rememberMe"]);

	if (empty($displayname) || empty($username) || empty($email) || empty($password) || empty($confirmPassword)) { // check for empty fields
		header("Location: signup.php?error=1");
		exit();
	}

	if ($email != $confirmEmail) { // check if passwords match
		header("Location: signup.php?error=2");
		exit();
	}
	if ($password != $confirmPassword) { // check if passwords match
		header("Location: signup.php?error=3");
		exit();
	}

	$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
	$stmt->execute([$email]);
	if ($stmt->fetch(PDO::FETCH_ASSOC)) {
		header("Location: signup.php?error=4");
		exit();
	}

	$hashed_password = password_hash($password, PASSWORD_DEFAULT);

	$stmt = $pdo->prepare("INSERT INTO users (displayname, username, email, password) VALUES (?, ?, ?, ?)");
	if ($stmt->execute([$displayname, $username, $email, $hashed_password])) {
		$_SESSION["user_id"] = $pdo->lastInsertId();
		$_SESSION["displayname"] = $displayname;
		$_SESSION["username"] = $username;
		$_SESSION["email"] = $email;

		$folder = '/var/www/gangdev/user/' . $_SESSION["user_id"];
		if (!file_exists($folder)) {
			mkdir($folder, 0755, true);
			mkdir($folder . '/icon', 0755, true);
			mkdir($folder . '/data', 0755, true);
		}

		if ($rememberMe) {
			$token = bin2hex(random_bytes(16));  // 32-character token
			$expiry = date('Y-m-d H:i:s', time() + (30 * 24 * 60 * 60));  // 30 days from now

			$stmt = $pdo->prepare("INSERT INTO user_remember_tokens (user_id, token, expires_at) VALUES (?, ?, ?)");
			$stmt->execute([$_SESSION['user_id'], $token, $expiry]);

			// Set a persistent cookie for 30 days
			setcookie('rememberMe', $token, time() + (30 * 24 * 60 * 60), '/', '.gangdev.co', false, true);
		}

		header("Location: https://account.gangdev.co");
		exit();
	} else {
		header("Location: signup.php?error=5");
		exit();
	}
} else {
	header("Location: signup.php");
	exit();
}
