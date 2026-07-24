<?php
/**
 * api/index.php — Lafter API router.
 * Serves at: api.lafter.gg/ (Apache rewrites to this file)
 * 
 * GET /account/{name}/{tag}       → Riot ID → PUUID
 * GET /summoner/{puuid}           → Profile
 * GET /league/{summonerId}        → Rank
 * GET /mastery/{puuid}            → Champion mastery
 * GET /matches/{puuid}?count=20   → Match IDs
 * GET /match/{matchId}            → Match detail
 * GET /spectator/{puuid}          → Active game
 * GET /clash/{puuid}              → Clash team
 * GET /rotation                   → Free rotation
 * GET /status                     → Server status
 * GET /health                     → Key health check
 */

require_once __DIR__ . '/../src/php/init.php';
require_once __DIR__ . '/riot.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

// Dev mode gate: only admin can use API endpoints
if (!lafter_can_use_api()) {
	http_response_code(403);
	exit(json_encode(['error' => 'dev_mode', 'message' => 'API access restricted during development.']));
}

// Parse path
$path = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');
$path = preg_replace('#^api/?#', '', $path);
$seg = explode('/', $path);

$endpoint = $seg[0] ?? '';
$p1 = $seg[1] ?? '';
$p2 = $seg[2] ?? '';

$riot = new RiotAPI();

// Block all endpoints if key is dead (except health)
if ($riot->isExpired() && $endpoint !== 'health') {
	http_response_code(503);
	exit(json_encode(['error' => 'key_expired', 'retry_after' => 300]));
}

$result = match ($endpoint) {
	'account'   => $p1 && $p2 ? $riot->accountByRiotId($p1, $p2) : err('account/{name}/{tag}'),
	'summoner'  => $p1 ? $riot->summoner($p1) : err('summoner/{puuid}'),
	'league'    => $p1 ? $riot->league($p1) : err('league/{summonerId}'),
	'mastery'   => $p1 ? $riot->mastery($p1) : err('mastery/{puuid}'),
	'matches'   => $p1 ? $riot->matchHistory($p1, (int)($_GET['count'] ?? 20), (int)($_GET['start'] ?? 0)) : err('matches/{puuid}'),
	'match'     => $p1 ? $riot->match($p1) : err('match/{matchId}'),
	'spectator' => $p1 ? $riot->spectator($p1) : err('spectator/{puuid}'),
	'clash'     => $p1 ? $riot->clash($p1) : err('clash/{puuid}'),
	'rotation'  => $riot->rotation(),
	'status'    => $riot->serverStatus(),
	'health'    => ['status' => $riot->isExpired() ? 'degraded' : 'ok', 'key_expired' => $riot->isExpired()],
	default     => err404($endpoint),
};

echo json_encode($result);

// === Helpers ===

function err(string $usage): array {
	http_response_code(400);
	return ['error' => 'bad_request', 'usage' => "/{$usage}"];
}

function err404(string $ep): array {
	http_response_code(404);
	return ['error' => 'not_found', 'endpoint' => "/{$ep}"];
}
