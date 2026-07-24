<?php
/**
 * Lafter sign-up processor.
 * Creates a standalone lafter.users account.
 */
require_once '/var/www/gangdev/lafter/src/php/init.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	header('Location: signup.php');
	exit;
}

$displayName = trim($_POST['display_name'] ?? '');
$username = trim($_POST['username'] ?? '');
$email = strtolower(trim($_POST['email'] ?? ''));
$password=[REDACTED_PASSWORD] ?? '';
$confirm = $_POST['confirm_password'] ?? '';
$redirect = trim($_POST['redirect'] ?? 'https://lafter.gg');

// Validation
if ($displayName === '' || $username === '' || $email === '' || $password=[REDACTED_PASSWORD] '' || $confirm === '') {
	header('Location: signup.php?error=' . urlencode('All fields are required.'));
	exit;
}

if ($password !== $confirm) {
	header('Location: signup.php?error=' . urlencode('Passwords do not match.'));
	exit;
}

if (!preg_match('/^[a-zA-Z0-9_]{3,20}$/', $username)) {
	header('Location: signup.php?error=' . urlencode('Username must be 3-20 characters (letters, numbers, underscore).'));
	exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
	header('Location: signup.php?error=' . urlencode('Invalid email address.'));
	exit;
}

if (strlen($password) < 6) {
	header('Location: signup.php?error=' . urlencode('Password must be at least 6 characters.'));
	exit;
}

// Check uniqueness
$stmt = $pdo->prepare("SELECT 1 FROM lafter.users WHERE LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?) LIMIT 1");
$stmt->execute([$username, $email]);
if ($stmt->fetchColumn()) {
	header('Location: signup.php?error=' . urlencode('Username or email already taken.'));
	exit;
}

// Create account
$hash = password_hash($password, PASSWORD_DEFAULT);
$stmt = $pdo->prepare("
	INSERT INTO lafter.users (display_name, username, email, password_hash, role, verified, created_at, updated_at)
	VALUES (?, ?, ?, ?, 'user', FALSE, NOW(), NOW())
	RETURNING id
");
$stmt->execute([$displayName, $username, $email, $hash]);
$newUser = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$newUser) {
	header('Location: signup.php?error=' . urlencode('Account creation failed. Try again.'));
	exit;
}

// Auto-login
$_SESSION['lafter_user_id'] = $newUser['id'];
$_SESSION['display_name'] = $displayName;
$_SESSION['username'] = $username;
$_SESSION['email'] = $email;
$_SESSION['user_role'] = 'user';

// Redirect
$allowedDomains = ['gangdev.co', 'lafter.gg', 'candor.you', 'dcops.co'];
$redirectHost = parse_url($redirect, PHP_URL_HOST) ?? '';
$isAllowed = str_starts_with($redirect, 'https://') && array_filter($allowedDomains, fn($d) => str_ends_with($redirectHost, $d));

header('Location: ' . ($isAllowed ? $redirect : 'https://lafter.gg'));
exit;
