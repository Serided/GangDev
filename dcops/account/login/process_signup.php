<?php
require_once '/var/www/gangdev/shared/php/init_dcops.php';
require_once '/var/www/gangdev/shared/php/mailer.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	header('Location: /login/signup.php');
	exit;
}

$name = trim($_POST['name'] ?? '');
$email = strtolower(trim($_POST['email'] ?? ''));
$password = $_POST['password'] ?? '';
$confirm = $_POST['confirm_password'] ?? '';
$t = trim($_POST['t'] ?? '');

if ($name === '' || $email === '' || $password === '' || $confirm === '') {
	header('Location: /login/signup.php?error=' . urlencode('All fields are required.'));
	exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
	header('Location: /login/signup.php?error=' . urlencode('Invalid email.'));
	exit;
}

if ($password !== $confirm) {
	header('Location: /login/signup.php?error=' . urlencode('Passwords do not match.'));
	exit;
}

if (strlen($password) < 10) {
	header('Location: /login/signup.php?error=' . urlencode('Password must be at least 10 characters.'));
	exit;
}

$stmt = $pdo->prepare("SELECT 1 FROM dcops.users WHERE email = ? LIMIT 1");
$stmt->execute([$email]);

if ($stmt->fetchColumn()) {
	header('Location: /login/signin.php?error=' . urlencode('Account already exists. Sign in.'));
	exit;
}

$org = dcops_org_from_email($email);

$token = bin2hex(random_bytes(32));
$expiresAt = (new DateTimeImmutable('+60 minutes'))->format('Y-m-d H:i:s');
$hash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $pdo->prepare("SELECT id FROM dcops.pending_users WHERE email = ? LIMIT 1");
$stmt->execute([$email]);
$pendingId = $stmt->fetchColumn();

if ($pendingId) {
	$stmt = $pdo->prepare("
        UPDATE dcops.pending_users
        SET real_name = ?, password_hash = ?, verification_token = ?, token_expires = ?, organization = ?
        WHERE id = ?
    ");
	$stmt->execute([$name, $hash, $token, $expiresAt, $org, $pendingId]);
} else {
	$stmt = $pdo->prepare("
        INSERT INTO dcops.pending_users (email, real_name, password_hash, verification_token, token_expires, organization)
        VALUES (?, ?, ?, ?, ?, ?)
    ");
	$stmt->execute([$email, $name, $hash, $token, $expiresAt, $org]);
}

if ($t !== '') {
	$del = $pdo->prepare("DELETE FROM dcops.signup_transfers WHERE token = ?");
	$del->execute([$t]);
}

$verifyUrl = 'https://account.dcops.co/verify.php?token=' . urlencode($token);

$fromEmail = 'company@gangdev.co';
$fromName = 'GangDev';
$subject = 'DCOPS — Verify your email';

$headerLine = 'DCOPS is built and operated by GangDev.';

$htmlBody = '
<div style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace; background:#f7f9fc; padding:28px;">
  <div style="max-width:720px; margin:0 auto; background:#ffffff; border:1px solid rgba(11,18,32,.14); border-radius:16px; overflow:hidden;">
    <div style="padding:18px; border-bottom:1px solid rgba(11,18,32,.14);">
      <div style="font-weight:800; font-size:18px; letter-spacing:1px;">
        <span style="color:#4a0f1a;">DC</span><span style="color:#bfa14a;">OPS</span>
      </div>
      <div style="color:rgba(11,18,32,.55); font-size:12px; margin-top:6px;">' . htmlspecialchars($headerLine) . '</div>
    </div>

    <div style="padding:18px;">
      <div style="font-size:14px; color:#0b1220;">Hi ' . htmlspecialchars($name) . ',</div>
      <div style="margin-top:10px; color:rgba(11,18,32,.72); font-size:13px;">
        Verify your email to activate your account.
      </div>

      <div style="margin-top:16px;">
        <a href="' . htmlspecialchars($verifyUrl) . '" style="display:inline-block; padding:12px 14px; border-radius:12px; border:1px solid rgba(11,18,32,.14); background:rgba(74,15,26,.06); color:#0b1220; text-decoration:none;">
          Verify email
        </a>
      </div>

      <div style="margin-top:14px; color:rgba(11,18,32,.55); font-size:12px;">
        This link expires in 60 minutes.
      </div>

      <div style="margin-top:16px; padding:12px; border:1px dashed rgba(11,18,32,.18); border-radius:12px; color:rgba(11,18,32,.72); font-size:12px; word-break:break-all;">
        ' . htmlspecialchars($verifyUrl) . '
      </div>
    </div>

    <div style="padding:14px 18px; border-top:1px solid rgba(11,18,32,.14); color:rgba(11,18,32,.55); font-size:12px; display:flex; justify-content:space-between;">
      <span>GangDev</span><span>DCOPS</span>
    </div>
  </div>
</div>
';

$altBody =
	"DCOPS — Verify your email\n\n" .
	$headerLine . "\n\n" .
	"Hi {$name},\n\n" .
	"Verify your email to activate your account:\n{$verifyUrl}\n\n" .
	"This link expires in 60 minutes.\n";

$sent = sendMail($fromEmail, $fromName, $email, $name, $subject, $htmlBody, $altBody);

if (!$sent) {
	header('Location: /login/signup.php?error=' . urlencode('Email failed to send. Try again.'));
	exit;
}

header('Location: /login/signup.php?ok=' . urlencode('Verification email sent. Check your inbox.'));
exit;
