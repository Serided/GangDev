<?php
/**
 * api/auth/signin.php — Connector sign-in endpoint.
 * Accepts JSON { username, password } → returns token + user info.
 * Token is stored in session_password column for persistent connector auth.
 */

require_once __DIR__ . '/../../src/php/init.php';

ini_set('display_errors', 0);
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	http_response_code(405);
	exit(json_encode(['error' => 'POST required']));
}

$input = json_decode(file_get_contents('php://input'), true);
$username = trim($input['username'] ?? '');
$password=[REDACTED_PASSWORD] ?? '';

if (!$username || !$password) {
	http_response_code(400);
	exit(json_encode(['success' => false, 'error' => 'Username and password required.']));
}

global $pdo;

// Look up user
$stmt = $pdo->prepare('SELECT id, username, display_name, email, password_hash, session_password, role FROM lafter.users WHERE username = ?');
$stmt->execute([$username]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || !password_verify($password, $user['password_hash'])) {
	http_response_code(401);
	exit(json_encode(['success' => false, 'error' => 'Invalid username or password.']));
}

// Generate a persistent connector token if one doesn't exist
$token = $user['session_password'];
if (!$token) {
	$token = bin2hex(random_bytes(32));
	$update = $pdo->prepare('UPDATE lafter.users SET session_password=[REDACTED_PASSWORD] WHERE id = ?');
	$update->execute([$token, $user['id']]);
}

echo json_encode([
	'success' => true,
	'token' => $token,
	'user_id' => (int)$user['id'],
	'display_name' => $user['display_name'],
	'username' => $user['username'],
]);
