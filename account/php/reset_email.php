<?php
require_once '/var/www/gangdev/shared/php/init.php';

if (!isset($_GET['old']) || !isset($_GET['new'])) {
	echo "Invalid request.";
	exit;
}

$oldEmail = filter_var($_GET['old'], FILTER_VALIDATE_EMAIL);
$newEmail = filter_var($_GET['new'], FILTER_VALIDATE_EMAIL);

if (!$oldEmail || !$newEmail) {
	echo "Invalid email parameters.";
	exit;
}

if (!isset($_SESSION['user_id'])) {
	echo "Please log in to revert your email change.";
	exit;
}

$stmt = $pdo->prepare("SELECT email FROM users WHERE id = ?");
$stmt->execute([$_SESSION['user_id']]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
	echo "User not found.";
	exit;
}

$currentEmail = $user['email'];

if ($currentEmail !== $newEmail) {
	echo "Your email does not match the new email in the reset link. No changes made.";
	exit;
}

$stmt = $pdo->prepare("UPDATE users SET email = ? WHERE id = ?");
if ($stmt->execute([$oldEmail, $_SESSION['user_id']])) {
	$_SESSION['email'] = $oldEmail;
	header("Location: https://account.gangdev.co?status=email_reset");
	exit;
} else {
	echo "Error reverting email. Please try again.";
	exit;
}
?>