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

$autoload = '/var/www/gangdev/lib/composer/vendor/autoload.php';
if (is_file($autoload)) {
	require $autoload;
}

if (class_exists('Dotenv\\Dotenv')) {
	$roots = [
		'/var/www/gangdev/shared',
		'/var/www/gangdev',
	];

	foreach ($roots as $root) {
		if (is_file($root . '/.env')) {
			Dotenv\Dotenv::createImmutable($root)->safeLoad();
		}
	}
}

$pgUser = $_ENV['PG_USER'] ?? getenv('PG_USER') ?? '';
$pgHost = $_ENV['PG_HOST'] ?? getenv('PG_HOST') ?? '';
$pgDb = $_ENV['PG_DATABASE'] ?? getenv('PG_DATABASE') ?? '';
$pgPass = $_ENV['PG_PASSWORD'] ?? getenv('PG_PASSWORD') ?? '';
$pgPort = $_ENV['PG_PORT'] ?? getenv('PG_PORT') ?? '5432';

$pgHost = trim((string)$pgHost);
$pgDb = trim((string)$pgDb);
$pgUser = trim((string)$pgUser);
$pgPort = trim((string)$pgPort);

$invalidHost = ($pgHost === '') || str_contains($pgHost, '=') || str_contains($pgHost, ';') || str_contains($pgHost, ' ');
$invalidDb = ($pgDb === '') || str_contains($pgDb, '=') || str_contains($pgDb, ';') || str_contains($pgDb, ' ');
$invalidUser = ($pgUser === '') || str_contains($pgUser, '=') || str_contains($pgUser, ';') || str_contains($pgUser, ' ');
$invalidPort = ($pgPort === '') || !ctype_digit($pgPort);

if ($invalidHost || $invalidDb || $invalidUser || $invalidPort) {
	http_response_code(500);
	exit;
}

$dsn = "pgsql:host={$pgHost};port={$pgPort};dbname={$pgDb}";

$pdo = new PDO($dsn, $pgUser, (string)$pgPass, [
	PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
	PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
]);

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
