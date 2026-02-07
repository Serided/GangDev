<?php
require_once '/var/www/gangdev/shared/php/init_candor.php';

$token = trim($_GET['token'] ?? '');
$error = '';

if ($token !== '') {
	$stmt = $pdo->prepare("
		SELECT id, verify_expires_at
		FROM candor.users
		WHERE verify_token = ?
		LIMIT 1
	");
	$stmt->execute([$token]);
	$user = $stmt->fetch();

	if (!$user || ($user['verify_expires_at'] && strtotime($user['verify_expires_at']) < time())) {
		$error = 'Invalid or expired token.';
	} else {
		$upd = $pdo->prepare("
			UPDATE candor.users
			SET email_verified = TRUE, verify_token = NULL, verify_expires_at = NULL
			WHERE id = ?
		");
		$upd->execute([(int)$user['id']]);

		header('Location: /login/signin.php?ok=' . urlencode('Email verified. You can sign in.'));
		exit;
	}
}
?>
<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Candor - Verify email</title>

	<link rel="stylesheet" href="/login/login.css">
	<script src="/login/login.js" defer></script>
</head>
<body>

<div class="canvas">
	<div class="shell">

		<div class="top">
			<div class="brand">
				<div class="brandMark"><span class="logoGlyph">C</span></div>
				<div class="brandText">
					<div class="brandTitle"><span class="brandName">CANDOR</span></div>
					<div class="meta">account</div>
				</div>
			</div>

			<div class="productSwitch">
				<button class="switchBtn" type="button">other sign-ins</button>
				<div class="pop">
					<a href="https://account.gangdev.co/login/signin.php"><span>GangDev</span><span class="badge">main</span></a>
					<a href="https://account.dcops.co/login/signin.php"><span>DCOPS</span><span class="badge">ops</span></a>
					<a href="/login/signin.php"><span>Candor</span><span class="badge">here</span></a>
				</div>
			</div>
		</div>

		<div class="body">
			<h1>Verify your email</h1>
			<p>Check your inbox for a verification link.</p>

			<div class="row">
				<div class="links">
					<a href="/login/signin.php">Back to sign in</a>
				</div>
			</div>

			<?php if ($error !== ''): ?>
				<div class="error"><?= htmlspecialchars($error) ?></div>
			<?php endif; ?>
		</div>

		<div class="footer">
			<span>GangDev</span>
			<span>Candor</span>
		</div>

	</div>
</div>

</body>
</html>
