<?php
require_once '/var/www/gangdev/shared/php/init_dcops.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	header('Location: /login/signin.php');
	exit;
}

$userId = (int)($_SESSION['dcops_login_user_id'] ?? 0);
$code = trim($_POST['code'] ?? '');

if ($userId <= 0) {
	header('Location: /login/signin.php');
	exit;
}

if ($code === '' || !preg_match('/^\d{6}$/', $code)) {
	header('Location: /login/verify_login.php?error=' . urlencode('Enter a valid 6-digit code.'));
	exit;
}

if (!isset($pdo)) {
	header('Location: /login/signin.php?error=' . urlencode('Server error.'));
	exit;
}

$stmt = $pdo->prepare("
	SELECT user_id, code_hash, expires_at
	FROM dcops.login_otps
	WHERE user_id = ?
	ORDER BY expires_at DESC
	LIMIT 1
");
$stmt->execute([$userId]);
$otp = $stmt->fetch();

if (!$otp || strtotime($otp['expires_at']) <= time()) {
	header('Location: /login/verify_login.php?error=' . urlencode('Code expired. Sign in again.'));
	exit;
}

if (!password_verify($code, $otp['code_hash'])) {
	header('Location: /login/verify_login.php?error=' . urlencode('Incorrect code.'));
	exit;
}

$pdo->prepare("DELETE FROM dcops.login_otps WHERE user_id = ?")->execute([$userId]);

$stmt = $pdo->prepare("
	SELECT id, email, real_name, organization, admin_rank, trust_state, effective_rank
	FROM dcops.users
	WHERE id = ?
	LIMIT 1
");
$stmt->execute([$userId]);
$user = $stmt->fetch();

if (!$user) {
	header('Location: /login/signin.php?error=' . urlencode('Account not found.'));
	exit;
}

unset($_SESSION['dcops_login_user_id'], $_SESSION['dcops_login_email']);

$_SESSION['dcops_user_id'] = (int)$user['id'];
$_SESSION['dcops_name'] = $user['real_name'];
$_SESSION['dcops_email'] = $user['email'];
$_SESSION['dcops_org'] = $user['organization'];
$_SESSION['dcops_admin_rank'] = (int)$user['admin_rank'];
$_SESSION['dcops_trust_state'] = (int)$user['trust_state'];
$_SESSION['dcops_effective_rank'] = (int)$user['effective_rank'];

$org = $_SESSION['dcops_org'] ?? 'personal';

$target = match ($org) {
	'milestone' => 'https://dashboard.milestone.dcops.co',
	'meta' => 'https://dashboard.meta.dcops.co',
	default => 'https://dashboard.dcops.co',
};

header('Location: ' . $target . '/');
exit;
