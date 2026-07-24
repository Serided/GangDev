<?php
/**
 * GangDev Auth — generates a one-time auth code for cross-product sign-in.
 * Usage: https://gangdev.co/auth?app=candor
 */
require_once '/var/www/gangdev/main/src/php/init.php';

$callbacks = [
	'candor' => 'https://account.candor.you/login/callback.php',
	'dcops'  => 'https://account.dcops.co/login/callback.php',
	'lafter' => 'https://lafter.gg/account/login/callback.php',
];

$app = trim($_GET['app'] ?? '');

if (!$app || !isset($callbacks[$app])) {
	http_response_code(400);
	die('Invalid app.');
}

// If not logged in, redirect to login with a return URL
if (!isset($_SESSION['user_id'])) {
	$return = urlencode("https://gangdev.co/auth?app=" . urlencode($app));
	header("Location: https://account.gangdev.co/login/signin.php?redirect=" . $return);
	exit();
}

// Generate one-time auth code
$code = bin2hex(random_bytes(32));

$stmt = $pdo->prepare("INSERT INTO auth_codes (code, user_id, app) VALUES (?, ?, ?)");
$stmt->execute([$code, $_SESSION['user_id'], $app]);

// Redirect to product callback with the code
header("Location: " . $callbacks[$app] . "?code=" . urlencode($code));
exit();
?>
