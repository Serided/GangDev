<?php
/**
 * init_candor.php — Candor app init.
 * Session auth, login/logout helpers, profile helpers.
 */
require_once __DIR__ . '/init_base.php';

gangdev_init([
	'domain' => '.candor.you',
	'session_lifetime' => 0,
]);

// Session validation
if (isset($_SESSION['candor_user_id'], $_SESSION['candor_session_token'])) {
	$stmt = $pdo->prepare("
		SELECT id, expires_at FROM candor.sessions
		WHERE user_id = ? AND session_token = ? LIMIT 1
	");
	$stmt->execute([$_SESSION['candor_user_id'], $_SESSION['candor_session_token']]);
	$sessionRow = $stmt->fetch();

	if (!$sessionRow || strtotime($sessionRow['expires_at']) <= time()) {
		if ($sessionRow) {
			$pdo->prepare("DELETE FROM candor.sessions WHERE id = ?")->execute([$sessionRow['id']]);
		}
		$_SESSION = [];
		session_destroy();
	}
} elseif (isset($_SESSION['candor_user_id']) || isset($_SESSION['candor_session_token'])) {
	$_SESSION = [];
	session_destroy();
}

// --- Auth helpers ---

function candor_current_user_id() {
	return isset($_SESSION['candor_user_id'], $_SESSION['candor_session_token'])
		? (int)$_SESSION['candor_user_id']
		: null;
}

function candor_login($user_id) {
	global $pdo;
	$token = bin2hex(random_bytes(32));
	$expiresAt = (new DateTimeImmutable('+7 days'))->format('Y-m-d H:i:s');

	$pdo->prepare("
		INSERT INTO candor.sessions (user_id, session_token, created_at, expires_at)
		VALUES (?, ?, NOW(), ?)
	")->execute([(int)$user_id, $token, $expiresAt]);

	$_SESSION['candor_user_id'] = (int)$user_id;
	$_SESSION['candor_session_token'] = $token;

	$u = candor_user_row($user_id);
	if ($u) {
		$_SESSION['candor_email'] = $u['email'];
		$_SESSION['candor_name'] = $u['display_name'] ?? ($u['username'] ?? '');
		$_SESSION['candor_username'] = $u['username'] ?? '';
	}
}

function candor_logout() {
	global $pdo;
	if (isset($_SESSION['candor_user_id'], $_SESSION['candor_session_token'])) {
		$pdo->prepare("DELETE FROM candor.sessions WHERE user_id = ? AND session_token = ?")
			->execute([(int)$_SESSION['candor_user_id'], $_SESSION['candor_session_token']]);
	}
	$_SESSION = [];
	session_destroy();
}

function candor_redirect($url) {
	header("Location: $url");
	exit;
}

// --- Data helpers ---

function candor_user_row($user_id) {
	global $pdo;
	$stmt = $pdo->prepare("SELECT id, email, username, display_name, email_verified::int AS email_verified FROM candor.users WHERE id = :id");
	$stmt->execute(['id' => $user_id]);
	return $stmt->fetch();
}

function candor_profile_row($user_id) {
	global $pdo;
	if (!isset($pdo)) return null;
	try {
		$stmt = $pdo->prepare("
			SELECT user_id, birthdate, height_cm, weight_kg, unit_system, timezone, country_code,
			       consent_health::int AS consent_health, onboarding_completed_at
			FROM candor.user_profiles WHERE user_id = :id LIMIT 1
		");
		$stmt->execute(['id' => $user_id]);
		return $stmt->fetch();
	} catch (Throwable $e) {
		try {
			$stmt = $pdo->prepare("
				SELECT user_id, birthdate, height_cm, weight_kg, unit_system,
				       consent_health::int AS consent_health, onboarding_completed_at
				FROM candor.user_profiles WHERE user_id = :id LIMIT 1
			");
			$stmt->execute(['id' => $user_id]);
			return $stmt->fetch();
		} catch (Throwable $inner) {
			return null;
		}
	}
}

function candor_profile_needs_setup($user_id) {
	$profile = candor_profile_row($user_id);
	return !$profile || empty($profile['birthdate']) || empty($profile['consent_health']);
}

// --- Page setup helper ---

function candor_page_setup(array $opts = []): array {
	$userId = candor_current_user_id();
	$user = $userId ? candor_user_row($userId) : null;
	$profile = $userId ? candor_profile_row($userId) : null;
	$name = $user['display_name'] ?? ($user['username'] ?? '');
	$email = $user['email'] ?? '';
	$authed = $userId && $user;

	return [
		'userId' => $userId,
		'user' => $user,
		'profile' => $profile,
		'name' => $name,
		'email' => $email,
		'authed' => $authed,
		'candorMeta' => $opts['meta'] ?? 'personal OS',
		'candorLead' => $opts['lead'] ?? '',
		'candorAuthed' => $authed,
		'candorName' => $name !== '' ? $name : $email,
		'candorShowMyOs' => $authed,
		'candorVersion' => $opts['version'] ?? 'v0.2',
		'candorNavClass' => $opts['navClass'] ?? '',
	];
}

// --- Guards ---

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
