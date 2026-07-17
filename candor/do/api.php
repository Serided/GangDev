<?php
require_once '/var/www/gangdev/candor/src/php/init.php';

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
$type = $payload['type'] ?? '';

function respond($data, $code = 200) {
	http_response_code($code);
	echo json_encode($data);
	exit;
}

function clamp_text($value, $max) {
	$text = trim((string)$value);
	if ($text === '') return '';
	if (function_exists('mb_substr')) {
		return mb_substr($text, 0, $max);
	}
	return substr($text, 0, $max);
}

function column_type(PDO $pdo, $table, $column) {
	static $cache = [];
	$key = $table . ':' . $column;
	if (isset($cache[$key])) return $cache[$key];

	$stmt = $pdo->prepare("
		SELECT data_type, udt_name
		FROM information_schema.columns
		WHERE table_schema = 'candor' AND table_name = ? AND column_name = ?
		LIMIT 1
	");
	$stmt->execute([$table, $column]);
	$row = $stmt->fetch(PDO::FETCH_ASSOC);
	if (!$row) {
		$cache[$key] = null;
		return null;
	}

	$type = strtolower((string)($row['data_type'] ?? ''));
	$udt = strtolower((string)($row['udt_name'] ?? ''));
	if ($type === 'user-defined' && $udt !== '') {
		$cache[$key] = $udt;
		return $cache[$key];
	}
	$cache[$key] = $type !== '' ? $type : $udt;
	return $cache[$key];
}

function status_value($type, $done) {
	if ($type === null) return null;
	$done = (bool)$done;
	if ($type === 'boolean') return $done;
	if (in_array($type, ['smallint', 'integer', 'bigint'], true)) return $done ? 1 : 0;
	if (in_array($type, ['character varying', 'text', 'varchar'], true)) return $done ? 'done' : 'open';
	return $done ? 'done' : 'open';
}

function planned_value($type) {
	if ($type === null) return null;
	if ($type === 'boolean') return false;
	if (in_array($type, ['smallint', 'integer', 'bigint'], true)) return 0;
	if (in_array($type, ['character varying', 'text', 'varchar'], true)) return 'planned';
	return 'planned';
}

function ensure_task_duration_column(PDO $pdo) {
	$pdo->exec("ALTER TABLE candor.tasks ADD COLUMN IF NOT EXISTS estimated_minutes INTEGER");
}

function ensure_schedule_instance_columns(PDO $pdo) {
	$pdo->exec("ALTER TABLE candor.schedule_instances ADD COLUMN IF NOT EXISTS kind VARCHAR(16)");
	$pdo->exec("ALTER TABLE candor.schedule_instances ADD COLUMN IF NOT EXISTS color VARCHAR(16)");
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
	$pdo->exec("ALTER TABLE candor.routines ADD COLUMN IF NOT EXISTS color VARCHAR(16)");
	$pdo->exec("ALTER TABLE candor.routines ADD COLUMN IF NOT EXISTS repeat_rule VARCHAR(16)");
	$pdo->exec("ALTER TABLE candor.routines ADD COLUMN IF NOT EXISTS day_of_week SMALLINT");
	$pdo->exec("ALTER TABLE candor.routines ADD COLUMN IF NOT EXISTS days_json TEXT");
	$pdo->exec("ALTER TABLE candor.routines ADD COLUMN IF NOT EXISTS tasks_json TEXT");
	$pdo->exec("ALTER TABLE candor.routines ADD COLUMN IF NOT EXISTS block_type VARCHAR(16)");
	$pdo->exec("ALTER TABLE candor.routines ADD COLUMN IF NOT EXISTS anchor VARCHAR(16)");
	$pdo->exec("ALTER TABLE candor.routines ADD COLUMN IF NOT EXISTS end_time TIME");
	$pdo->exec("ALTER TABLE candor.routines ADD COLUMN IF NOT EXISTS shift_id BIGINT");
}

function ensure_sleep_logs_table(PDO $pdo) {
	$pdo->exec("
		CREATE TABLE IF NOT EXISTS candor.sleep_logs (
			id BIGSERIAL PRIMARY KEY,
			user_id INTEGER NOT NULL,
			date DATE NOT NULL,
			start_time TIME,
			end_time TIME,
			created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
			updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
		)
	");
	$pdo->exec("CREATE UNIQUE INDEX IF NOT EXISTS sleep_logs_user_date ON candor.sleep_logs (user_id, date)");
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

if ($action === 'load') {
	try {
		ensure_task_duration_column($pdo);
		ensure_schedule_instance_columns($pdo);
		ensure_routines_table($pdo);
		ensure_sleep_logs_table($pdo);
		ensure_work_shifts_table($pdo);
		ensure_work_shift_overrides_table($pdo);
	} catch (Throwable $e) {
		// Ignore schema update failures; return available data.
	}
	$taskStatusType = column_type($pdo, 'tasks', 'status');
	$tasksStmt = $pdo->prepare("
		SELECT id, title, status, completed_at, due_date, due_time, estimated_minutes
		FROM candor.tasks
		WHERE user_id = ?
		ORDER BY created_at ASC, id ASC
	");
	$tasksStmt->execute([(int)$userId]);
	$tasks = [];
	while ($row = $tasksStmt->fetch(PDO::FETCH_ASSOC)) {
		$done = !empty($row['completed_at']);
		if (!$done && isset($row['status'])) {
			if ($taskStatusType === 'boolean') {
				$done = (bool)$row['status'];
			} elseif (in_array($taskStatusType, ['smallint', 'integer', 'bigint'], true)) {
				$done = ((int)$row['status']) > 0;
			} elseif (is_string($row['status'])) {
				$done = in_array(strtolower($row['status']), ['done', 'complete', 'completed'], true);
			}
		}
		$dateOut = '';
		if (!empty($row['due_date'])) {
			$dateOut = (string)$row['due_date'];
		}
		$timeOut = '';
		if (!empty($row['due_time'])) {
			$timeOut = substr((string)$row['due_time'], 0, 5);
		}
		$durationOut = null;
		if (isset($row['estimated_minutes']) && $row['estimated_minutes'] !== null) {
			$durationOut = (int)$row['estimated_minutes'];
		}
		$tasks[] = [
			'id' => (string)$row['id'],
			'text' => (string)$row['title'],
			'done' => $done,
			'date' => $dateOut,
			'time' => $timeOut,
			'duration' => $durationOut,
		];
	}

	$notesStmt = $pdo->prepare("
		SELECT id, title, body, created_at
		FROM candor.notes
		WHERE user_id = ?
		ORDER BY created_at ASC, id ASC
	");
	$notesStmt->execute([(int)$userId]);
	$notes = [];
	while ($row = $notesStmt->fetch(PDO::FETCH_ASSOC)) {
		$title = trim((string)($row['title'] ?? ''));
		$body = trim((string)($row['body'] ?? ''));
		$text = $body !== '' ? $body : $title;
		$notes[] = [
			'id' => (string)$row['id'],
			'title' => $title,
			'body' => $body,
			'text' => $text,
			'created_at' => (string)($row['created_at'] ?? ''),
		];
	}

	$blocksStmt = $pdo->prepare("
		SELECT id, title, date, start_time, end_time, kind, color
		FROM candor.schedule_instances
		WHERE user_id = ?
		ORDER BY date ASC, start_time ASC NULLS LAST, id ASC
	");
	$blocksStmt->execute([(int)$userId]);
	$blocks = [];
	while ($row = $blocksStmt->fetch(PDO::FETCH_ASSOC)) {
		$time = '';
		if (!empty($row['start_time'])) {
			$time = substr((string)$row['start_time'], 0, 5);
		}
		$endOut = '';
		if (!empty($row['end_time'])) {
			$endOut = substr((string)$row['end_time'], 0, 5);
		}
		$blocks[] = [
			'id' => (string)$row['id'],
			'text' => (string)$row['title'],
			'time' => $time,
			'date' => (string)($row['date'] ?? ''),
			'start' => $time,
			'end' => $endOut,
			'kind' => (string)($row['kind'] ?? 'window'),
			'color' => (string)($row['color'] ?? ''),
		];
	}

	$rules = [];
	try {
		ensure_schedule_rules_table($pdo);
		$rulesStmt = $pdo->prepare("
			SELECT id, kind, title, start_time, end_time, repeat_rule, day_of_week, color
			FROM candor.schedule_rules
			WHERE user_id = ?
			ORDER BY created_at ASC, id ASC
		");
		$rulesStmt->execute([(int)$userId]);
		while ($row = $rulesStmt->fetch(PDO::FETCH_ASSOC)) {
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
				'kind' => (string)($row['kind'] ?? ''),
				'title' => (string)($row['title'] ?? ''),
				'start' => $start,
				'end' => $end,
				'repeat' => (string)($row['repeat_rule'] ?? ''),
				'color' => (string)($row['color'] ?? ''),
				'day' => isset($row['day_of_week']) ? (int)$row['day_of_week'] : null,
			];
		}
	} catch (Throwable $e) {
		$rules = [];
	}

	$routines = [];
	try {
		$rulesStmt = $pdo->prepare("
			SELECT id, title, routine_time, end_time, repeat_rule, day_of_week, days_json, tasks_json, block_type, anchor, shift_id, color
			FROM candor.routines
			WHERE user_id = ?
			ORDER BY created_at ASC, id ASC
		");
		$rulesStmt->execute([(int)$userId]);
		while ($row = $rulesStmt->fetch(PDO::FETCH_ASSOC)) {
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
							$title = clamp_text($item['title'] ?? ($item['text'] ?? ''), 120);
							if ($title === '') continue;
							$minutes = isset($item['minutes']) && is_numeric($item['minutes']) ? (int)$item['minutes'] : null;
							if ($minutes !== null && $minutes <= 0) $minutes = null;
							$tasks[] = ['title' => $title, 'minutes' => $minutes];
						} else {
							$clean = clamp_text($item, 120);
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
					foreach ($decodedDays as $item) {
						$value = is_numeric($item) ? (int)$item : -1;
						if ($value >= 0 && $value <= 6 && !in_array($value, $days, true)) {
							$days[] = $value;
						}
					}
				}
			}
			if (!$days && isset($row['day_of_week'])) {
				$dayValue = (int)$row['day_of_week'];
				if ($dayValue >= 0 && $dayValue <= 6) {
					$days[] = $dayValue;
				}
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
	} catch (Throwable $e) {
		$routines = [];
	}

	$sleepLogs = [];
	try {
		ensure_sleep_logs_table($pdo);
		$logsStmt = $pdo->prepare("
			SELECT date, start_time, end_time
			FROM candor.sleep_logs
			WHERE user_id = ?
			ORDER BY date ASC
		");
		$logsStmt->execute([(int)$userId]);
		while ($row = $logsStmt->fetch(PDO::FETCH_ASSOC)) {
			$start = '';
			if (!empty($row['start_time'])) {
				$start = substr((string)$row['start_time'], 0, 5);
			}
			$end = '';
			if (!empty($row['end_time'])) {
				$end = substr((string)$row['end_time'], 0, 5);
			}
			$sleepLogs[] = [
				'date' => (string)($row['date'] ?? ''),
				'start' => $start,
				'end' => $end,
			];
		}
	} catch (Throwable $e) {
		$sleepLogs = [];
	}

	$shifts = [];
	$shiftOverrides = [];
	try {
		$shiftStmt = $pdo->prepare("
			SELECT id, name, start_time, end_time, commute_before, commute_after, is_default
			FROM candor.work_shifts
			WHERE user_id = ?
			ORDER BY created_at ASC, id ASC
		");
		$shiftStmt->execute([(int)$userId]);
		while ($row = $shiftStmt->fetch(PDO::FETCH_ASSOC)) {
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
		$overrideStmt = $pdo->prepare("
			SELECT date, shift_id, start_time, end_time
			FROM candor.work_shift_overrides
			WHERE user_id = ?
			ORDER BY date ASC
		");
		$overrideStmt->execute([(int)$userId]);
		while ($row = $overrideStmt->fetch(PDO::FETCH_ASSOC)) {
			$start = '';
			if (!empty($row['start_time'])) {
				$start = substr((string)$row['start_time'], 0, 5);
			}
			$end = '';
			if (!empty($row['end_time'])) {
				$end = substr((string)$row['end_time'], 0, 5);
			}
			$shiftOverrides[] = [
				'date' => (string)($row['date'] ?? ''),
				'shift_id' => isset($row['shift_id']) ? (int)$row['shift_id'] : null,
				'start' => $start,
				'end' => $end,
			];
