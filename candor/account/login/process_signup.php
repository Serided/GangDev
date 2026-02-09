<?php
require_once '/var/www/gangdev/shared/php/init_candor.php';
require_once '/var/www/gangdev/shared/php/mailer.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	header('Location: /login/signup.php');
	exit;
}

$displayName = trim($_POST['display_name'] ?? '');
$username = trim($_POST['username'] ?? '');
$email = strtolower(trim($_POST['email'] ?? ''));
$confirmEmail = strtolower(trim($_POST['confirm_email'] ?? ''));
$password = $_POST['password'] ?? '';
$confirm = $_POST['confirm_password'] ?? '';
$birthdate = trim($_POST['birthdate'] ?? '');
$consentHealth = isset($_POST['consent_health']) && $_POST['consent_health'] === '1';

if ($displayName === '' || $username === '' || $email === '' || $confirmEmail === '' || $password === '' || $confirm === '') {
	header('Location: /login/signup.php?error=' . urlencode('All fields are required.'));
	exit;
}

if ($email !== $confirmEmail) {
	header('Location: /login/signup.php?error=' . urlencode('Emails do not match.'));
	exit;
}

if (!preg_match('/^[a-zA-Z0-9][a-zA-Z0-9 _-]{2,19}$/', $displayName)) {
	header('Location: /login/signup.php?error=' . urlencode('Display name must be 3-20 letters, numbers, spaces, _ or -.'));
	exit;
}

if (!preg_match('/^[a-zA-Z0-9_-]{3,20}$/', $username)) {
	header('Location: /login/signup.php?error=' . urlencode('Username must be 3-20 letters, numbers, _ or -.'));
	exit;
}

if ($password !== $confirm) {
	header('Location: /login/signup.php?error=' . urlencode('Passwords do not match.'));
	exit;
}

if ($birthdate !== '') {
	if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $birthdate)) {
		header('Location: /login/signup.php?error=' . urlencode('Birthday must use YYYY-MM-DD.'));
		exit;
	}
	if ($birthdate > date('Y-m-d')) {
		header('Location: /login/signup.php?error=' . urlencode('Birthday cannot be in the future.'));
		exit;
	}
	if (!$consentHealth) {
		header('Location: /login/signup.php?error=' . urlencode('Consent is required to store your birthday.'));
		exit;
	}
} elseif ($consentHealth) {
	header('Location: /login/signup.php?error=' . urlencode('Birthday is required when consent is checked.'));
	exit;
}

$stmt = $pdo->prepare(
	"SELECT 1 FROM candor.users WHERE LOWER(email) = LOWER(?) OR LOWER(username) = LOWER(?) OR LOWER(display_name) = LOWER(?) LIMIT 1"
);
$stmt->execute([$email, $username, $displayName]);

if ($stmt->fetchColumn()) {
	header('Location: /login/signup.php?error=' . urlencode('Display name, username, or email already in use.'));
	exit;
}

$hash = password_hash($password, PASSWORD_DEFAULT);
$token = bin2hex(random_bytes(32));
$expiresAt = (new DateTimeImmutable('+60 minutes'))->format('Y-m-d H:i:s');

$stmt = $pdo->prepare("
	INSERT INTO candor.users (email, username, display_name, password_hash, email_verified, verify_token, verify_expires_at, last_verification_sent_at)
	VALUES (?, ?, ?, ?, FALSE, ?, ?, NOW())
	RETURNING id
");

$stmt->execute([
	$email,
	$username,
	$displayName,
	$hash,
	$token,
	$expiresAt
]);

$user_id = $stmt->fetchColumn();

if ($birthdate !== '' && $consentHealth) {
	try {
		$profileStmt = $pdo->prepare("
			INSERT INTO candor.user_profiles (user_id, birthdate, unit_system, consent_health, adaptive_sleep, consent_at, created_at, updated_at, onboarding_completed_at)
			VALUES (?, ?, 'metric', TRUE, TRUE, NOW(), NOW(), NOW(), NOW())
			ON CONFLICT (user_id) DO UPDATE SET
				birthdate = EXCLUDED.birthdate,
				unit_system = EXCLUDED.unit_system,
				consent_health = TRUE,
				adaptive_sleep = TRUE,
				consent_at = NOW(),
				updated_at = NOW(),
				onboarding_completed_at = COALESCE(candor.user_profiles.onboarding_completed_at, NOW())
		");
		$profileStmt->execute([(int)$user_id, $birthdate]);
	} catch (Throwable $e) {
	}
}

$verifyUrl = 'https://account.candor.you/login/verify.php?token=' . urlencode($token);

$verifyUrlEsc = htmlspecialchars($verifyUrl, ENT_QUOTES, 'UTF-8');
$nameEsc = htmlspecialchars($displayName, ENT_QUOTES, 'UTF-8');

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
        <span style="color:#7b3f22;">Candor</span>
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
           style="display:inline-block; padding:12px 14px; border-radius:12px; border:1px solid rgba(123,63,34,.25); background:rgba(123,63,34,.08); color:#0b1220; text-decoration:none;">
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
	"Hi {$displayName},\n\n" .
	"Verify your email to activate your account:\n{$verifyUrl}\n\n" .
	"This link expires in 60 minutes.\n";

$sent = sendMail($fromEmail, $fromName, $email, $displayName, $subject, $htmlBody, $altBody);

if (!$sent) {
	header('Location: /login/signup.php?error=' . urlencode('Email failed to send. Try again.'));
	exit;
}

header('Location: /login/verify.php');
exit;
