<?php
/**
 * admin.php — Admin-only management endpoints.
 * 
 * POST ?action=update_key   { "key": "RGAPI-..." }
 * POST ?action=toggle_public
 * GET  ?action=status       → { key_expired, key_prefix, key_set, is_public }
 */

require_once __DIR__ . '/../src/php/init.php';
require_once __DIR__ . '/riot.php';

header('Content-Type: application/json');

if (!lafter_is_admin()) {
	http_response_code(403);
	exit(json_encode(['error' => 'unauthorized']));
}

$action = $_GET['action'] ?? '';

match ($action) {
	'update_key'    => updateKey(),
	'toggle_public' => togglePublic(),
	'status'        => status(),
	default         => badAction(),
};

function updateKey(): void {
	$logFile = LAFTER_FLAG_DIR . '/.key_changes';
	$log = file_exists($logFile) ? json_decode(file_get_contents($logFile), true) : [];
	$log = array_filter($log, fn($t) => time() - $t < 3600);

	if (count($log) >= 5) {
		http_response_code(429);
		exit(json_encode(['error' => 'rate_limited', 'message' => 'Max 5 key changes per hour.']));
	}

	$input = json_decode(file_get_contents('php://input'), true);
	$key = trim($input['key'] ?? '');

	if (!preg_match('/^RGAPI-[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/', $key)) {
		http_response_code(400);
		exit(json_encode(['error' => 'invalid_format']));
	}

	$env = file_get_contents(LAFTER_ENV_FILE);
	$env = str_contains($env, 'RIOT_API_KEY=')
		? preg_replace('/^RIOT_API_KEY=.*$/m', "RIOT_API_KEY={$key}", $env)
		: $env . "\nRIOT_API_KEY={$key}\n";
	file_put_contents(LAFTER_ENV_FILE, $env);

	$riot = new RiotAPI();
	$riot->clearExpired();

	$log[] = time();
	file_put_contents($logFile, json_encode($log));

	echo json_encode(['success' => true]);
}

function togglePublic(): void {
	$nowPublic = !lafter_is_public();
	lafter_set_public($nowPublic);
	echo json_encode(['success' => true, 'is_public' => $nowPublic]);
}

function status(): void {
	$riot = new RiotAPI();
	$key = lafter_riot_key();

	echo json_encode([
		'key_expired' => $riot->isExpired(),
		'key_prefix'  => $key ? substr($key, 0, 12) . '...' : 'NOT SET',
		'key_set'     => !empty($key),
		'is_public'   => lafter_is_public(),
	]);
}

function badAction(): void {
	http_response_code(400);
	echo json_encode(['error' => 'invalid_action']);
}
