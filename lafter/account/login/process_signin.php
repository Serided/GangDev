<?php
/**
 * Lafter sign-in processor.
 * Authenticates against lafter.users (standalone accounts).
 * Also supports gangdev-linked accounts (via gangdev_user_id).
 */
require_once '/var/www/gangdev/lafter/src/php/init.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	header('Location: signin.php');
	exit;
}

$username = trim($_POST['username'] ?? '');
$password = $_POST['password'] ?? '';
$redirect = trim($_POST['redirect'] ?? 'https://lafter.gg');

if ($username === '' || $password === '') {
	header('Location: signin.php?error=' . urlencode('Username and password are required.') . '&redirect=' . urlencode($redirect));
	exit;
}

$stmt = $pdo->prepare("
	SELECT id, display_name, username, email, password_hash, role, riot_name, riot_tag
	FROM lafter.users
	WHERE LOWER(username) = LOWER(?)
	LIMIT 1
");
$stmt->execute([$username]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || !password_verify($password, $user['password_hash'])) {
	header('Location: signin.php?error=' . urlencode('Invalid username or password.') . '&redirect=' . urlencode($redirect));
	exit;
}

// Set session
$_SESSION['lafter_user_id'] = $user['id'];
$_SESSION['display_name'] = $user['display_name'];
$_SESSION['username'] = $user['username'];
$_SESSION['email'] = $user['email'];
$_SESSION['user_role'] = $user['role'] ?? 'user';

// Redirect
$allowedDomains = ['gangdev.co', 'lafter.gg', 'candor.you', 'dcops.co'];
$redirectHost = parse_url($redirect, PHP_URL_HOST) ?? '';
$isAllowed = str_starts_with($redirect, 'https://') && array_filter($allowedDomains, fn($d) => str_ends_with($redirectHost, $d));

header('Location: ' . ($isAllowed ? $redirect : 'https://lafter.gg'));
exit;
