<?php
/**
 * Lafter init — extends shared gangdev init_base.
 * Single source of truth for Lafter-specific config.
 */

require_once '/var/www/gangdev/shared/php/init_base.php';

gangdev_init([
	'domain' => '.lafter.gg',
	'session_lifetime' => 7 * 24 * 60 * 60,
	'debug' => true,
]);

// === Lafter Constants ===
define('LAFTER_ENV_FILE', '/var/www/gangdev/shared/.env');
define('LAFTER_FLAG_DIR', '/var/www/gangdev/lafter/api');

// === Helpers ===

function lafter_is_admin(): bool {
	return isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin';
}

function lafter_riot_key(): string {
	return $_ENV['RIOT_API_KEY'] ?? '';
}
