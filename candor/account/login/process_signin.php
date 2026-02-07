<?php
require_once '/var/www/gangdev/shared/php/init_candor.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	header('Location: /login/signin.php');
	exit;
}

$username = trim($_POST['username'] ?? '');
$password = $_POST['password'] ?? '';

if ($username === '' || $password === '') {
	header('Location: /login/signin.php?error=' . urlencode('Username and password are required.'));
	exit;
}

$stmt = $pdo->prepare("
    SELECT id, email, username, display_name, password_hash, email_verified::int AS email_verified
    FROM candor.users
    WHERE LOWER(username) = LOWER(?)
    LIMIT 1
");
$stmt->execute([$username]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
	header('Location: /login/signin.php?error=' . urlencode('Invalid username or password.'));
	exit;
}

if (empty($user['email_verified'])) {
	header('Location: /login/verify.php');
	exit;
}

candor_login((int)$user['id']);

header('Location: https://do.candor.you/');
exit;
