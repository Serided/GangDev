<?php
require_once '/var/www/gangdev/account/php/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Dotenv\Dotenv;

// Load environment variables from the parent directory
$dotenv = Dotenv::createImmutable(__DIR__ . "/..");
$dotenv->load();

function sendMail($fromEmail, $fromName, $toEmail, $toName, $subject, $htmlBody, $altBody) {
	// Get SMTP settings from environment variables
	$smtpHost       = $_ENV['SMTP_HOST'];
	$smtpUsername   = $_ENV['SMTP_USERNAME'];
	$smtpPassword   = $_ENV['SMTP_PASSWORD'];
	$smtpPort       = $_ENV['SMTP_PORT'];
	$smtpEncryption = $_ENV['SMTP_ENCRYPTION'];

	$mail = new PHPMailer(true);
	try {
		$mail->isSMTP();
		$mail->Host       = $smtpHost;
		$mail->SMTPAuth   = true;
		$mail->Username   = $smtpUsername;
		$mail->Password   = $smtpPassword;
		$mail->SMTPSecure = $smtpEncryption;
		$mail->Port       = $smtpPort;

		$mail->setFrom($fromEmail, $fromName);
		$mail->addAddress($toEmail, $toName);

		$mail->isHTML(true);
		$mail->Subject = $subject;
		$mail->Body    = $htmlBody;
		$mail->AltBody = $altBody;

		$mail->send();
		return true;
	} catch (Exception $e) {
		error_log("Mailer Error: " . $mail->ErrorInfo);
		return false;
	}
}
?>