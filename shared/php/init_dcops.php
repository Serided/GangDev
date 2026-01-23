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

function dcops_dashboard_base_for_org(string $org): string {
	return match ($org) {
		'milestone' => 'dashboard.milestone.dcops.co',
		'meta'      => 'dashboard.meta.dcops.co',
		default     => 'dashboard.dcops.co',
	};
}

function dcops_enforce_org_dashboard_host(): void {
	if (!isset($_SESSION['dcops_user_id'])) return;

	$org = $_SESSION['dcops_org'] ?? 'personal';
	$expected = dcops_dashboard_base_for_org($org);

	$host = strtolower($_SERVER['HTTP_HOST'] ?? '');
	$path = $_SERVER['REQUEST_URI'] ?? '/';

	// Only enforce when user is on any dashboard host
	$isDashboard = str_starts_with($host, 'dashboard.');
	if (!$isDashboard) return;

	if ($host !== $expected) {
		$scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'https';
		header('Location: ' . $scheme . '://' . $expected . $path, true, 302);
		exit;
	}
}

dcops_enforce_org_dashboard_host();

require __DIR__ . '/../lib/composer/vendor/autoload.php';

use Dotenv\Dotenv;
$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

require_once 'db.php';

$rootPath = $_ENV['ROOT_PATH'] ?? '';

function is_dcops_company_email(string $email): bool
{
	return dcops_org_from_email($email) !== null;
}

function dcops_org_from_email(string $email): string
{
	$e = strtolower(trim($email));

	if (str_ends_with($e, '@milestone.tech')) return 'milestone';
	if (str_ends_with($e, '@meta.com')) return 'meta';

	return 'personal';
}

