<?php
require_once '/var/www/gangdev/shared/php/init.php';
require_once '/var/www/gangdev/account/php/db.php';
session_start();

$userId = $_SESSION['user_id'];
$stmt = $pdo->prepare("UPDATE users SET deletion_requested_at = NULL WHERE id = ?");
if ($stmt->execute([$userId])) {
	echo "Account deletion has been canceled.";
	header("Location: https://account.gangdev.co");
	exit();
} else {
	echo "There was an error canceling account deletion.";
}
?>