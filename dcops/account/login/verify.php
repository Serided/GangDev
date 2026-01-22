<?php
require_once '/var/www/gangdev/shared/php/init_dcops.php';

$token = trim($_GET['token'] ?? '');

if ($token === '') {
	header('Location: /login/signup.php?error=' . urlencode('Missing token.'));
	exit;
}

$stmt = $pdo->prepare("
    SELECT id, email, real_name, password_hash, organization
    FROM dcops.pending_users
    WHERE verification_token = ?
      AND token_expires > NOW()
    LIMIT 1
");
$stmt->execute([$token]);
$pending = $stmt->fetch();

if (!$pending) {
	header('Location: /login/signup.php?error=' . urlencode('Invalid or expired token.'));
	exit;
}

$org = $pending['organization'] ?? '';
if (!in_array($org, ['milestone', 'meta', 'personal'], true)) {
	header('Location: /login/signup.php?error=' . urlencode('Account state invalid. Contact admin.'));
	exit;
}

$adminRank = 2;
$trustState = 2;
$effectiveRank = min($adminRank, $trustState);

$pdo->beginTransaction();

try {
	$stmt = $pdo->prepare("SELECT 1 FROM dcops.users WHERE email = ? LIMIT 1");
	$stmt->execute([$pending['email']]);

	if ($stmt->fetchColumn()) {
		$del = $pdo->prepare("DELETE FROM dcops.pending_users WHERE id = ?");
		$del->execute([$pending['id']]);
		$pdo->commit();
		header('Location: /login/signin.php?ok=' . urlencode('Account already verified. Sign in.'));
		exit;
	}

	$ins = $pdo->prepare("
        INSERT INTO dcops.users (email, real_name, password_hash, verified, organization, admin_rank, trust_state, effective_rank)
        VALUES (?, ?, ?, TRUE, ?, ?, ?, ?)
    ");
	$ins->execute([
		$pending['email'],
		$pending['real_name'],
		$pending['password_hash'],
		$org,
		$adminRank,
		$trustState,
		$effectiveRank
	]);

	$del = $pdo->prepare("DELETE FROM dcops.pending_users WHERE id = ?");
	$del->execute([$pending['id']]);

	$pdo->commit();
} catch (Throwable $e) {
	$pdo->rollBack();
	header('Location: /login/signup.php?error=' . urlencode('Verification failed.'));
	exit;
}

header('Location: /login/signin.php?ok=' . urlencode('Email verified. You can sign in.'));
exit;
