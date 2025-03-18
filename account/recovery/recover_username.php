<?php
require_once '/var/www/gangdev/shared/php/init.php';
require_once '/var/www/gangdev/account/php/mailer.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . "/..");
$dotenv->load();

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
		$fromEmail = 'company@gangdev.co';
		$fromName  = 'GangDev';
		$subject   = 'Your GangDev Username';
		$htmlBody  = "Hello,<br><br>Your username is: <strong>$username</strong>.<br><br>If you did not request this recovery, please ignore this email.";
		$altBody   = "Hello,\n\nYour username is: $username\n\nIf you did not request this recovery, please ignore this email.";

		if (sendMail($fromEmail, $fromName, $email, $username, $subject, $htmlBody, $altBody)) {
			$_SESSION['last_recovery'] = time();
			echo "An email with your username has been sent to " . htmlspecialchars($email) . ".";
			echo "<br><br>You will be redirected shortly.";
			echo "<script>
                    setTimeout(function() {
                        window.location.href = 'https://account.gangdev.co/login/signin.php';
                    }, 5000);
                  </script>";
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
