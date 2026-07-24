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

// Set search path to include lafter schema
global $pdo;
$pdo->exec("SET search_path TO lafter, gangdev, public");

// === Lafter Constants ===
define('LAFTER_ENV_FILE', '/var/www/gangdev/shared/.env');
define('LAFTER_FLAG_DIR', '/var/www/gangdev/lafter/api');

// === Helpers ===

function lafter_riot_key(): string {
	return $_ENV['RIOT_API_KEY'] ?? '';
}

// Auth helpers
require_once __DIR__ . '/auth.php';

// Feature gates
require_once __DIR__ . '/gates.php';
