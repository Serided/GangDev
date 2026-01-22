<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function sendMail($fromEmail, $fromName, $toEmail, $toName, $subject, $htmlBody, $altBody) {
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

		$mail->CharSet  = 'UTF-8';
		$mail->Encoding = 'base64';

		$mail->setFrom($fromEmail, $fromName, false);
		$mail->addReplyTo($fromEmail, 'GangDev');
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
