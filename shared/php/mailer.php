<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function sendMail($fromEmail, $fromName, $toEmail, $toName, $subject, $htmlBody, $altBody) {
	$smtpHost       = $_ENV['SMTP_HOST'];
	$smtpUsername   = $_ENV['SMTP_USERNAME'];
	$smtpPassword   = $_ENV['SMTP_PASSWORD'];
	$smtpPort       = $_ENV['SMTP_PORT'];
	$smtpEncryption = strtolower($_ENV['SMTP_ENCRYPTION'] ?? 'ssl');

	$mail = new PHPMailer(true);
	try {
		$mail->isSMTP();
		$mail->Host       = $smtpHost;
		$mail->SMTPAuth   = true;
		$mail->Username   = $smtpUsername;
		$mail->Password   = $smtpPassword;

		if ($smtpEncryption === 'ssl') {
			$mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
			$mail->Port       = $smtpPort ?: 465;
		} else {
			$mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
			$mail->Port       = $smtpPort ?: 587;
		}

		$mail->setFrom($smtpUsername, $fromName ?: 'GangDev');
		if (filter_var($fromEmail, FILTER_VALIDATE_EMAIL)) {
			$mail->addReplyTo($fromEmail, $fromName ?: $fromEmail);
		}
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