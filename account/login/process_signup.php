<?php
require_once '/var/www/gangdev/shared/php/init.php';
require_once '/var/www/gangdev/shared/php/mailer.php';

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
	header("Location: signup.php");
	exit();
}

$displayname = trim($_POST["displayname"]);
$username = trim($_POST["username"]);
$email = trim($_POST["email"]);
$confirmEmail = trim($_POST["confirmEmail"]);
$password = trim($_POST["password"]);
$confirmPassword = trim($_POST["confirmPassword"]);

if (empty($displayname) || empty($username) || empty($email) || empty($confirmEmail) || empty($password) || empty($confirmPassword)) {
	header("Location: signup.php?error=1");
	exit();
}
if ($email !== $confirmEmail) {
	header("Location: signup.php?error=2");
	exit();
}
if ($password !== $confirmPassword) {
	header("Location: signup.php?error=3");
	exit();
}

$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch(PDO::FETCH_ASSOC)) {
	header("Location: signup.php?error=4");
	exit();
}

$hashed_password = password_hash($password, PASSWORD_DEFAULT);
$verification_token = bin2hex(random_bytes(16)); // 32-character token
$token_expires = date("Y-m-d H:i:s", time() + 3600); // 1 hour expiration

$stmt = $pdo->prepare("INSERT INTO pending_users (displayname, username, email, password, verification_token, token_expires) VALUES (?, ?, ?, ?, ?, ?)");
if (!$stmt->execute([$displayname, $username, $email, $hashed_password, $verification_token, $token_expires])) {
	header("Location: signup.php?error=5");
	exit();
}

$verify_url = "https://account.gangdev.co/login/verify.php?token=" . $verification_token;
$fromEmail = 'company@gangdev.co';
$fromName  = 'GangDev';
$subject   = 'Verify your email address';
$htmlBody  = "Hello $displayname,<br><br>Click the link below to verify your email:<br>
              <a href='$verify_url'>$verify_url</a><br><br>If you did not sign up, ignore this email.";
$altBody   = "Hello $displayname,\n\nVisit this link to verify your email: $verify_url\n\nIf you did not sign up, ignore this email.";

if (sendMail($fromEmail, $fromName, $email, $displayname, $subject, $htmlBody, $altBody)) {
	echo "A verification email has been sent to " . htmlspecialchars($email) . ". Please check your email to complete your registration.";
} else {
	error_log("Mailer Error: Failed to send verification email for $email");
	echo "There was an error sending the verification email. Please try again later.";
}
exit();
?>