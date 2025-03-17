<?php
require_once '/var/www/gangdev/shared/php/init.php';
require_once "/var/www/gangdev/account/php/db.php";
require '/var/www/gangdev/account/php/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Dotenv\Dotenv;

// Start the session if it isn't already started
if (session_status() === PHP_SESSION_NONE) {
	session_start();
}

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__ . "/..");
$dotenv->load();

$smtpHost       = $_ENV['SMTP_HOST'];
$smtpUsername   = $_ENV['SMTP_USERNAME'];
$smtpPassword   = $_ENV['SMTP_PASSWORD'];
$smtpPort       = $_ENV['SMTP_PORT'];
$smtpEncryption = $_ENV['SMTP_ENCRYPTION'];

// Define a timeout period in seconds (e.g., 5 minutes = 300 seconds)
$timeout = 300;

if ($_SERVER["REQUEST_METHOD"] == "POST") {
	$email = trim($_POST["email"]);

	// Check if a recovery email was sent recently
	if (isset($_SESSION['last_recovery']) && (time() - $_SESSION['last_recovery']) < $timeout) {
		$wait = $timeout - (time() - $_SESSION['last_recovery']);
		echo "Please wait {$wait} seconds before trying again.";
		exit();
	}

	// Look up the user by email in the users table
	$stmt = $pdo->prepare("SELECT username FROM users WHERE email = ?");
	$stmt->execute([$email]);
	$user = $stmt->fetch(PDO::FETCH_ASSOC);

	if ($user) {
		$username = $user["username"];

		// Set up PHPMailer to send the username recovery email
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
			$mail->addAddress($email, $username);

			$mail->isHTML(true);
			$mail->Subject = 'Your GangDev Username';
			$mail->Body    = "Hello,<br><br>Your username is: <strong>$username</strong>.<br><br>If you did not request this recovery, please ignore this email.";
			$mail->AltBody = "Hello,\n\nYour username is: $username\n\nIf you did not request this recovery, please ignore this email.";

			$mail->send();

			// Update the session timestamp after sending
			$_SESSION['last_recovery'] = time();

			echo "An email with your username has been sent to " . htmlspecialchars($email) . ".";
			echo "<br><br>You will be redirected shortly.";
			echo "<script>
        setTimeout(function() {
            window.location.href = 'https://account.gangdev.co/login/signin.php';
        }, 5000); // 5000ms = 5 seconds
      </script>";
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
