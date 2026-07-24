<?php
/**
 * callback.php — GangDev SSO callback for Lafter.
 * 
 * Flow:
 * 1. User clicks "Sign in with GangDev" → redirected to gangdev.co/auth?app=lafter
 * 2. gangdev.co authenticates, generates one-time code, redirects here with ?code=...
 * 3. We exchange the code server-side for user data
 * 4. Create/find lafter.users row, set session, redirect to lafter.gg
 */
require_once '/var/www/gangdev/lafter/src/php/init.php';

$code = $_GET['code'] ?? '';

if ($code === '') {
	header('Location: signin.php?error=' . urlencode('Invalid login attempt.'));
	exit;
}

// Exchange code for user data (server-to-server)
$ch = curl_init();
curl_setopt_array($ch, [
	CURLOPT_URL => 'https://gangdev.co/auth/exchange.php',
	CURLOPT_POST => true,
	CURLOPT_POSTFIELDS => http_build_query([
		'code' => $code,
		'app' => 'lafter',
		'secret' => $_ENV['SECRET_KEY'] ?? '',
	]),
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_TIMEOUT => 10,
]);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
	header('Location: signin.php?error=' . urlencode('Login failed. Try again.'));
	exit;
}

$data = json_decode($response, true);
if (!$data || !isset($data['user'])) {
	header('Location: signin.php?error=' . urlencode('Login failed. Try again.'));
	exit;
}

$gangdevUser = $data['user'];

// Find or create lafter user linked to this gangdev account
$stmt = $pdo->prepare("SELECT id, role FROM lafter.users WHERE gangdev_user_id = ?");
$stmt->execute([$gangdevUser['id']]);
$lafterUser = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$lafterUser) {
	$stmt = $pdo->prepare("
		INSERT INTO lafter.users (gangdev_user_id, display_name, username, email, password_hash, role, created_at, updated_at)
		VALUES (?, ?, ?, ?, '', 'user', NOW(), NOW())
		RETURNING id, role
	");
	$stmt->execute([$gangdevUser['id'], $gangdevUser['display_name'], $gangdevUser['username'], $gangdevUser['email']]);
	$lafterUser = $stmt->fetch(PDO::FETCH_ASSOC);
}

// Set lafter session
$_SESSION['lafter_user_id'] = $lafterUser['id'];
$_SESSION['display_name'] = $gangdevUser['display_name'];
$_SESSION['username'] = $gangdevUser['username'];
$_SESSION['email'] = $gangdevUser['email'];
$_SESSION['user_role'] = $gangdevUser['role'] ?? $lafterUser['role'] ?? 'user';

header('Location: https://lafter.gg');
exit;
