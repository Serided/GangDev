<?php
require_once '/var/www/gangdev/shared/php/init.php';
require_once '/var/www/gangdev/account/php/mailer.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . "/..");
$dotenv->load();

$timeout = 300;

if ($_SERVER["REQUEST_METHOD"] === "POST") {
	$email = trim($_POST["email"]);

	if (isset($_SESSION['last_password_recovery']) && (time() - $_SESSION['last_password_recovery']) < $timeout) {
		$wait = $timeout - (time() - $_SESSION['last_password_recovery']);
		echo "Please wait {$wait} seconds before trying again.";
		exit();
	}

	$stmt = $pdo->prepare("SELECT username FROM users WHERE email = ?");
	$stmt->execute([$email]);
	$user = $stmt->fetch(PDO::FETCH_ASSOC);

	if ($user) {
		$username = $user["username"];
		$token = bin2hex(random_bytes(16)); // 32-character token
		$expires = date('Y-m-d H:i:s', time() + 3600);

		$stmt2 = $pdo->prepare("INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)");
		$stmt2->execute([$email, $token, $expires]);

		$resetUrl = "https://account.gangdev.co/recovery/reset_password.php?token=" . $token;
		$fromEmail = 'company@gangdev.co';
		$fromName  = 'GangDev';
		$subject   = 'Password Reset Request';
		$htmlBody  = "Hello {$username},<br><br>We received a request to reset your password. Please click the link below to reset your password:<br>
                      <a href='{$resetUrl}'>{$resetUrl}</a><br><br>This link will expire in 1 hour.<br><br>If you did not request a password reset, please ignore this email.";
		$altBody   = "Hello {$username},\n\nWe received a request to reset your password. Please visit the following link to reset your password: {$resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you did not request a password reset, please ignore this email.";

		if (sendMail($fromEmail, $fromName, $email, $username, $subject, $htmlBody, $altBody)) {
			$_SESSION['last_password_recovery'] = time();
			echo "An email with password reset instructions has been sent to " . htmlspecialchars($email) . ".";
		} else {
			echo "There was an error sending the email. Please try again later.";
		}
	} else {
		echo "No user found with that email.";
	}
} else {
	echo "Invalid request.";
}
?>