<?php
require_once '/var/www/gangdev/shared/lib/composer/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable('/var/www/gangdev/shared');
$dotenv->load();

require_once '/var/www/gangdev/shared/php/db.php';

function deleteDirectory($dir) {
	if (!file_exists($dir)) return true;
	if (!is_dir($dir)) return unlink($dir);
	foreach (scandir($dir) as $item) {
		if ($item == '.' || $item == '..') continue;
		if (!deleteDirectory($dir . DIRECTORY_SEPARATOR . $item)) return false;
	}
	return rmdir($dir);
}

$stmt = $pdo->prepare("SELECT id FROM users WHERE deletion_requested_at IS NOT NULL AND deletion_requested_at + interval '30 days' < now()");
$stmt->execute();

$usersToDelete = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($usersToDelete as $user) {
	$userId = $user['id'];

	$userFolder = '/var/www/gangdev/user/' . $userId;
	if (file_exists($userFolder)) {
		if (deleteDirectory($userFolder)) {
			echo "Deleted folder for user $userId\n";
		} else {
			echo "Failed to delete folder for user $userId\n";
		}
	} else {
		echo "No folder found for user $userId\n";
	}

	$stmtDel = $pdo->prepare("DELETE FROM users WHERE id = ?");
	if ($stmtDel->execute([$userId])) {
		echo "Deleted user $userId from database\n";
	} else {
		echo "Failed to delete user $userId from database\n";
	}
}
?>
