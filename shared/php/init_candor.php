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

require __DIR__ . '/../lib/composer/vendor/autoload.php';

use Dotenv\Dotenv;
$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

if (!isset($_ENV['DB_HOST']) && isset($_ENV['PG_HOST'])) $_ENV['DB_HOST'] = $_ENV['PG_HOST'];
if (!isset($_ENV['DB_PORT']) && isset($_ENV['PG_PORT'])) $_ENV['DB_PORT'] = $_ENV['PG_PORT'];
if (!isset($_ENV['DB_NAME']) && isset($_ENV['PG_DATABASE'])) $_ENV['DB_NAME'] = $_ENV['PG_DATABASE'];
if (!isset($_ENV['DB_USER']) && isset($_ENV['PG_USER'])) $_ENV['DB_USER'] = $_ENV['PG_USER'];
if (!isset($_ENV['DB_PASSWORD']) && isset($_ENV['PG_PASSWORD'])) $_ENV['DB_PASSWORD'] = $_ENV['PG_PASSWORD'];

if (!isset($_ENV['DB_HOST'])) $_ENV['DB_HOST'] = getenv('DB_HOST') ?: '';
if (!isset($_ENV['DB_PORT'])) $_ENV['DB_PORT'] = getenv('DB_PORT') ?: '';
if (!isset($_ENV['DB_NAME'])) $_ENV['DB_NAME'] = getenv('DB_NAME') ?: '';
if (!isset($_ENV['DB_USER'])) $_ENV['DB_USER'] = getenv('DB_USER') ?: '';
if (!isset($_ENV['DB_PASSWORD'])) $_ENV['DB_PASSWORD'] = getenv('DB_PASSWORD') ?: '';

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
		$_SESSION['candor_name'] = $u['display_name'] ?? ($u['username'] ?? '');
		$_SESSION['candor_username'] = $u['username'] ?? '';
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
	$stmt = $pdo->prepare("SELECT id, email, username, display_name, email_verified::int AS email_verified FROM candor.users WHERE id = :id");
	$stmt->execute(['id' => $user_id]);
	return $stmt->fetch();
}

function candor_profile_row($user_id) {
	global $pdo;
	if (!isset($pdo)) {
		return null;
	}
	try {
		$stmt = $pdo->prepare("
			SELECT user_id, birthdate, height_cm, weight_kg,
			       unit_system,
			       timezone,
			       country_code,
			       consent_health::int AS consent_health,
			       onboarding_completed_at
			FROM candor.user_profiles
			WHERE user_id = :id
			LIMIT 1
		");
		$stmt->execute(['id' => $user_id]);
		return $stmt->fetch();
	} catch (Throwable $e) {
		try {
			$stmt = $pdo->prepare("
				SELECT user_id, birthdate, height_cm, weight_kg,
				       unit_system,
				       consent_health::int AS consent_health,
				       onboarding_completed_at
				FROM candor.user_profiles
				WHERE user_id = :id
				LIMIT 1
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
	if (!$profile) {
		return true;
	}
	if (empty($profile['birthdate'])) {
		return true;
	}
	if (empty($profile['consent_health'])) {
		return true;
	}
	return false;
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
