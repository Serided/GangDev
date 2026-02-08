<?php
require_once '/var/www/gangdev/shared/php/init_candor.php';

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
}

function ensure_routines_table(PDO $pdo) {
	$pdo->exec("
		CREATE TABLE IF NOT EXISTS candor.routines (
			id BIGSERIAL PRIMARY KEY,
			user_id INTEGER NOT NULL,
			title TEXT NOT NULL,
			routine_time TIME,
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
}

try {
	ensure_schedule_rules_table($pdo);
	ensure_routines_table($pdo);
} catch (Throwable $e) {
	respond(['error' => 'table_unavailable'], 500);
}

$allowedRepeats = ['daily', 'weekdays', 'weekends', 'day'];

if ($action === 'load') {
	$stmt = $pdo->prepare("
		SELECT id, kind, title, start_time, end_time, repeat_rule, day_of_week
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
			'day' => isset($row['day_of_week']) ? (int)$row['day_of_week'] : null,
		];
	}
	$stmt = $pdo->prepare("
		SELECT id, title, routine_time, repeat_rule, day_of_week, days_json, tasks_json
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
			'repeat' => (string)($row['repeat_rule'] ?? ''),
			'day' => $days ? $days[0] : (isset($row['day_of_week']) ? (int)$row['day_of_week'] : null),
			'days' => $days,
			'tasks' => $tasks,
		];
	}
	respond(['rules' => $rules, 'routines' => $routines]);
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
			(user_id, kind, title, start_time, end_time, repeat_rule, day_of_week, created_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
		RETURNING id, kind, title, start_time, end_time, repeat_rule, day_of_week
	");
	$stmt->execute([
		(int)$userId,
		$kind,
		$title,
		$start !== '' ? $start : null,
		$end !== '' ? $end : null,
		$repeat,
		$day,
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
			'day' => isset($row['day_of_week']) ? (int)$row['day_of_week'] : null,
		],
	]);
}

if ($action === 'add_routine') {
	$title = clean_text($payload['title'] ?? '', 160);
	if ($title === '') {
		respond(['error' => 'missing_title'], 400);
	}
	$time = clean_time($payload['time'] ?? ($payload['routine_time'] ?? ''));
	$repeat = $payload['repeat'] ?? ($payload['repeat_rule'] ?? 'daily');
	$repeat = in_array($repeat, $allowedRepeats, true) ? $repeat : 'daily';
	$day = null;
	$days = [];
	if ($repeat === 'day') {
		$rawDays = $payload['days'] ?? ($payload['day'] ?? ($payload['day_of_week'] ?? ''));
		$days = clean_days($rawDays);
		if (!$days) {
			respond(['error' => 'invalid_day'], 400);
		}
		$day = $days[0];
	}
	$tasks = clean_tasks($payload['tasks'] ?? ($payload['tasks_json'] ?? ''));
	$tasksJson = $tasks ? json_encode($tasks) : null;
	$daysJson = $days ? json_encode($days) : null;

	$stmt = $pdo->prepare("
		INSERT INTO candor.routines
			(user_id, title, routine_time, repeat_rule, day_of_week, days_json, tasks_json, created_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
		RETURNING id, title, routine_time, repeat_rule, day_of_week, days_json, tasks_json
	");
	$stmt->execute([
		(int)$userId,
		$title,
		$time !== '' ? $time : null,
		$repeat,
		$day,
		$daysJson,
		$tasksJson,
	]);
	$row = $stmt->fetch(PDO::FETCH_ASSOC);
	$timeOut = '';
	if (!empty($row['routine_time'])) {
		$timeOut = substr((string)$row['routine_time'], 0, 5);
	}
	$tasksOut = [];
	if (!empty($row['tasks_json'])) {
		$decoded = json_decode((string)$row['tasks_json'], true);
		if (is_array($decoded)) {
			foreach ($decoded as $item) {
				if (is_array($item)) {
					$title = clean_text($item['title'] ?? ($item['text'] ?? ''), 120);
					if ($title === '') continue;
					$minutes = isset($item['minutes']) && is_numeric($item['minutes']) ? (int)$item['minutes'] : null;
					if ($minutes !== null && $minutes <= 0) $minutes = null;
					$tasksOut[] = ['title' => $title, 'minutes' => $minutes];
				} else {
					$clean = clean_text($item, 120);
					if ($clean !== '') {
						$tasksOut[] = ['title' => $clean, 'minutes' => null];
					}
				}
			}
		}
	}
	$daysOut = [];
	if (!empty($row['days_json'])) {
		$decodedDays = json_decode((string)$row['days_json'], true);
		if (is_array($decodedDays)) {
			$daysOut = clean_days($decodedDays);
		}
	}
	if (!$daysOut && isset($row['day_of_week'])) {
		$daysOut = clean_days((int)$row['day_of_week']);
	}

	respond([
		'routine' => [
			'id' => (string)$row['id'],
			'title' => (string)($row['title'] ?? ''),
			'time' => $timeOut,
			'repeat' => (string)($row['repeat_rule'] ?? ''),
			'day' => $daysOut ? $daysOut[0] : (isset($row['day_of_week']) ? (int)$row['day_of_week'] : null),
			'days' => $daysOut,
			'tasks' => $tasksOut,
		],
	]);
}

if ($action === 'delete') {
	$id = (int)($payload['id'] ?? 0);
	if ($id <= 0) {
		respond(['error' => 'invalid_id'], 400);
	}
	$stmt = $pdo->prepare("DELETE FROM candor.schedule_rules WHERE id = ? AND user_id = ?");
	$stmt->execute([$id, (int)$userId]);
	respond(['ok' => true]);
}

if ($action === 'delete_routine') {
	$id = (int)($payload['id'] ?? 0);
	if ($id <= 0) {
		respond(['error' => 'invalid_id'], 400);
	}
	$stmt = $pdo->prepare("DELETE FROM candor.routines WHERE id = ? AND user_id = ?");
	$stmt->execute([$id, (int)$userId]);
	respond(['ok' => true]);
}

if ($action === 'clear') {
	$kind = $payload['kind'] ?? '';
	$kind = $kind === 'task' ? 'task' : ($kind === 'sleep' ? 'sleep' : '');
	if ($kind === '') {
		respond(['error' => 'invalid_kind'], 400);
	}
	$stmt = $pdo->prepare("DELETE FROM candor.schedule_rules WHERE user_id = ? AND kind = ?");
	$stmt->execute([(int)$userId, $kind]);
	respond(['ok' => true]);
}

respond(['error' => 'invalid_action'], 400);
