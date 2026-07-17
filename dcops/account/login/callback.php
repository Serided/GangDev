<?php
/**
 * DCOPS OAuth callback — exchanges a GangDev auth code for user info,
 * then logs in or auto-provisions a DCOPS account.
 */
require_once '/var/www/gangdev/dcops/src/php/init.php';

$code = trim($_GET['code'] ?? '');

if (!$code) {
	header('Location: https://account.dcops.co/login/signin.php?error=' . urlencode('Authentication failed.'));
	exit();
}

// Exchange code with GangDev server-side
$postData = http_build_query([
	'code' => $code,
	'app' => 'dcops',
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
	header('Location: https://account.dcops.co/login/signin.php?error=' . urlencode('Could not verify authentication.'));
	exit();
}

$data = json_decode($response, true);

if (!$data || !isset($data['success']) || !$data['success']) {
	$err = $data['error'] ?? 'Unknown error';
	header('Location: https://account.dcops.co/login/signin.php?error=' . urlencode($err));
	exit();
}

$gangdevUser = $data['user'];
$gangdevId = (int)$gangdevUser['id'];

// Check if a dcops account is already linked
$stmt = $pdo->prepare("SELECT id FROM dcops.users WHERE account_id = ?");
$stmt->execute([$gangdevId]);
$existing = $stmt->fetch(PDO::FETCH_ASSOC);

if ($existing) {
	dcops_login($existing['id']);
} else {
	// Check if email already exists as standalone
	$stmt = $pdo->prepare("SELECT id, account_id FROM dcops.users WHERE LOWER(email) = LOWER(?)");
	$stmt->execute([$gangdevUser['email']]);
	$byEmail = $stmt->fetch(PDO::FETCH_ASSOC);

	if ($byEmail) {
		$pdo->prepare("UPDATE dcops.users SET account_id = ? WHERE id = ?")->execute([$gangdevId, $byEmail['id']]);
		dcops_login($byEmail['id']);
	} else {
		// Auto-provision new DCOPS user
		$stmt = $pdo->prepare("
			INSERT INTO dcops.users (email, real_name, password_hash, verified, account_id)
			VALUES (?, ?, '', TRUE, ?)
			RETURNING id
		");
		$stmt->execute([
			$gangdevUser['email'],
			$gangdevUser['display_name'],
			$gangdevId,
		]);
		$newId = $stmt->fetchColumn();
		dcops_login($newId);
	}
}

header('Location: https://dcops.co/');
exit();
?>
