<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_set_cookie_params([
	'lifetime' => 604800,
	'path' => '/',
	'domain' => '.dcops.co',
	'secure' => true,
	'httponly' => true,
	'samesite' => 'Lax',
]);

if (session_status() === PHP_SESSION_NONE) {
	session_start();
}

$pdo = $pdo ?? null;

$dcopsDbPaths = [
	'/var/www/gangdev/shared/php/db.php',
	'/var/www/gangdev/shared/db.php',
	'/var/www/gangdev/dcops/php/db.php',
	'/var/www/gangdev/dcops/account/php/db.php',
];

foreach ($dcopsDbPaths as $p) {
	if (is_file($p)) {
		require_once $p;
		if (isset($pdo) && ($pdo instanceof PDO)) {
			break;
		}
	}
}

function dcops_env_load(string $path): void {
	if (!is_file($path) || !is_readable($path)) return;
	$lines = file($path, FILE_IGNORE_NEW_LINES);
	if (!$lines) return;

	foreach ($lines as $line) {
		$line = trim($line);
		if ($line === '' || str_starts_with($line, '#')) continue;
		$pos = strpos($line, '=');
		if ($pos === false) continue;

		$key = trim(substr($line, 0, $pos));
		$val = trim(substr($line, $pos + 1));

		if ($key === '') continue;

		if ((str_starts_with($val, '"') && str_ends_with($val, '"')) || (str_starts_with($val, "'") && str_ends_with($val, "'"))) {
			$val = substr($val, 1, -1);
		}

		if (getenv($key) === false) {
			putenv($key . '=' . $val);
			$_ENV[$key] = $val;
		}
	}
}

if (!isset($pdo) || !($pdo instanceof PDO)) {
	dcops_env_load('/var/www/gangdev/shared/.env');

	$pgUser = getenv('PG_USER') ?: '';
	$pgHost = getenv('PG_HOST') ?: '';
	$pgDb = getenv('PG_DATABASE') ?: '';
	$pgPass = getenv('PG_PASSWORD') ?: '';
	$pgPort = getenv('PG_PORT') ?: '5432';

	if ($pgUser !== '' && $pgHost !== '' && $pgDb !== '') {
		$dsn = "pgsql:host={$pgHost};port={$pgPort};dbname={$pgDb}";
		$pdo = new PDO($dsn, $pgUser, $pgPass, [
			PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
			PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
		]);
	}
}

if (!isset($pdo) || !($pdo instanceof PDO)) {
	http_response_code(500);
	exit;
}

function dcops_redirect(string $url, int $code = 302): void {
	header('Location: ' . $url, true, $code);
	exit;
}

function dcops_host(): string {
	return strtolower($_SERVER['HTTP_HOST'] ?? '');
}

function dcops_uri(): string {
	return $_SERVER['REQUEST_URI'] ?? '/';
}

function dcops_dashboard_host_for_org(string $org): string {
	return match ($org) {
		'milestone' => 'dashboard.milestone.dcops.co',
		'meta' => 'dashboard.meta.dcops.co',
		default => 'dashboard.dcops.co',
	};
}

function dcops_enforce_org_dashboard_host(): void {
	if (!isset($_SESSION['dcops_user_id'])) return;

	$org = $_SESSION['dcops_org'] ?? 'personal';
	$expected = dcops_dashboard_host_for_org($org);
	$current = dcops_host();

	if (!str_starts_with($current, 'dashboard.')) return;

	if ($current !== $expected) {
		dcops_redirect('https://' . $expected . dcops_uri());
	}
}

function dcops_require_login(): void {
	if (!isset($_SESSION['dcops_user_id'])) {
		dcops_redirect('https://account.dcops.co/login/signin.php');
	}
}

function dcops_require_org(string $org): void {
	dcops_require_login();
	if (($_SESSION['dcops_org'] ?? '') !== $org) {
		http_response_code(403);
		exit;
	}
}

function dcops_require_milestone(): void {
	dcops_require_org('milestone');
}
