<?php
require_once '/var/www/gangdev/shared/php/init.php';
require_once "/var/www/gangdev/account/php/db.php";
require '/var/www/gangdev/account/php/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Dotenv\Dotenv;

// Load environment variables from one directory up
$dotenv = Dotenv::createImmutable(__DIR__ . "/..");
$dotenv->load();

// SMTP configuration from .env
$smtpHost       = $_ENV['SMTP_HOST'];
$smtpUsername   = $_ENV['SMTP_USERNAME'];
$smtpPassword   = $_ENV['SMTP_PASSWORD'];
$smtpPort       = $_ENV['SMTP_PORT'];
$smtpEncryption = $_ENV['SMTP_ENCRYPTION'];

// Define a timeout period in seconds (e.g., 5 minutes = 300 seconds)
$timeout = 300;

if ($_SERVER["REQUEST_METHOD"] === "POST") {
	$email = trim($_POST["email"]);

	// Check if a password recovery email was sent recently
	if (isset($_SESSION['last_password_recovery']) && (time() - $_SESSION['last_password_recovery']) < $timeout) {
		$wait = $timeout - (time() - $_SESSION['last_password_recovery']);
		echo "Please wait {$wait} seconds before trying again.";
		exit();
	}

	// Look up the user by email in the users table
	$stmt = $pdo->prepare("SELECT username FROM users WHERE email = ?");
	$stmt->execute([$email]);
	$user = $stmt->fetch(PDO::FETCH_ASSOC);

	if ($user) {
		$username = $user["username"];

		// Generate a secure token and expiration time (1 hour from now)
		$token = bin2hex(random_bytes(16)); // 32-character token
		$expires = date('Y-m-d H:i:s', time() + 3600);

		// Insert the token into the password_resets table
		$stmt2 = $pdo->prepare("INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)");
		$stmt2->execute([$email, $token, $expires]);

		// Build the password reset URL (adjust domain/path as needed)
		$resetUrl = "https://account.gangdev.co/recovery/reset_password.php?token=" . $token;

		// Set up PHPMailer to send the recovery email
		$mail = new PHPMailer(true);
		try {
			$mail->isSMTP();
			$mail->Host       = $smtpHost;
			$mail->SMTPAuth   = true;
			$mail->Username   = $smtpUsername;
			$mail->Password   = $smtpPassword;
			$mail->SMTPSecure = $smtpEncryption;
			$mail->Port       = $smtpPort;

			$mail->setFrom('company@gangdev.co', 'GangDev');
			$mail->addAddress($email, $username);

			$mail->isHTML(true);
			$mail->Subject = 'Password Reset Request';
			$mail->Body    = "Hello {$username},<br><br>We received a request to reset your password. Please click the link below to reset your password:<br>
                              <a href='{$resetUrl}'>{$resetUrl}</a><br><br>This link will expire in 1 hour.<br><br>If you did not request a password reset, please ignore this email.";
			$mail->AltBody = "Hello {$username},\n\nWe received a request to reset your password. Please visit the following link to reset your password: {$resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you did not request a password reset, please ignore this email.";

			$mail->send();

			// Update the session timestamp to prevent spamming
			$_SESSION['last_password_recovery'] = time();

			echo "An email with password reset instructions has been sent to " . htmlspecialchars($email) . ".";
		} catch (Exception $e) {
			error_log("Mailer Error: " . $mail->ErrorInfo);
			echo "There was an error sending the email. Please try again later.";
		}
	} else {
		echo "No user found with that email.";
	}
} else {
	echo "Invalid request.";
}
?>
