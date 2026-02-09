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
}

if ($action === 'load') {
	try {
		ensure_task_duration_column($pdo);
		ensure_schedule_instance_columns($pdo);
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
		$text = trim((string)($row['body'] ?? ''));
		if ($text === '') $text = (string)($row['title'] ?? '');
		$notes[] = [
			'id' => (string)$row['id'],
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
			SELECT id, kind, title, start_time, end_time, repeat_rule, day_of_week
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
				'day' => isset($row['day_of_week']) ? (int)$row['day_of_week'] : null,
			];
		}
	} catch (Throwable $e) {
		$rules = [];
	}

	$routineCount = 0;
	try {
		$stmt = $pdo->prepare("SELECT COUNT(*) FROM candor.routines WHERE user_id = ?");
		$stmt->execute([(int)$userId]);
		$routineCount = (int)$stmt->fetchColumn();
	} catch (Throwable $e) {
		$routineCount = 0;
	}

	respond([
		'tasks' => $tasks,
		'notes' => $notes,
		'blocks' => $blocks,
		'windows' => $blocks,
		'rules' => $rules,
		'routine_count' => $routineCount,
	]);
}

if ($action === 'add') {
	if (!in_array($type, ['tasks', 'notes', 'blocks', 'windows'], true)) {
		respond(['error' => 'invalid_type'], 400);
	}
	if ($type === 'windows') {
		$type = 'blocks';
	}

	$text = clamp_text($payload['text'] ?? '', 240);
	if ($text === '') {
		respond(['error' => 'empty_text'], 400);
	}

	if ($type === 'tasks') {
		try {
			ensure_task_duration_column($pdo);
		} catch (Throwable $e) {
			// Ignore schema update failures.
		}
		$statusType = column_type($pdo, 'tasks', 'status');
		$statusOpen = status_value($statusType, false);
		$columns = 'user_id, title, created_at';
		$values = '?, ?, NOW()';
		$params = [(int)$userId, $text];
		$date = $payload['date'] ?? '';
		$date = preg_match('/^\d{4}-\d{2}-\d{2}$/', (string)$date) ? $date : '';
		$time = trim((string)($payload['time'] ?? ''));
		if ($date !== '') {
			$columns .= ', due_date';
			$values .= ', ?';
			$params[] = $date;
		}
		if ($time !== '' && preg_match('/^\d{2}:\d{2}$/', $time)) {
			$columns .= ', due_time';
			$values .= ', ?';
			$params[] = $time;
		}
		if ($statusOpen !== null) {
			$columns .= ', status';
			$values .= ', ?';
			$params[] = $statusOpen;
		}
		$duration = isset($payload['duration']) ? (int)$payload['duration'] : 0;
		if ($duration > 0) {
			$columns .= ', estimated_minutes';
			$values .= ', ?';
			$params[] = $duration;
		}

		$stmt = $pdo->prepare("
			INSERT INTO candor.tasks ($columns)
			VALUES ($values)
			RETURNING id, title, status, completed_at, estimated_minutes
		");
		$stmt->execute($params);
		$row = $stmt->fetch(PDO::FETCH_ASSOC);

		$dateOut = '';
		if (!empty($row['due_date'])) {
			$dateOut = (string)$row['due_date'];
		}
		$timeOut = '';
		if (!empty($row['due_time'])) {
			$timeOut = substr((string)$row['due_time'], 0, 5);
		}
		respond([
			'item' => [
				'id' => (string)$row['id'],
				'text' => (string)$row['title'],
				'done' => !empty($row['completed_at']),
				'date' => $dateOut,
				'time' => $timeOut,
				'duration' => isset($row['estimated_minutes']) ? (int)$row['estimated_minutes'] : null,
			],
		]);
	}

	if ($type === 'notes') {
		$title = clamp_text($text, 120);
		$stmt = $pdo->prepare("
			INSERT INTO candor.notes (user_id, title, body, created_at, updated_at)
			VALUES (?, ?, ?, NOW(), NOW())
			RETURNING id, title, body
		");
		$stmt->execute([(int)$userId, $title, $text]);
		$row = $stmt->fetch(PDO::FETCH_ASSOC);

		respond([
			'item' => [
				'id' => (string)$row['id'],
				'text' => (string)($row['body'] ?? $row['title']),
			],
		]);
	}

	if ($type === 'blocks') {
		try {
			ensure_schedule_instance_columns($pdo);
		} catch (Throwable $e) {
			// Ignore schema update failures.
		}
		$statusType = column_type($pdo, 'schedule_instances', 'status');
		$statusPlanned = planned_value($statusType);
		$date = $payload['date'] ?? '';
		$date = preg_match('/^\d{4}-\d{2}-\d{2}$/', (string)$date) ? $date : date('Y-m-d');
		$time = trim((string)($payload['time'] ?? ''));
		$endTime = trim((string)($payload['end_time'] ?? ''));
		$columns = 'user_id, title, date, created_at';
		$values = '?, ?, ?, NOW()';
		$params = [(int)$userId, $text, $date];
		$kind = isset($payload['kind']) && $payload['kind'] === 'event' ? 'event' : 'window';
		$color = trim((string)($payload['color'] ?? ''));
		if ($color !== '' && !preg_match('/^#?[0-9a-fA-F]{6}$/', $color)) {
			$color = '';
		}
		if ($color !== '' && $color[0] !== '#') {
			$color = '#' . $color;
		}

		if ($time !== '') {
			$columns .= ', start_time';
			$values .= ', ?';
			$params[] = $time;
		}
		if ($endTime !== '') {
			$columns .= ', end_time';
			$values .= ', ?';
			$params[] = $endTime;
		}
		if ($statusPlanned !== null) {
			$columns .= ', status';
			$values .= ', ?';
			$params[] = $statusPlanned;
		}
		$columns .= ', kind';
		$values .= ', ?';
		$params[] = $kind;
		if ($color !== '') {
			$columns .= ', color';
			$values .= ', ?';
			$params[] = $color;
		}

		$stmt = $pdo->prepare("
			INSERT INTO candor.schedule_instances ($columns)
			VALUES ($values)
			RETURNING id, title, date, start_time, end_time, kind, color
		");
		$stmt->execute($params);
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		$timeOut = '';
		if (!empty($row['start_time'])) {
			$timeOut = substr((string)$row['start_time'], 0, 5);
		}
		$endOut = '';
		if (!empty($row['end_time'])) {
			$endOut = substr((string)$row['end_time'], 0, 5);
		}

		respond([
			'item' => [
				'id' => (string)$row['id'],
				'text' => (string)$row['title'],
				'time' => $timeOut,
				'date' => (string)($row['date'] ?? ''),
				'start' => $timeOut,
				'end' => $endOut,
				'kind' => (string)($row['kind'] ?? $kind),
				'color' => (string)($row['color'] ?? $color),
			],
		]);
	}
}

if ($action === 'toggle' && $type === 'tasks') {
	$id = (int)($payload['id'] ?? 0);
	$done = filter_var($payload['done'] ?? false, FILTER_VALIDATE_BOOLEAN);
	if ($id <= 0) {
		respond(['error' => 'invalid_id'], 400);
	}

	$statusType = column_type($pdo, 'tasks', 'status');
	$statusValue = status_value($statusType, $done);
	$sql = "UPDATE candor.tasks SET completed_at = " . ($done ? "NOW()" : "NULL");
	$params = [];
	if ($statusValue !== null) {
		$sql .= ", status = ?";
		$params[] = $statusValue;
	}
	$sql .= " WHERE id = ? AND user_id = ?";
	$params[] = $id;
	$params[] = (int)$userId;

	$stmt = $pdo->prepare($sql);
	$stmt->execute($params);
	respond(['ok' => true]);
}

if ($action === 'update_window') {
	$id = (int)($payload['id'] ?? 0);
	if ($id <= 0) {
		respond(['error' => 'invalid_id'], 400);
	}
	$setParts = [];
	$params = [];

	if (array_key_exists('start', $payload)) {
		$startRaw = trim((string)($payload['start'] ?? ''));
		if ($startRaw === '') {
			$setParts[] = 'start_time = NULL';
		} elseif (preg_match('/^\d{2}:\d{2}$/', $startRaw)) {
			$setParts[] = 'start_time = ?';
			$params[] = $startRaw;
		} else {
			respond(['error' => 'invalid_start'], 400);
		}
	}

	if (array_key_exists('end', $payload)) {
		$endRaw = trim((string)($payload['end'] ?? ''));
		if ($endRaw === '') {
			$setParts[] = 'end_time = NULL';
		} elseif (preg_match('/^\d{2}:\d{2}$/', $endRaw)) {
			$setParts[] = 'end_time = ?';
			$params[] = $endRaw;
		} else {
			respond(['error' => 'invalid_end'], 400);
		}
	}

	if (empty($setParts)) {
		respond(['error' => 'no_updates'], 400);
	}

	$params[] = $id;
	$params[] = (int)$userId;
	$sql = "UPDATE candor.schedule_instances SET " . implode(', ', $setParts) . " WHERE id = ? AND user_id = ?";
	$stmt = $pdo->prepare($sql);
	$stmt->execute($params);
	respond(['ok' => true]);
}

if ($action === 'delete') {
	if (!in_array($type, ['tasks', 'notes', 'blocks', 'windows'], true)) {
		respond(['error' => 'invalid_type'], 400);
	}
	if ($type === 'windows') {
		$type = 'blocks';
	}
	$id = (int)($payload['id'] ?? 0);
	if ($id <= 0) {
		respond(['error' => 'invalid_id'], 400);
	}

	$table = $type === 'blocks' ? 'schedule_instances' : $type;
	$stmt = $pdo->prepare("DELETE FROM candor.$table WHERE id = ? AND user_id = ?");
	$stmt->execute([$id, (int)$userId]);
	respond(['ok' => true]);
}

respond(['error' => 'invalid_action'], 400);
