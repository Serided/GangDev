<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_set_cookie_params([
	'lifetime' => 7 * 24 * 60 * 60,
	'path' => '/',
	'domain' => '.dcops.co',
	'secure' => true,
	'httponly' => true,
	'samesite' => 'Lax'
]);

if (session_status() == PHP_SESSION_NONE) session_start();

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

if ($_ENV['DB_HOST'] === '' || $_ENV['DB_NAME'] === '' || $_ENV['DB_USER'] === '') {
	http_response_code(500);
	exit;
}

require_once 'db.php';

$rootPath = $_ENV['ROOT_PATH'] ?? '';

function dcops_org_from_email(string $email): string
{
	$e = strtolower(trim($email));
	if (str_ends_with($e, '@milestone.tech')) return 'milestone';
	if (str_ends_with($e, '@meta.com')) return 'meta';
	return 'personal';
}

function is_dcops_company_email(string $email): bool
{
	$org = dcops_org_from_email($email);
	return $org === 'milestone' || $org === 'meta';
}

function dcops_redirect(string $url, int $code = 302): void
{
	header('Location: ' . $url, true, $code);
	exit;
}

function dcops_host(): string
{
	return strtolower($_SERVER['HTTP_HOST'] ?? '');
}

function dcops_uri(): string
{
	return $_SERVER['REQUEST_URI'] ?? '/';
}

function dcops_dashboard_host_for_org(string $org): string
{
	return match ($org) {
		'milestone' => 'dashboard.milestone.dcops.co',
		'meta' => 'dashboard.meta.dcops.co',
		default => 'dashboard.dcops.co'
	};
}

function dcops_enforce_org_dashboard_host(): void
{
	if (!isset($_SESSION['dcops_user_id'])) return;

	$org = $_SESSION['dcops_org'] ?? 'personal';
	$expected = dcops_dashboard_host_for_org($org);
	$current = dcops_host();

	if (!str_starts_with($current, 'dashboard.')) return;

	if ($current !== $expected) {
		dcops_redirect('https://' . $expected . dcops_uri());
	}
}

function dcops_require_login(): void
{
	if (!isset($_SESSION['dcops_user_id'])) {
		dcops_redirect('https://account.dcops.co/login/signin.php');
	}
}

function dcops_require_org(string $org): void
{
	dcops_require_login();
	if (($_SESSION['dcops_org'] ?? '') !== $org) {
		http_response_code(403);
		exit;
	}
}

function dcops_require_milestone(): void
{
	dcops_require_org('milestone');
}
