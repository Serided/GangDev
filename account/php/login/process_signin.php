<?php
require_once 'https://shared.gangdev.co/php/init.php';
if (session_status() === PHP_SESSION_NONE) {
	session_start();
}
require_once "../db.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
	$username = trim($_POST["username"]);
	$password = trim($_POST["password"]);

	$stmt = $pdo->prepare("SELECT id, username, password FROM users WHERE username = ?");
	$stmt->execute([$username]);
	$user = $stmt->fetch(PDO::FETCH_ASSOC);

	if ($user && password_verify($password, $user["password"])) {
		$_SESSION["user_id"] = $user["id"];
		$_SESSION["username"] = $user["username"];
		header("Location: ../../index.php");
		exit();
	} else {
		header("Location: signin.php?error=1");
		exit();
	}
} else {
	header("Location: signin.php");
	exit();
}
