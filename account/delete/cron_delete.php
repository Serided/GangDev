<?php
require_once '/var/www/gangdev/shared/php/init.php';
require_once '/var/www/gangdev/account/php/db.php';

$stmt = $pdo->prepare("SELECT id FROM users WHERE deletion_requested_at IS NOT NULL AND (UNIX_TIMESTAMP(deletion_requested_at) + (60)) < UNIX_TIMESTAMP()");
$stmt->execute();

$usersToDelete = $stmt->fetchAll(PDO::FETCH_ASSOC);
foreach ($usersToDelete as $user) {
	$userId = $user['id'];
	// Optionally delete associated user files, etc.
	$pdo->prepare("DELETE FROM users WHERE id = ?")->execute([$userId]);
}
?>