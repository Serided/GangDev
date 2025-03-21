<?php
require_once '/var/www/gangdev/shared/php/init.php';

// Ensure user is logged in.
if (!isset($_SESSION['user_id'])) {
	header("Location: https://account.gangdev.co?status=error");
	exit;
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
	$newDisplayName = trim($_POST['displayname']);
	if (empty($newDisplayName)) {
		header("Location: https://account.gangdev.co?status=error");
		exit;
	}

	// Sanitize (strip HTML tags for safety)
	$newDisplayName = strip_tags($newDisplayName);

	// Update the display name in the database.
	$stmt = $pdo->prepare("UPDATE users SET displayname = ? WHERE id = ?");
	if ($stmt->execute([$newDisplayName, $_SESSION['user_id']])) {
		// Update session so the new name is immediately reflected.
		$_SESSION['displayname'] = $newDisplayName;
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