<?php
require_once '/var/www/gangdev/shared/php/init.php';
require_once '/var/www/gangdev/shared/php/mailer.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
	if (isset($_SESSION["user_id"])) {
		$userid = $_SESSION["user_id"];
		if (isset($_POST["name"]) && trim($_POST["name"]) !== '') {
			$name = strip_tags(trim($_POST["name"]));
		} else {
			$name = $_SESSION["displayname"];
		}
		$email = $_SESSION["email"];
		$message = trim($_POST["message"]);

		if (empty($message)) {
			header("Location: https://gangdev.co?status=error");
			exit;
		}
	} else {
		$userid = null;
		$name = strip_tags(trim($_POST["name"]));
		$email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
		$message = trim($_POST["message"]);

		if (empty($name) || empty($message)) {
			header("Location: https://gangdev.co?status=error");
			exit;
		}

		if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
			header("Location: https://gangdev.co?status=error");
			exit;
		}
	}

	$fromEmail = 'company@gangdev.co';
	$fromName  = 'GangDev Contact Form';

	$toEmail = 'company@gangdev.co';
	$toName  = 'GangDev';

	$subject = "New Contact Form Message from $name";

	$htmlBody = "<p>You have received a new message from your website contact form.</p>";
	if ($userid) {
		$htmlBody .= "<p><strong>ID:</strong> " . htmlspecialchars($userid) . "</p>";
	}
	$htmlBody .= "<p><strong>Name:</strong> " . htmlspecialchars($name) . "</p>";
	if (!empty($email)) {
		$htmlBody .= "<p><strong>Email:</strong> " . htmlspecialchars($email) . "</p>";
	}
	$htmlBody .= "<p><strong>Message:</strong><br>" . nl2br(htmlspecialchars($message)) . "</p>";

	$altBody  = "You have received a new message from your website contact form.\n\n";
	$altBody .= "Name: $name\n";
	if (!empty($email)) {
		$altBody .= "Email: $email\n";
	}
	$altBody .= "Message:\n$message\n";

	if (sendMail($fromEmail, $fromName, $toEmail, $toName, $subject, $htmlBody, $altBody)) {
		header("Location: https://gangdev.co?status=success");
		exit;
	} else {
		header("Location: https://gangdev.co?status=error");
		exit;
	}
} else {
	echo "Invalid request.";
}
?>
