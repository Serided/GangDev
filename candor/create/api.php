<?php
require_once '/var/www/gangdev/candor/src/php/init.php';

set_exception_handler(function (Throwable $e) {
	if (!headers_sent()) {
		header('Content-Type: application/json');
		http_response_code(500);
	}
	echo json_encode([
		'error' => 'server_error',
		'message' => $e->getMessage(),
	]);
	exit;
});

header('Content-Type: application/json');

if (!isset($pdo)) {
	http_response_code(500);
	echo json_encode(['error' => 'db_unavailable']);
	exit;
}

$userId = candor_current_user_id();
if (!$userId) {
	http_response_code(401);
	echo json_encode(['error' => 'unauthorized']);
	exit;
}

$user = candor_user_row($userId);
if (!$user || (int)$user['email_verified'] !== 1) {
	http_response_code(403);
	echo json_encode(['error' => 'forbidden']);
	exit;
}

$raw = file_get_contents('php://input');
$json = json_decode($raw, true);
$payload = is_array($json) ? $json : [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	$payload = array_merge($_POST, $payload);
}

$action = $payload['action'] ?? ($_GET['action'] ?? '');

function respond($data, $code = 200) {
	http_response_code($code);
	echo json_encode($data);
	exit;
}

function clean_text($value, $max) {
	$text = trim((string)$value);
	if ($text === '') return '';
	if (function_exists('mb_substr')) {
		return mb_substr($text, 0, $max);
	}
	return substr($text, 0, $max);
}

function clean_time($value) {
	$time = trim((string)$value);
	if ($time === '') return '';
	if (!preg_match('/^\d{2}:\d{2}$/', $time)) return '';
	return $time;
}

function clean_color($value) {
	$raw = trim((string)$value);
	if ($raw === '') return '';
	if ($raw[0] !== '#') {
		$raw = '#' . $raw;
	}
	if (!preg_match('/^#[0-9a-fA-F]{6}$/', $raw)) return '';
	return strtolower($raw);
}

function shift_name_key($value) {
	$text = trim((string)$value);
	if ($text === '') return '';
	if (function_exists('mb_strtolower')) {
		return mb_strtolower($text);
	}
	return strtolower($text);
}

function find_matching_shift(PDO $pdo, $userId, $nameKey, $excludeId = null) {
	$sql = "
		SELECT id, name, start_time, end_time, commute_before, commute_after, is_default
		FROM candor.work_shifts
		WHERE user_id = ?
			AND COALESCE(LOWER(TRIM(name)), '') = ?
	";
	$params = [
		(int)$userId,
		$nameKey,
	];
	if ($excludeId !== null) {
		$sql .= " AND id <> ?";
		$params[] = (int)$excludeId;
	}
	$sql .= " LIMIT 1";
	$stmt = $pdo->prepare($sql);
	$stmt->execute($params);
	return $stmt->fetch(PDO::FETCH_ASSOC);
}

function clean_block_type($value) {
	$raw = trim((string)$value);
	$allowed = ['routine', 'work', 'focus', 'custom'];
	return in_array($raw, $allowed, true) ? $raw : 'routine';
}

function clean_anchor($value) {
	$raw = trim((string)$value);
	$allowed = ['morning', 'evening', 'custom'];
	return in_array($raw, $allowed, true) ? $raw : 'custom';
}

function clean_days($value) {
	$days = [];
	$push = function ($day) use (&$days) {
		$dayValue = is_numeric($day) ? (int)$day : -1;
		if ($dayValue < 0 || $dayValue > 6) return;
		if (!in_array($dayValue, $days, true)) {
			$days[] = $dayValue;
		}
	};

	if (is_array($value)) {
		foreach ($value as $item) {
			$push($item);
		}
		sort($days);
		return $days;
	}

	if (is_numeric($value)) {
		$push($value);
		sort($days);
		return $days;
	}

	$raw = trim((string)$value);
	if ($raw === '') return [];
	if ($raw[0] === '[') {
		$decoded = json_decode($raw, true);
		if (is_array($decoded)) {
			return clean_days($decoded);
		}
	}

	$parts = preg_split('/[\s,]+/', $raw);
	if (!$parts) return [];
	foreach ($parts as $part) {
		$push($part);
	}
	sort($days);
	return $days;
}

function clean_tasks($value) {
	$items = [];
	$push = function ($title, $minutes = null) use (&$items) {
		$clean = clean_text($title, 120);
		if ($clean === '') return;
		$mins = is_numeric($minutes) ? (int)$minutes : null;
		if ($mins !== null && $mins <= 0) {
			$mins = null;
		}
		$items[] = ['title' => $clean, 'minutes' => $mins];
	};

	if (is_array($value)) {
		foreach ($value as $item) {
			if (is_array($item)) {
				$push($item['title'] ?? ($item['text'] ?? ''), $item['minutes'] ?? ($item['duration'] ?? null));
			} else {
				$push($item, null);
			}
			if (count($items) >= 24) break;
		}
		return $items;
	}

	$raw = trim((string)$value);
	if ($raw === '') return [];
	if ($raw[0] === '[') {
		$decoded = json_decode($raw, true);
		if (is_array($decoded)) {
			return clean_tasks($decoded);
		}
	}

	$parts = preg_split('/[\r\n,]+/', $raw);
	if (!$parts) return [];
	foreach ($parts as $part) {
		$push($part, null);
		if (count($items) >= 24) break;
	}
	return $items;
}

function ensure_schedule_rules_table(PDO $pdo) {
	$pdo->exec("
		CREATE TABLE IF NOT EXISTS candor.schedule_rules (
			id BIGSERIAL PRIMARY KEY,
			user_id INTEGER NOT NULL,
			kind VARCHAR(32) NOT NULL,
			title TEXT,
			start_time TIME,
			end_time TIME,
			repeat_rule VARCHAR(16) NOT NULL,
			day_of_week SMALLINT,
			created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
		)
	");
	$pdo->exec("ALTER TABLE candor.schedule_rules ADD COLUMN IF NOT EXISTS color VARCHAR(16)");
}

function ensure_routines_table(PDO $pdo) {
	$pdo->exec("
		CREATE TABLE IF NOT EXISTS candor.routines (
			id BIGSERIAL PRIMARY KEY,
			user_id INTEGER NOT NULL,
			title TEXT NOT NULL,
			routine_time TIME,
			end_time TIME,
			block_type VARCHAR(16),
			anchor VARCHAR(16),
			shift_id BIGINT,
			repeat_rule VARCHAR(16),
			day_of_week SMALLINT,
			days_json TEXT,
			tasks_json TEXT,
			created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
		)
	");
	$pdo->exec("ALTER TABLE candor.routines ADD COLUMN IF NOT EXISTS repeat_rule VARCHAR(16)");
	$pdo->exec("ALTER TABLE candor.routines ADD COLUMN IF NOT EXISTS day_of_week SMALLINT");
	$pdo->exec("ALTER TABLE candor.routines ADD COLUMN IF NOT EXISTS days_json TEXT");
	$pdo->exec("ALTER TABLE candor.routines ADD COLUMN IF NOT EXISTS tasks_json TEXT");
	$pdo->exec("ALTER TABLE candor.routines ADD COLUMN IF NOT EXISTS block_type VARCHAR(16)");
	$pdo->exec("ALTER TABLE candor.routines ADD COLUMN IF NOT EXISTS anchor VARCHAR(16)");
	$pdo->exec("ALTER TABLE candor.routines ADD COLUMN IF NOT EXISTS end_time TIME");
	$pdo->exec("ALTER TABLE candor.routines ADD COLUMN IF NOT EXISTS shift_id BIGINT");
	$pdo->exec("ALTER TABLE candor.routines ADD COLUMN IF NOT EXISTS color VARCHAR(16)");
}

function ensure_work_shifts_table(PDO $pdo) {
	$pdo->exec("
		CREATE TABLE IF NOT EXISTS candor.work_shifts (
			id BIGSERIAL PRIMARY KEY,
			user_id INTEGER NOT NULL,
			name TEXT,
			start_time TIME,
			end_time TIME,
			commute_before INTEGER,
			commute_after INTEGER,
			is_default BOOLEAN NOT NULL DEFAULT FALSE,
			created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
			updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
		)
	");
	$pdo->exec("ALTER TABLE candor.work_shifts ADD COLUMN IF NOT EXISTS name TEXT");
	$pdo->exec("ALTER TABLE candor.work_shifts ADD COLUMN IF NOT EXISTS start_time TIME");
	$pdo->exec("ALTER TABLE candor.work_shifts ADD COLUMN IF NOT EXISTS end_time TIME");
	$pdo->exec("ALTER TABLE candor.work_shifts ADD COLUMN IF NOT EXISTS commute_before INTEGER");
	$pdo->exec("ALTER TABLE candor.work_shifts ADD COLUMN IF NOT EXISTS commute_after INTEGER");
	$pdo->exec("ALTER TABLE candor.work_shifts ADD COLUMN IF NOT EXISTS is_default BOOLEAN NOT NULL DEFAULT FALSE");
	$pdo->exec("ALTER TABLE candor.work_shifts ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()");
	$pdo->exec("ALTER TABLE candor.work_shifts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()");
}

function ensure_work_shift_overrides_table(PDO $pdo) {
	$pdo->exec("
		CREATE TABLE IF NOT EXISTS candor.work_shift_overrides (
			id BIGSERIAL PRIMARY KEY,
			user_id INTEGER NOT NULL,
			date DATE NOT NULL,
			shift_id BIGINT,
			start_time TIME,
			end_time TIME,
			created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
			updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
		)
	");
	$pdo->exec("ALTER TABLE candor.work_shift_overrides ADD COLUMN IF NOT EXISTS start_time TIME");
	$pdo->exec("ALTER TABLE candor.work_shift_overrides ADD COLUMN IF NOT EXISTS end_time TIME");
	$pdo->exec("CREATE UNIQUE INDEX IF NOT EXISTS work_shift_overrides_user_date ON candor.work_shift_overrides (user_id, date)");
}

try {
	ensure_schedule_rules_table($pdo);
	ensure_routines_table($pdo);
	ensure_work_shifts_table($pdo);
	ensure_work_shift_overrides_table($pdo);
} catch (Throwable $e) {
	respond(['error' => 'table_unavailable'], 500);
}

$allowedRepeats = ['daily', 'weekdays', 'weekends', 'day'];

if ($action === 'load') {
	$stmt = $pdo->prepare("
		SELECT id, kind, title, start_time, end_time, repeat_rule, day_of_week, color
		FROM candor.schedule_rules
		WHERE user_id = ?
		ORDER BY created_at ASC, id ASC
	");
	$stmt->execute([(int)$userId]);
	$rules = [];
	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		$start = '';
		if (!empty($row['start_time'])) {
			$start = substr((string)$row['start_time'], 0, 5);
		}
		$end = '';
		if (!empty($row['end_time'])) {
			$end = substr((string)$row['end_time'], 0, 5);
		}
		$rules[] = [
			'id' => (string)$row['id'],
			'kind' => (string)$row['kind'],
			'title' => (string)($row['title'] ?? ''),
			'start' => $start,
			'end' => $end,
			'repeat' => (string)($row['repeat_rule'] ?? ''),
			'color' => (string)($row['color'] ?? ''),
			'day' => isset($row['day_of_week']) ? (int)$row['day_of_week'] : null,
		];
	}
	$stmt = $pdo->prepare("
		SELECT id, title, routine_time, end_time, repeat_rule, day_of_week, days_json, tasks_json, block_type, anchor, shift_id, color
		FROM candor.routines
		WHERE user_id = ?
		ORDER BY created_at ASC, id ASC
	");
	$stmt->execute([(int)$userId]);
	$routines = [];
	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		$time = '';
		if (!empty($row['routine_time'])) {
			$time = substr((string)$row['routine_time'], 0, 5);
		}
		$end = '';
		if (!empty($row['end_time'])) {
			$end = substr((string)$row['end_time'], 0, 5);
		}
		$tasks = [];
		if (!empty($row['tasks_json'])) {
			$decoded = json_decode((string)$row['tasks_json'], true);
			if (is_array($decoded)) {
				foreach ($decoded as $item) {
					if (is_array($item)) {
						$title = clean_text($item['title'] ?? ($item['text'] ?? ''), 120);
						if ($title === '') continue;
						$minutes = isset($item['minutes']) && is_numeric($item['minutes']) ? (int)$item['minutes'] : null;
						if ($minutes !== null && $minutes <= 0) $minutes = null;
						$tasks[] = ['title' => $title, 'minutes' => $minutes];
					} else {
						$clean = clean_text($item, 120);
						if ($clean !== '') {
							$tasks[] = ['title' => $clean, 'minutes' => null];
						}
					}
				}
			}
		}
		$days = [];
		if (!empty($row['days_json'])) {
			$decodedDays = json_decode((string)$row['days_json'], true);
			if (is_array($decodedDays)) {
				$days = clean_days($decodedDays);
			}
		}
		if (!$days && isset($row['day_of_week'])) {
			$days = clean_days((int)$row['day_of_week']);
		}
		$routines[] = [
			'id' => (string)$row['id'],
			'title' => (string)($row['title'] ?? ''),
			'time' => $time,
			'end' => $end,
			'repeat' => (string)($row['repeat_rule'] ?? ''),
			'day' => $days ? $days[0] : (isset($row['day_of_week']) ? (int)$row['day_of_week'] : null),
			'days' => $days,
			'tasks' => $tasks,
			'block_type' => (string)($row['block_type'] ?? 'routine'),
			'anchor' => (string)($row['anchor'] ?? 'custom'),
			'color' => (string)($row['color'] ?? ''),
			'shift_id' => isset($row['shift_id']) ? (int)$row['shift_id'] : null,
		];
	}
	$shifts = [];
	$stmt = $pdo->prepare("
		SELECT id, name, start_time, end_time, commute_before, commute_after, is_default
		FROM candor.work_shifts
		WHERE user_id = ?
		ORDER BY created_at ASC, id ASC
	");
	$stmt->execute([(int)$userId]);
	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		$start = '';
		if (!empty($row['start_time'])) {
			$start = substr((string)$row['start_time'], 0, 5);
		}
		$end = '';
		if (!empty($row['end_time'])) {
			$end = substr((string)$row['end_time'], 0, 5);
		}
		$shifts[] = [
			'id' => (string)$row['id'],
			'name' => (string)($row['name'] ?? ''),
			'start' => $start,
			'end' => $end,
			'commute_before' => isset($row['commute_before']) ? (int)$row['commute_before'] : 0,
			'commute_after' => isset($row['commute_after']) ? (int)$row['commute_after'] : 0,
			'is_default' => !empty($row['is_default']),
		];
	}
	respond(['rules' => $rules, 'routines' => $routines, 'shifts' => $shifts]);
}

if ($action === 'add') {
	$kind = $payload['kind'] ?? '';
	$kind = $kind === 'task' ? 'task' : ($kind === 'sleep' ? 'sleep' : '');
	if ($kind === '') {
		respond(['error' => 'invalid_kind'], 400);
	}

	$repeat = $payload['repeat'] ?? ($payload['repeat_rule'] ?? '');
	$repeat = in_array($repeat, $allowedRepeats, true) ? $repeat : '';
	if ($repeat === '') {
		respond(['error' => 'invalid_repeat'], 400);
	}

	$day = null;
	if ($repeat === 'day') {
		$rawDay = $payload['day'] ?? ($payload['day_of_week'] ?? '');
		$dayValue = is_numeric($rawDay) ? (int)$rawDay : -1;
		if ($dayValue < 0 || $dayValue > 6) {
			respond(['error' => 'invalid_day'], 400);
		}
		$day = $dayValue;
	}

	$title = clean_text($payload['title'] ?? '', 160);
	$start = clean_time($payload['start'] ?? ($payload['start_time'] ?? ($payload['time'] ?? '')));
	$end = clean_time($payload['end'] ?? ($payload['end_time'] ?? ''));
	$color = clean_color($payload['color'] ?? '');

	if ($kind === 'sleep') {
		if ($start === '' || $end === '') {
			respond(['error' => 'missing_time'], 400);
		}
		$title = $title !== '' ? $title : 'Sleep';
	}
	if ($kind === 'task' && $title === '') {
		respond(['error' => 'missing_title'], 400);
	}

	$stmt = $pdo->prepare("
		INSERT INTO candor.schedule_rules
			(user_id, kind, title, start_time, end_time, repeat_rule, day_of_week, color, created_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
		RETURNING id, kind, title, start_time, end_time, repeat_rule, day_of_week, color
	");
	$stmt->execute([
		(int)$userId,
		$kind,
		$title,
		$start !== '' ? $start : null,
		$end !== '' ? $end : null,
		$repeat,
		$day,
		$color !== '' ? $color : null,
	]);
	$row = $stmt->fetch(PDO::FETCH_ASSOC);
	$startOut = '';
	if (!empty($row['start_time'])) {
		$startOut = substr((string)$row['start_time'], 0, 5);
	}
	$endOut = '';
	if (!empty($row['end_time'])) {
		$endOut = substr((string)$row['end_time'], 0, 5);
	}

	respond([
		'rule' => [
			'id' => (string)$row['id'],
			'kind' => (string)$row['kind'],
			'title' => (string)($row['title'] ?? ''),
			'start' => $startOut,
			'end' => $endOut,
			'repeat' => (string)($row['repeat_rule'] ?? ''),
			'color' => (string)($row['color'] ?? ''),
			'day' => isset($row['day_of_week']) ? (int)$row['day_of_week'] : null,
		],
