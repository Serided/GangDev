<?php
/**
 * Candor OAuth callback — exchanges a GangDev auth code for user info,
 * then logs in or auto-provisions a Candor account.
 */
require_once '/var/www/gangdev/candor/src/php/init.php';

$code = trim($_GET['code'] ?? '');

if (!$code) {
	header('Location: https://account.candor.you/login/signin.php?error=' . urlencode('Authentication failed.'));
	exit();
}

// Exchange code with GangDev server-side
$postData = http_build_query([
	'code' => $code,
	'app' => 'candor',
	'secret' => $_ENV['SECRET_KEY'],
]);

$context = stream_context_create([
	'http' => [
		'method' => 'POST',
		'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
		'content' => $postData,
		'timeout' => 10,
	],
]);

$response = @file_get_contents('https://gangdev.co/auth/exchange.php', false, $context);

if ($response === false) {
	header('Location: https://account.candor.you/login/signin.php?error=' . urlencode('Could not verify authentication.'));
	exit();
}

$data = json_decode($response, true);

if (!$data || !isset($data['success']) || !$data['success']) {
	$err = $data['error'] ?? 'Unknown error';
	header('Location: https://account.candor.you/login/signin.php?error=' . urlencode($err));
	exit();
}

$gangdevUser = $data['user'];
$gangdevId = (int)$gangdevUser['id'];

// Check if a candor account is already linked
$stmt = $pdo->prepare("SELECT id FROM candor.users WHERE account_id = ?");
$stmt->execute([$gangdevId]);
$existing = $stmt->fetch(PDO::FETCH_ASSOC);

if ($existing) {
	// Already linked — log them in
	candor_login($existing['id']);
} else {
	// Auto-provision a new Candor account
	// Check if email already exists as a standalone candor account
	$stmt = $pdo->prepare("SELECT id, account_id FROM candor.users WHERE LOWER(email) = LOWER(?)");
	$stmt->execute([$gangdevUser['email']]);
	$byEmail = $stmt->fetch(PDO::FETCH_ASSOC);

	if ($byEmail) {
		// Link existing standalone account
		$pdo->prepare("UPDATE candor.users SET account_id = ? WHERE id = ?")->execute([$gangdevId, $byEmail['id']]);
		candor_login($byEmail['id']);
	} else {
		// Create new candor user
		$stmt = $pdo->prepare("
			INSERT INTO candor.users (email, username, display_name, password_hash, email_verified, account_id)
			VALUES (?, ?, ?, '', TRUE, ?)
			RETURNING id
		");
		$stmt->execute([
			$gangdevUser['email'],
			$gangdevUser['username'],
			$gangdevUser['display_name'],
			$gangdevId,
		]);
		$newId = $stmt->fetchColumn();
		candor_login($newId);
	}
}

// Redirect to Candor home
header('Location: https://candor.you/');
exit();
?>
