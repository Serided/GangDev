<?php
require_once '/var/www/gangdev/shared/php/init.php';
require_once '/var/www/gangdev/shared/php/mailer.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
	$name    = strip_tags(trim($_POST["name"]));
	$email   = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
	$message = trim($_POST["message"]);

	if (empty($name) || empty($email) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
		header("Location: contact.html?status=error");
		exit;
	}

	$fromEmail = 'company@gangdev.co';
	$fromName  = 'GangDev Contact Form';
	$toEmail   = 'company@gangdev.co';  // Replace with your actual email
	$toName    = 'GangDev';                // Replace with your name or company name

	$subject = "New Contact Form Message from $name";

	$htmlBody  = "<p>You have received a new message from your website contact form.</p>";
	$htmlBody .= "<p><strong>Name:</strong> " . htmlspecialchars($name) . "</p>";
	$htmlBody .= "<p><strong>Email:</strong> " . htmlspecialchars($email) . "</p>";
	$htmlBody .= "<p><strong>Message:</strong><br>" . nl2br(htmlspecialchars($message)) . "</p>";

	$altBody  = "You have received a new message from your website contact form.\n\n";
	$altBody .= "Name: $name\n";
	$altBody .= "Email: $email\n";
	$altBody .= "Message:\n$message\n";

	if (sendMail($fromEmail, $fromName, $toEmail, $toName, $subject, $htmlBody, $altBody)) {
		header("Location: https://gangdev.co?status=success");
	} else {
		header("Location: https://gangdev.co?status=error");
	}
	exit;
} else {
	echo "Invalid request.";
}
?>
