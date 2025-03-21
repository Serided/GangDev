<?php
require_once '/var/www/gangdev/shared/php/init.php';

if (!isset($_SESSION['user_id'])) {
	header("Location: https://account.gangdev.co?status=error");
	exit;
}

$delaySeconds = 30;

if (!isset($_SESSION['last_change'])) {
	$_SESSION['last_change'] = 0;
}
$now = time();
$timeSinceLast = $now - $_SESSION['last_change'];

if ($timeSinceLast < $delaySeconds) {
	sleep($delaySeconds - $timeSinceLast);
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
	$newDisplayName = trim($_POST['displayname']);
	if (empty($newDisplayName)) {
		header("Location: https://account.gangdev.co?status=error");
		exit;
	}

	$newDisplayName = strip_tags($newDisplayName);

	$stmt = $pdo->prepare("UPDATE users SET displayname = ? WHERE id = ?");
	if ($stmt->execute([$newDisplayName, $_SESSION['user_id']])) {
		$_SESSION['displayname'] = $newDisplayName;
		$_SESSION['last_change'] = time();
		header("Location: https://account.gangdev.co?status=success");
		exit;
	} else {
		header("Location: https://account.gangdev.co?status=error");
		exit;
	}
} else {
	echo "Invalid request.";
}
?>
