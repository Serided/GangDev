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
