<?php
require_once '/var/www/gangdev/shared/php/init.php';
require_once '/var/www/gangdev/account/php/db.php';

$userId = $_SESSION['user_id'];
$now = date('Y-m-d H:i:s');

$stmt = $pdo->prepare("UPDATE users SET deletion_requested_at = ? WHERE id = ?");
if ($stmt->execute([$now, $userId])) {
	echo "Your account deletion has been scheduled. It will be permanently deleted in 30 days.";
} else {
	echo "There was an error scheduling account deletion.";
}
?>
