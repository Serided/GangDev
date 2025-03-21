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

	if ($_POST["recipient"] === "jens") {
		$fromName  = 'Jens Contact Form';
		$toEmail = 'jens.hansen@gangdev.co';
		$toName  = 'Jens Hansen';
	} else {
		$toEmail = 'company@gangdev.co';
		$fromName  = 'GangDev Contact Form';
		$toName  = 'GangDev';
	}

	$fromEmail = 'company@gangdev.co';

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

	$currentUrl = $_SERVER['REQUEST_URI'];

	if (strpos($currentUrl, '?') !== false) {
		$redirectUrl = $currentUrl . "&status=";
	} else {
		$redirectUrl = $currentUrl . "?status=";
	}

	if (sendMail($fromEmail, $fromName, $toEmail, $toName, $subject, $htmlBody, $altBody)) {
		$status = 'success';
		header("Location: " . $redirectUrl . $status);
		exit;
	} else {
		$status = 'error';
		header("Location: " . $redirectUrl . $status);
		exit;
	}
} else {
	echo "Invalid request.";
}
?>
