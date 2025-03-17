<?php
require_once '/var/www/gangdev/shared/php/init.php';
require_once "/var/www/gangdev/account/php/db.php";
require '/var/www/gangdev/account/php/vendor/autoload.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . "/..");
$dotenv->load();

// If the request is GET and a token is provided, show the password reset form.
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['token'])) {
	$token = trim($_GET['token']);

	// Check if the token exists and hasn't expired.
	$stmt = $pdo->prepare("SELECT email, expires_at FROM password_resets WHERE token = ?");
	$stmt->execute([$token]);
	$resetRequest = $stmt->fetch(PDO::FETCH_ASSOC);

	if (!$resetRequest) {
		echo "Invalid or expired token.";
		exit();
	}

	if (strtotime($resetRequest['expires_at']) < time()) {
		echo "This reset token has expired.";
		exit();
	}
	?>
	<!DOCTYPE html>
	<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Reset Password</title>
			<link href="recovery.css" rel="stylesheet">
			<?= $head ?>
		</head>
		<body>
			<div class="recoveryContainer">
				<div>
					<h2>Reset</h2>
					<h1>Password</h1>
				</div>
				<div class="centeredDiv">
					<form action="reset_password.php" method="post" class="mTop">
						<div>
							<label for="newPassword">New Password: </label>
							<input type="password" id="newPassword" name="newPassword" required>
						</div>
						<div>
							<label for="confirmPassword">Confirm Password: </label>
							<input type="password" id="confirmPassword" name="confirmPassword" required>
						</div>
						<div>
							<button type="submit" class="submit">Ya</button>
						</div>
					</form>
				</div>
			</div>
		</body>
	</html>
	<?php
	exit();
}

// If the request is POST, process the password reset.
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['token'])) {
	$token = trim($_POST['token']);
	$newPassword = trim($_POST['newPassword']);
	$confirmPassword = trim($_POST['confirmPassword']);

	// Check if the passwords match.
	if ($newPassword !== $confirmPassword) {
		echo "Passwords do not match.";
		exit();
	}

	// Look up the token in the password_resets table.
	$stmt = $pdo->prepare("SELECT email, expires_at FROM password_resets WHERE token = ?");
	$stmt->execute([$token]);
	$resetRequest = $stmt->fetch(PDO::FETCH_ASSOC);

	if (!$resetRequest) {
		echo "Invalid or expired token.";
		exit();
	}

	if (strtotime($resetRequest['expires_at']) < time()) {
		echo "This reset token has expired.";
		exit();
	}

	// Hash the new password.
	$hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

	// Update the user's password in the users table based on the email from the reset request.
	$stmt = $pdo->prepare("UPDATE users SET password = ? WHERE email = ?");
	if ($stmt->execute([$hashedPassword, $resetRequest['email']])) {
		// Delete the used token.
		$stmt = $pdo->prepare("DELETE FROM password_resets WHERE token = ?");
		$stmt->execute([$token]);

		echo "Your password has been reset successfully. You can now log in with your new password.";
	} else {
		echo "There was an error updating your password. Please try again.";
	}
	exit();
}

echo "Invalid request.";
?>
