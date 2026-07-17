<?php
/**
 * init_dcops.php — DCOPS app init.
 * Session auth, login/logout helpers, org detection.
 */
require_once __DIR__ . '/init_base.php';

gangdev_init([
	'domain' => '.dcops.co',
	'session_lifetime' => 7 * 24 * 60 * 60,
]);

// Session validation
if (isset($_SESSION['dcops_user_id'], $_SESSION['dcops_session_token'])) {
	$stmt = $pdo->prepare("
		SELECT id, expires_at FROM dcops.sessions
		WHERE user_id = ? AND session_token = ? LIMIT 1
	");
	$stmt->execute([$_SESSION['dcops_user_id'], $_SESSION['dcops_session_token']]);
	$sessionRow = $stmt->fetch();

	if (!$sessionRow || strtotime($sessionRow['expires_at']) <= time()) {
		if ($sessionRow) {
			$pdo->prepare("DELETE FROM dcops.sessions WHERE id = ?")->execute([$sessionRow['id']]);
		}
		$_SESSION = [];
		session_destroy();
	}
} elseif (isset($_SESSION['dcops_user_id']) || isset($_SESSION['dcops_session_token'])) {
	$_SESSION = [];
	session_destroy();
}

// --- Auth helpers ---

function dcops_current_user_id() {
	return isset($_SESSION['dcops_user_id'], $_SESSION['dcops_session_token'])
		? (int)$_SESSION['dcops_user_id']
		: null;
}

function dcops_login($user_id) {
	global $pdo;
	$token = bin2hex(random_bytes(32));
	$expiresAt = (new DateTimeImmutable('+7 days'))->format('Y-m-d H:i:s');

	$pdo->prepare("
		INSERT INTO dcops.sessions (user_id, session_token, created_at, expires_at)
		VALUES (?, ?, NOW(), ?)
	")->execute([(int)$user_id, $token, $expiresAt]);

	$_SESSION['dcops_user_id'] = (int)$user_id;
	$_SESSION['dcops_session_token'] = $token;

	$u = dcops_user_row($user_id);
	if ($u) {
		$_SESSION['dcops_email'] = $u['email'];
		$_SESSION['dcops_name'] = $u['real_name'] ?? '';
		$_SESSION['dcops_org'] = $u['organization'] ?? 'personal';
	}
}

function dcops_logout() {
	global $pdo;
	if (isset($_SESSION['dcops_user_id'], $_SESSION['dcops_session_token'])) {
		$pdo->prepare("DELETE FROM dcops.sessions WHERE user_id = ? AND session_token = ?")
			->execute([(int)$_SESSION['dcops_user_id'], $_SESSION['dcops_session_token']]);
	}
	$_SESSION = [];
	session_destroy();
}

function dcops_redirect($url) {
	header("Location: $url");
	exit;
}

// --- Data helpers ---

function dcops_user_row($user_id) {
	global $pdo;
	$stmt = $pdo->prepare("SELECT id, email, real_name, organization, verified FROM dcops.users WHERE id = :id");
	$stmt->execute(['id' => $user_id]);
	return $stmt->fetch();
}

function dcops_org_from_email(string $email): string {
	$domain = strtolower(explode('@', $email)[1] ?? '');
	$orgMap = [
		'milestone.com' => 'milestone',
	];
	return $orgMap[$domain] ?? 'personal';
}

// --- Guards ---

function dcops_require_login() {
	if (!dcops_current_user_id()) {
		dcops_redirect('https://account.dcops.co/login/signin.php');
	}
}

function dcops_require_verified() {
	dcops_require_login();
	$u = dcops_user_row(dcops_current_user_id());
	if (!$u || !$u['verified']) {
		dcops_redirect('https://account.dcops.co/login/verify.php');
	}
}
