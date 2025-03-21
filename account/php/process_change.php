<?php
require_once '/var/www/gangdev/shared/php/init.php';

if (!isset($_SESSION['user_id'])) {
	header("Location: https://account.gangdev.co?status=error");
	exit;
}

$delaySeconds = 5;
if (!isset($_SESSION['last_change'])) {
	$_SESSION['last_change'] = 0;
}
$now = time();
$timeSinceLast = $now - $_SESSION['last_change'];
if ($timeSinceLast < $delaySeconds) {
	header("Location: https://account.gangdev.co?status=toofast");
	exit;
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
	$newDisplayName = trim($_POST['displayname']);
	$newEmail = trim($_POST['email']);

	if (empty($newDisplayName) || empty($newEmail)) {
		header("Location: https://account.gangdev.co?status=empty");
		exit;
	}

	$newDisplayName = strip_tags($newDisplayName);

	$currentDisplayName = $_SESSION['displayname'];
	$currentEmail = $_SESSION['email'];

	if ($newDisplayName === $currentDisplayName && $newEmail === $currentEmail) {
		header("Location: https://account.gangdev.co?status=nochange");
		exit;
	}

	if ($newEmail !== $currentEmail) {
		$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ? AND id <> ?");
		$stmt->execute([$newEmail, $_SESSION['user_id']]);
		if ($stmt->fetch(PDO::FETCH_ASSOC)) {
			header("Location: https://account.gangdev.co?status=emailexists");
			exit;
		}

		$fromEmail = 'company@gangdev.co';
		$fromName  = 'GangDev Account';
		$toEmail   = $currentEmail;
		$toName    = $newDisplayName;
		$subject   = "Email Change Notification";

		$link = "https://account.gangdev.co/php/reset_email.php?old=" . urlencode($currentEmail) . "&new=" . urlencode($newEmail);

		$htmlBody = "<p>Greetings $currentDisplayName,</p>";
		$htmlBody .= "<p>Your email is being changed to <strong>$newEmail</strong>.</p>";
		$htmlBody .= "<p>If you did not request this change, please <a href='$link'>click here</a> to revert it.</p>";

		$altBody  = "Dear $currentDisplayName,\nYour email is being changed to $newEmail.\nIf you did not request this change, visit $link to revert it.";

		sendMail($fromEmail, $fromName, $toEmail, $toName, $subject, $htmlBody, $altBody);
	}

	$stmt = $pdo->prepare("UPDATE users SET displayname = ?, email = ? WHERE id = ?");
	if ($stmt->execute([$newDisplayName, $newEmail, $_SESSION['user_id']])) {
		$_SESSION['displayname'] = $newDisplayName;
		$_SESSION['email'] = $newEmail;
		$_SESSION['last_change'] = $now;
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
