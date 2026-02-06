<?php

if (session_status() === PHP_SESSION_NONE) {
	session_set_cookie_params([
		'lifetime' => 0,
		'path' => '/',
		'domain' => '.candor.you',
		'secure' => true,
		'httponly' => true,
		'samesite' => 'Lax'
	]);
	session_start();
}

require_once '/var/www/gangdev/shared/php/db.php';

if (isset($_SESSION['candor_user_id'], $_SESSION['candor_session_token'])) {
	$stmt = $pdo->prepare("
		SELECT id, expires_at
		FROM candor.sessions
		WHERE user_id = ? AND session_token = ?
		LIMIT 1
	");
	$stmt->execute([$_SESSION['candor_user_id'], $_SESSION['candor_session_token']]);
	$sessionRow = $stmt->fetch();

	if (!$sessionRow || strtotime($sessionRow['expires_at']) <= time()) {
		if ($sessionRow) {
			$del = $pdo->prepare("DELETE FROM candor.sessions WHERE id = ?");
			$del->execute([$sessionRow['id']]);
		}
		$_SESSION = [];
		session_destroy();
	}
} elseif (isset($_SESSION['candor_user_id']) || isset($_SESSION['candor_session_token'])) {
	$_SESSION = [];
	session_destroy();
}

function candor_current_user_id() {
	if (!isset($_SESSION['candor_user_id'], $_SESSION['candor_session_token'])) {
		return null;
	}
	return (int)$_SESSION['candor_user_id'];
}

function candor_login($user_id) {
	global $pdo;
	$token = bin2hex(random_bytes(32));
	$expiresAt = (new DateTimeImmutable('+7 days'))->format('Y-m-d H:i:s');

	$stmt = $pdo->prepare("
		INSERT INTO candor.sessions (user_id, session_token, created_at, expires_at)
		VALUES (?, ?, NOW(), ?)
	");
	$stmt->execute([(int)$user_id, $token, $expiresAt]);

	$_SESSION['candor_user_id'] = (int)$user_id;
	$_SESSION['candor_session_token'] = $token;

	$u = candor_user_row($user_id);
	if ($u) {
		$_SESSION['candor_email'] = $u['email'];
		$_SESSION['candor_name'] = $u['username'] ?? '';
	}
}

function candor_logout() {
	global $pdo;
	if (isset($_SESSION['candor_user_id'], $_SESSION['candor_session_token'])) {
		$stmt = $pdo->prepare("DELETE FROM candor.sessions WHERE user_id = ? AND session_token = ?");
		$stmt->execute([(int)$_SESSION['candor_user_id'], $_SESSION['candor_session_token']]);
	}
	$_SESSION = [];
	session_destroy();
}

function candor_redirect($url) {
	header("Location: $url");
	exit;
}

function candor_user_row($user_id) {
	global $pdo;
	$stmt = $pdo->prepare("SELECT id, email, username, email_verified::int AS email_verified FROM candor.users WHERE id = :id");
	$stmt->execute(['id' => $user_id]);
	return $stmt->fetch();
}

function candor_require_login() {
	if (!candor_current_user_id()) {
		candor_redirect('https://account.candor.you/login/signin.php');
	}
}

function candor_require_verified() {
	candor_require_login();
	$u = candor_user_row(candor_current_user_id());
	if (!$u || !$u['email_verified']) {
		candor_redirect('https://account.candor.you/login/verify.php');
	}
}
