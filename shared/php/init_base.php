<?php
/**
 * init_base.php — shared foundation for all init files.
 * Handles: error reporting, session setup, autoload, dotenv, env mapping, db connection.
 *
 * Usage: require this at the top of init.php / init_candor.php / init_dcops.php
 * then pass config via gangdev_init($config)
 */

use Dotenv\Dotenv;

function gangdev_init(array $config = []) {
	$defaults = [
		'domain' => '.gangdev.co',
		'session_lifetime' => 7 * 24 * 60 * 60,
		'debug' => true,
		'start_session' => true,
	];
	$c = array_merge($defaults, $config);

	// Error reporting
	if ($c['debug']) {
		ini_set('display_errors', 1);
		ini_set('display_startup_errors', 1);
		error_reporting(E_ALL);
	}

	// Session
	if ($c['start_session'] && session_status() === PHP_SESSION_NONE) {
		session_set_cookie_params([
			'lifetime' => $c['session_lifetime'],
			'path' => '/',
			'domain' => $c['domain'],
			'secure' => true,
			'httponly' => true,
			'samesite' => 'Lax'
		]);
		session_start();
	}

	// Autoload + dotenv
	require __DIR__ . '/../lib/composer/vendor/autoload.php';

	$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
	$dotenv->load();

	// ENV variable mapping (PG_* → DB_*)
	gangdev_map_env();

	// Database
	require_once __DIR__ . '/db.php';
}

/**
 * Map PG_* env vars to DB_* if not already set.
 * Covers both $_ENV and getenv() fallbacks.
 */
function gangdev_map_env() {
	$map = [
		'DB_HOST' => 'PG_HOST',
		'DB_PORT' => 'PG_PORT',
		'DB_NAME' => 'PG_DATABASE',
		'DB_USER' => 'PG_USER',
		'DB_PASSWORD' => 'PG_PASSWORD',
	];

	foreach ($map as $db_key => $pg_key) {
		if (!isset($_ENV[$db_key]) && isset($_ENV[$pg_key])) {
			$_ENV[$db_key] = $_ENV[$pg_key];
		}
		if (!isset($_ENV[$db_key])) {
			$_ENV[$db_key] = getenv($db_key) ?: '';
		}
	}
}

/**
 * Render a component via output buffering.
 */
function gangdev_render(string $path, array $vars = []): string {
	extract($vars);
	ob_start();
	include $path;
	return ob_get_clean();
}
