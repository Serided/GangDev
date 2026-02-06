<?php
require_once '/var/www/gangdev/shared/php/init_candor.php';
require_once '/var/www/gangdev/shared/php/mailer.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	header('Location: /login/signup.php');
	exit;
}

$name = trim($_POST['name'] ?? '');
$email = strtolower(trim($_POST['email'] ?? ''));
$password = $_POST['password'] ?? '';
$confirm = $_POST['confirm_password'] ?? '';

if ($name === '' || $email === '' || $password === '' || $confirm === '') {
	header('Location: /login/signup.php?error=' . urlencode('All fields are required.'));
	exit;
}

if ($password !== $confirm) {
	header('Location: /login/signup.php?error=' . urlencode('Passwords do not match.'));
	exit;
}

$stmt = $pdo->prepare(
	"SELECT 1 FROM candor.users WHERE email = ? OR username = ? LIMIT 1"
);
$stmt->execute([$email, $name]);

if ($stmt->fetchColumn()) {
	header('Location: /login/signin.php?error=' . urlencode('Account already exists. Sign in.'));
	exit;
}

$hash = password_hash($password, PASSWORD_DEFAULT);
$token = bin2hex(random_bytes(32));
$expiresAt = (new DateTimeImmutable('+60 minutes'))->format('Y-m-d H:i:s');

$stmt = $pdo->prepare("
	INSERT INTO candor.users (email, username, password_hash, email_verified, verify_token, verify_expires_at, last_verification_sent_at)
	VALUES (?, ?, ?, FALSE, ?, ?, NOW())
	RETURNING id
");

$stmt->execute([
	$email,
	$name,
	$hash,
	$token,
	$expiresAt
]);

$user_id = $stmt->fetchColumn();

$verifyUrl = 'https://account.candor.you/login/verify.php?token=' . urlencode($token);

$verifyUrlEsc = htmlspecialchars($verifyUrl, ENT_QUOTES, 'UTF-8');
$nameEsc = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');

$fromEmail = 'company@gangdev.co';
$fromName = 'GangDev / Candor';
$subject = 'Candor - Verify your email';

$headerLine = 'Candor is built and operated by GangDev.';
$headerLineEsc = htmlspecialchars($headerLine, ENT_QUOTES, 'UTF-8');

$htmlBody = '
<div style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace; background:#f7f9fc; padding:28px;">
  <div style="max-width:720px; margin:0 auto; background:#ffffff; border:1px solid rgba(11,18,32,.14); border-radius:16px; overflow:hidden;">
    <div style="padding:18px; border-bottom:1px solid rgba(11,18,32,.14);">
      <div style="font-weight:800; font-size:18px; letter-spacing:1px;">
        <span style="color:#4a0f1a;">DC</span><span style="color:#bfa14a;">OPS</span>
      </div>
      <div style="color:rgba(11,18,32,.55); font-size:12px; margin-top:6px;">' . $headerLineEsc . '</div>
    </div>

    <div style="padding:18px;">
      <div style="font-size:14px; color:#0b1220;">Hi ' . $nameEsc . ',</div>
      <div style="margin-top:10px; color:rgba(11,18,32,.72); font-size:13px;">
        Verify your email to activate your account.
      </div>

      <div style="margin-top:16px;">
        <a href="' . $verifyUrlEsc . '" target="_blank" rel="noopener noreferrer"
           style="display:inline-block; padding:12px 14px; border-radius:12px; border:1px solid rgba(11,18,32,.14); background:rgba(74,15,26,.06); color:#0b1220; text-decoration:none;">
          Verify email
        </a>
      </div>

      <div style="margin-top:14px; color:rgba(11,18,32,.55); font-size:12px;">
        This link expires in 60 minutes.
      </div>

      <div style="margin-top:16px; padding:12px; border:1px dashed rgba(11,18,32,.18); border-radius:12px; font-size:12px; word-break:break-all;">
        <a href="' . $verifyUrlEsc . '" target="_blank" rel="noopener noreferrer"
           style="color:#0b1220; text-decoration:underline;">
          ' . $verifyUrlEsc . '
        </a>
      </div>
    </div>

    <div style="padding:14px 18px; border-top:1px solid rgba(11,18,32,.14); color:rgba(11,18,32,.55); font-size:12px; display:flex; justify-content:space-between;">
      <span>GangDev</span><span>Candor</span>
    </div>
  </div>
</div>
';

$altBody =
	"Candor - Verify your email\n\n" .
	$headerLine . "\n\n" .
	"Hi {$name},\n\n" .
	"Verify your email to activate your account:\n{$verifyUrl}\n\n" .
	"This link expires in 60 minutes.\n";

$sent = sendMail($fromEmail, $fromName, $email, $name, $subject, $htmlBody, $altBody);

if (!$sent) {
	header('Location: /login/signup.php?error=' . urlencode('Email failed to send. Try again.'));
	exit;
}

header('Location: /login/verify.php');
exit;
