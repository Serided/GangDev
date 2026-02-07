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

if ($action === 'load') {
	$taskStatusType = column_type($pdo, 'tasks', 'status');
	$tasksStmt = $pdo->prepare("
		SELECT id, title, status, completed_at
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
		$tasks[] = [
			'id' => (string)$row['id'],
			'text' => (string)$row['title'],
			'done' => $done,
		];
	}

	$notesStmt = $pdo->prepare("
		SELECT id, title, body
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
		];
	}

	$blocksStmt = $pdo->prepare("
		SELECT id, title, date, start_time
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
		$blocks[] = [
			'id' => (string)$row['id'],
			'text' => (string)$row['title'],
			'time' => $time,
			'date' => (string)($row['date'] ?? ''),
		];
	}

	respond([
		'tasks' => $tasks,
		'notes' => $notes,
		'blocks' => $blocks,
	]);
}

if ($action === 'add') {
	if (!in_array($type, ['tasks', 'notes', 'blocks'], true)) {
		respond(['error' => 'invalid_type'], 400);
	}

	$text = clamp_text($payload['text'] ?? '', 240);
	if ($text === '') {
		respond(['error' => 'empty_text'], 400);
	}

	if ($type === 'tasks') {
		$statusType = column_type($pdo, 'tasks', 'status');
		$statusOpen = status_value($statusType, false);
		$columns = 'user_id, title, created_at';
		$values = '?, ?, NOW()';
		$params = [(int)$userId, $text];
		if ($statusOpen !== null) {
			$columns .= ', status';
			$values .= ', ?';
			$params[] = $statusOpen;
		}

		$stmt = $pdo->prepare("
			INSERT INTO candor.tasks ($columns)
			VALUES ($values)
			RETURNING id, title, status, completed_at
		");
		$stmt->execute($params);
		$row = $stmt->fetch(PDO::FETCH_ASSOC);

		respond([
			'item' => [
				'id' => (string)$row['id'],
				'text' => (string)$row['title'],
				'done' => !empty($row['completed_at']),
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
		$statusType = column_type($pdo, 'schedule_instances', 'status');
		$statusPlanned = planned_value($statusType);
		$date = $payload['date'] ?? '';
		$date = preg_match('/^\d{4}-\d{2}-\d{2}$/', (string)$date) ? $date : date('Y-m-d');
		$time = trim((string)($payload['time'] ?? ''));
		$columns = 'user_id, title, date, created_at';
		$values = '?, ?, ?, NOW()';
		$params = [(int)$userId, $text, $date];

		if ($time !== '') {
			$columns .= ', start_time';
			$values .= ', ?';
			$params[] = $time;
		}
		if ($statusPlanned !== null) {
			$columns .= ', status';
			$values .= ', ?';
			$params[] = $statusPlanned;
		}

		$stmt = $pdo->prepare("
			INSERT INTO candor.schedule_instances ($columns)
			VALUES ($values)
			RETURNING id, title, date, start_time
		");
		$stmt->execute($params);
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		$timeOut = '';
		if (!empty($row['start_time'])) {
			$timeOut = substr((string)$row['start_time'], 0, 5);
		}

		respond([
			'item' => [
				'id' => (string)$row['id'],
				'text' => (string)$row['title'],
				'time' => $timeOut,
				'date' => (string)($row['date'] ?? ''),
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

if ($action === 'delete') {
	if (!in_array($type, ['tasks', 'notes', 'blocks'], true)) {
		respond(['error' => 'invalid_type'], 400);
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
