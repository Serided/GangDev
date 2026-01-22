<?php
require_once '/var/www/gangdev/shared/php/init_dcops.php';
require_once '/var/www/gangdev/shared/php/mailer.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	header('Location: /login/signin.php');
	exit;
}

$email = strtolower(trim($_POST['email'] ?? ''));
$password = $_POST['password'] ?? '';

if ($email === '' || $password === '') {
	header('Location: /login/signin.php?error=' . urlencode('Email and password are required.'));
	exit;
}

$stmt = $pdo->prepare("
    SELECT id, email, real_name, password_hash, verified
    FROM dcops.users
    WHERE email = ?
    LIMIT 1
");
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
	header('Location: /login/signin.php?error=' . urlencode('Invalid email or password.'));
	exit;
}

if (empty($user['verified'])) {
	header('Location: /login/signin.php?error=' . urlencode('Verify your email before signing in.'));
	exit;
}

$code = str_pad((string)random_int(0, 999999), 6, '0', STR_PAD_LEFT);
$codeHash = password_hash($code, PASSWORD_DEFAULT);
$expiresAt = (new DateTimeImmutable('+10 minutes'))->format('Y-m-d H:i:s');

$pdo->prepare("DELETE FROM dcops.login_otps WHERE user_id = ?")->execute([(int)$user['id']]);

$ins = $pdo->prepare("
    INSERT INTO dcops.login_otps (user_id, code_hash, expires_at)
    VALUES (?, ?, ?)
");
$ins->execute([(int)$user['id'], $codeHash, $expiresAt]);

$_SESSION['dcops_login_user_id'] = (int)$user['id'];
$_SESSION['dcops_login_email'] = $user['email'];

$fromEmail = 'company@gangdev.co';
$fromName = 'GangDev / DCOPS';
$subject = 'DCOPS - Sign-in code: ' . $code;

$codeEsc = htmlspecialchars($code, ENT_QUOTES, 'UTF-8');
$nameEsc = htmlspecialchars($user['real_name'], ENT_QUOTES, 'UTF-8');

$htmlBody = '
<div style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace; background:#f7f9fc; padding:28px;">
  <div style="max-width:720px; margin:0 auto; background:#ffffff; border:1px solid rgba(11,18,32,.14); border-radius:16px; overflow:hidden;">
    <div style="padding:18px; border-bottom:1px solid rgba(11,18,32,.14);">
      <div style="font-weight:800; font-size:18px; letter-spacing:1px;">
        <span style="color:#4a0f1a;">DC</span><span style="color:#bfa14a;">OPS</span>
      </div>
      <div style="color:rgba(11,18,32,.55); font-size:12px; margin-top:6px;">DCOPS is built and operated by GangDev.</div>
    </div>

    <div style="padding:18px;">
      <div style="font-size:14px; color:#0b1220;">Hi ' . $nameEsc . ',</div>
      <div style="margin-top:10px; color:rgba(11,18,32,.72); font-size:13px;">
        Use this code to finish signing in:
      </div>

      <div style="margin-top:14px; font-size:28px; letter-spacing:6px; font-weight:800; color:#0b1220;">
        ' . $codeEsc . '
      </div>

      <div style="margin-top:14px; color:rgba(11,18,32,.55); font-size:12px;">
        This code expires in 10 minutes.
      </div>
    </div>

    <div style="padding:14px 18px; border-top:1px solid rgba(11,18,32,.14); color:rgba(11,18,32,.55); font-size:12px; display:flex; justify-content:space-between;">
      <span>GangDev</span><span>DCOPS</span>
    </div>
  </div>
</div>
';

$altBody =
	"DCOPS - Sign-in code\n\n" .
	"DCOPS is built and operated by GangDev.\n\n" .
	"Your code: {$code}\n" .
	"Expires in 10 minutes.\n";

$sent = sendMail($fromEmail, $fromName, $user['email'], $user['real_name'], $subject, $htmlBody, $altBody);

if (!$sent) {
	header('Location: /login/signin.php?error=' . urlencode('Could not send code. Try again.'));
	exit;
}

header('Location: /login/verify_login.php');
exit;
