<?php
require_once 'https://shared.gangdev.co/php/init.php';
if (session_status() === PHP_SESSION_NONE) {
	session_start();
}
require_once "../db.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
	$displayname = trim($_POST["displayname"]);
	$username = trim($_POST["username"]);
	$email = trim($_POST["email"]);
	$password = trim($_POST["password"]);
	$confirm_password = trim($_POST["confirm_password"]);

	if (empty($displayname) || empty($username) || empty($email) || empty($password) || empty($confirm_password)) { // check for empty fields
		header("Location: signup.php?error=1");
		exit();
	}

	if ($password != $confirm_password) { // check if passwords match
		header("Location: signup.php?error=2");
		exit();
	}

	$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
	$stmt->execute([$email]);
	if ($stmt->fetch(PDO::FETCH_ASSOC)) {
		header("Location: signup.php?error=3");
		exit();
	}

	$hashed_password = password_hash($password, PASSWORD_DEFAULT);

	$stmt = $pdo->prepare("INSERT INTO users (displayname, username, email, password) VALUES (?, ?, ?, ?)");
	if ($stmt->execute([$displayname, $username, $email, $hashed_password])) {
		$_SESSION["user_id"] = $pdo->lastInsertId();
		$_SESSION["username"] = $username;
		header("Location: ../../index.php");
		exit();
	} else {
		header("Location: signup.php?error=4");
		exit();
	}
} else {
	header("Location: signup.php");
	exit();
}
