<?php
require_once '/var/www/gangdev/shared/php/init.php';
require_once "../db.php";
require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$dotenv = Dotenv::createImmutable(__DIR__ . "/..");
$dotenv->load();

// Now you can access your environment variables using $_ENV
$smtpHost = $_ENV['SMTP_HOST'];
$smtpUsername = $_ENV['SMTP_USERNAME'];
$smtpPassword = $_ENV['SMTP_PASSWORD'];
$smtpPort = $_ENV['SMTP_PORT'];
$smtpEncryption = $_ENV['SMTP_ENCRYPTION'];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
	$displayname = trim($_POST["displayname"]);
	$username = trim($_POST["username"]);
	$email = trim($_POST["email"]);
	$confirmEmail = trim($_POST["confirmEmail"]);
	$password = trim($_POST["password"]);
	$confirmPassword = trim($_POST["confirmPassword"]);
	$rememberMe = isset($_POST["rememberMe"]);

	// check for errors in their entry
	if (empty($displayname) || empty($username) || empty($email) || empty($confirmEmail) || empty($password) || empty($confirmPassword)) { // check for empty fields
		header("Location: signup.php?error=1");
		exit();
	}
	if ($email != $confirmEmail) { // check if passwords match
		header("Location: signup.php?error=2");
		exit();
	}
	if ($password != $confirmPassword) { // check if passwords match
		header("Location: signup.php?error=3");
		exit();
	}

	// check if email already registered
	$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
	$stmt->execute([$email]);
	if ($stmt->fetch(PDO::FETCH_ASSOC)) {
		header("Location: signup.php?error=4");
		exit();
	}

	$hashed_password = password_hash($password, PASSWORD_DEFAULT);

	$verification_token = bin2hex(random_bytes(16)); // 32 characters
	$token_expires = date("Y-m-d H:i:s", time() + (60 * 60)); // 1 hr

	$stmt = $pdo->prepare("INSERT INTO pending_users (displayname, username, email, password, verification_token, token_expires) VALUES (?, ?, ?, ?, ?, ?)");
	if ($stmt->execute([$displayname, $username, $email, $hashed_password, $verification_token, $token_expires])) {
		$verify_url = "https://account.gangdev.co/login/verify.php?token=" . $verification_token;

		$subject = "Verify your email address";
		$message = "Hello $displayname, \n\nThank you for signing up! Please click the link below to verify your email address and complete your account creation: \n\n" . $verify_url . "\n\nIf you did not sign up, please ignore this email.";
		$headers = "From: noreply@gangdev.co";

		$mail = new PHPMailer(true);
		try {
			$mail->isSMTP();
			$mail->Host       = $smtpHost;
			$mail->SMTPAuth   = true;
			$mail->SMTPSecure = $smtpEncryption;
			$mail->Port       = $smtpPort;
			$mail->Username   = $smtpUsername;
			$mail->Password   = $smtpPassword;
			$mail->setFrom('company@gangdev.co', 'GangDev');
			$mail->addAddress($email, $displayname);
			$mail->isHTML(true);
			$mail->Subject = 'Verify your email address';
			$mail->Body    = "Hello $displayname,<br><br>Click the link below to verify your email:<br>
                      <a href='$verify_url'>$verify_url</a><br><br>If you did not sign up, ignore this email.";
			$mail->AltBody = "Hello $displayname,\n\nVisit this link to verify your email: $verify_url\n\nIf you did not sign up, ignore this email.";
			$mail->send();
			echo "A verification email has been sent to $email. Please check your email to complete your registration.";
		} catch (Exception $e) {
			error_log("Mailer Error:" . $mail->ErrorInfo);
			echo "There was an error sending the verification email. Please try again later.";
		}

		exit();
	} else {
		header("Location: signup.php?error=5");
		exit();
	}
} else {
	header("Location: signup.php");
	exit();
}
