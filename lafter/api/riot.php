<?php
/**
 * riot.php — Riot API client for Lafter.
 * All outbound Riot calls, rate limiting, key expiry detection.
 * 
 * Depends on: lafter_riot_key(), LAFTER_FLAG_DIR (from src/php/init.php)
 */

class RiotAPI {
	private string $key;
	private string $platform;   // e.g. https://na1.api.riotgames.com
	private string $regional;   // e.g. https://americas.api.riotgames.com
	private bool $expired = false;

	private static array $requestLog = [];
	private const RATE_1S = 20;
	private const RATE_2M = 100;

	public function __construct(string $platform = 'na1', string $region = 'americas') {
		$this->key = lafter_riot_key();
		$this->platform = "https://{$platform}.api.riotgames.com";
		$this->regional = "https://{$region}.api.riotgames.com";
		$this->expired = $this->isExpired();
	}

	// === Key Status ===

	public function isExpired(): bool {
		if ($this->expired) return true;
		return file_exists(LAFTER_FLAG_DIR . '/.key_expired');
	}

	public function markExpired(): void {
		$this->expired = true;
		file_put_contents(LAFTER_FLAG_DIR . '/.key_expired', date('c'));
	}

	public function clearExpired(): void {
		$flag = LAFTER_FLAG_DIR . '/.key_expired';
		if (file_exists($flag)) unlink($flag);
		$this->expired = false;
		$this->key = lafter_riot_key();
	}

	// === Core Request ===

	private function request(string $url): array {
		if ($this->expired) {
			return ['error' => 'key_expired', 'status' => 403, 'message' => 'API key expired. Replace via admin panel.'];
		}

		$this->throttle();

		$ch = curl_init();
		curl_setopt_array($ch, [
			CURLOPT_URL => $url,
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_HTTPHEADER => ["X-Riot-Token: {$this->key}"],
			CURLOPT_TIMEOUT => 10,
			CURLOPT_FOLLOWLOCATION => true,
		]);

		$body = curl_exec($ch);
		$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		$err = curl_error($ch);
		curl_close($ch);

		self::$requestLog[] = microtime(true);

		if ($err) return ['error' => 'network', 'message' => $err];

		$data = json_decode($body, true);

		return match (true) {
			$code === 200 => ['success' => true, 'data' => $data],
			$code === 403 => $this->handleExpired(),
			$code === 404 => ['error' => 'not_found', 'status' => 404],
			$code === 429 => $this->handleRateLimit($url, $data),
			default => ['error' => 'api_error', 'status' => $code, 'message' => $data['status']['message'] ?? 'Unknown'],
		};
	}

	private function handleExpired(): array {
		$this->markExpired();
		return ['error' => 'key_expired', 'status' => 403, 'message' => 'API key expired.'];
	}

	private function handleRateLimit(string $url, ?array $data): array {
		$wait = (int)($data['Retry-After'] ?? 5);
		sleep(min($wait, 30));
		return $this->request($url);
	}

	// === Rate Limiter (sliding window) ===

	private function throttle(): void {
		$now = microtime(true);
		self::$requestLog = array_filter(self::$requestLog, fn($t) => $now - $t < 120);

		if (count(self::$requestLog) >= self::RATE_2M) {
			$wait = 120 - ($now - min(self::$requestLog)) + 0.1;
			if ($wait > 0) usleep((int)($wait * 1_000_000));
		}

		$last1s = array_filter(self::$requestLog, fn($t) => $now - $t < 1);
		if (count($last1s) >= self::RATE_1S) {
			usleep(100_000);
		}
	}

	// === Endpoints ===

	public function accountByRiotId(string $name, string $tag): array {
		return $this->request("{$this->regional}/riot/account/v1/accounts/by-riot-id/" . rawurlencode($name) . '/' . rawurlencode($tag));
	}

	public function summoner(string $puuid): array {
		return $this->request("{$this->platform}/lol/summoner/v4/summoners/by-puuid/{$puuid}");
	}

	public function league(string $summonerId): array {
		return $this->request("{$this->platform}/lol/league/v4/entries/by-summoner/{$summonerId}");
	}

	public function mastery(string $puuid): array {
		return $this->request("{$this->platform}/lol/champion-mastery/v4/champion-masteries/by-puuid/{$puuid}");
	}

	public function matchHistory(string $puuid, int $count = 20, int $start = 0): array {
		return $this->request("{$this->regional}/lol/match/v5/matches/by-puuid/{$puuid}/ids?start={$start}&count={$count}");
	}

	public function match(string $matchId): array {
		return $this->request("{$this->regional}/lol/match/v5/matches/{$matchId}");
	}

	public function spectator(string $puuid): array {
		return $this->request("{$this->platform}/lol/spectator/v5/active-games/by-summoner/{$puuid}");
	}

	public function clash(string $puuid): array {
		return $this->request("{$this->platform}/lol/clash/v1/players/by-puuid/{$puuid}");
	}

	public function rotation(): array {
		return $this->request("{$this->platform}/lol/platform/v3/champion-rotations");
	}

	public function serverStatus(): array {
		return $this->request("{$this->platform}/lol/status/v4/platform-data");
	}
}
