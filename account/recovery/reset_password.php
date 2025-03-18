<?php
require_once '/var/www/gangdev/shared/php/init.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . "/..");
$dotenv->load();

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['token'])) {
	$token = trim($_GET['token']);

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
					<form action="reset_password.php" method="post" class="mTop">
						<input type="hidden" name="token" value="<?php echo htmlspecialchars($token); ?>">

						<div class="centeredDiv">
							<div class="inputDiv">
								<label for="newPassword">New Password: </label>
								<input type="password" id="newPassword" name="newPassword" required>
							</div>
							<div class="inputDiv">
								<label for="confirmPassword">Confirm Password: </label>
								<input type="password" id="confirmPassword" name="confirmPassword" required>
							</div>
						</div>
						<div class="centeredDiv mTop">
							<button type="submit" class="submit">Ya</button>
						</div>
					</form>
			</div>
		</body>
	</html>
	<?php
	exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['token'])) {
	$token = trim($_POST['token']);
	$newPassword = trim($_POST['newPassword']);
	$confirmPassword = trim($_POST['confirmPassword']);

	if ($newPassword !== $confirmPassword) {
		echo "Passwords do not match.";
		exit();
	}

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

	$hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

	$stmt = $pdo->prepare("UPDATE users SET password = ? WHERE email = ?");
	if ($stmt->execute([$hashedPassword, $resetRequest['email']])) {
		$stmt = $pdo->prepare("DELETE FROM password_resets WHERE token = ?");
		$stmt->execute([$token]);

		echo "Your password has been reset successfully. You can now log in with your new password.";
		echo "<br><br>You will be redirected shortly.";
		echo "<script>
        setTimeout(function() {
            window.location.href = 'https://account.gangdev.co/login/signin.php';
        }, 5000);
      </script>";
	} else {
		echo "There was an error updating your password. Please try again.";
	}
	exit();
}

echo "Invalid request.";
?>
