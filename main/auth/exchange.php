<?php
/**
 * GangDev Auth Exchange — trades a one-time code for user data.
 * Called server-side by product backends (not by browsers).
 * POST https://gangdev.co/auth/exchange
 * Body: code=...&app=...&secret=...
 */
require_once '/var/www/gangdev/shared/php/init_base.php';

gangdev_init(['domain' => '.gangdev.co', 'session_lifetime' => 0]);

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	http_response_code(405);
	echo json_encode(['error' => 'POST required']);
	exit();
}

$code = trim($_POST['code'] ?? '');
$app = trim($_POST['app'] ?? '');
$secret = trim($_POST['secret'] ?? '');

if (!$code || !$app || !$secret) {
	http_response_code(400);
	echo json_encode(['error' => 'Missing parameters']);
	exit();
}

// Verify shared secret (each product has the same SECRET_KEY from .env)
if ($secret !== $_ENV['SECRET_KEY']) {
	http_response_code(403);
	echo json_encode(['error' => 'Invalid secret']);
	exit();
}

// Look up the code
$stmt = $pdo->prepare("SELECT user_id, app, used, created_at FROM auth_codes WHERE code = ?");
$stmt->execute([$code]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$row) {
	http_response_code(404);
	echo json_encode(['error' => 'Code not found']);
	exit();
}

if ($row['used']) {
	http_response_code(410);
	echo json_encode(['error' => 'Code already used']);
	exit();
}

if ($row['app'] !== $app) {
	http_response_code(403);
	echo json_encode(['error' => 'Code not valid for this app']);
	exit();
}

// Expire after 5 minutes
if (strtotime($row['created_at']) < time() - 300) {
	http_response_code(410);
	echo json_encode(['error' => 'Code expired']);
	exit();
}

// Mark as used
$pdo->prepare("UPDATE auth_codes SET used = true WHERE code = ?")->execute([$code]);

// Fetch user data
$stmt = $pdo->prepare("SELECT id, username, email, display_name FROM users WHERE id = ?");
$stmt->execute([$row['user_id']]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
	http_response_code(404);
	echo json_encode(['error' => 'User not found']);
	exit();
}

echo json_encode([
	'success' => true,
	'user' => [
		'id' => (int)$user['id'],
		'username' => $user['username'],
		'email' => $user['email'],
		'display_name' => $user['display_name'],
	]
]);
?>
