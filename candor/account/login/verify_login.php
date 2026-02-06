<?php
require_once '/var/www/gangdev/shared/php/init_candor.php';

$error = $_GET['error'] ?? '';
$email = $_SESSION['candor_login_email'] ?? '';

if (!isset($_SESSION['candor_login_user_id'])) {
	header('Location: /login/signin.php');
	exit;
}
?>
<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Candor - Verify sign-in</title>

	<link rel="stylesheet" href="/login/login.css">
	<script src="/login/login.js" defer></script>
</head>
<body>

<div class="canvas">
	<div class="shell">

		<div class="top">
			<div class="brand">
				<div class="brandMark"><span class="dc">DC</span><span class="ops">OPS</span></div>
				<div class="meta">account</div>
			</div>

			<div class="productSwitch">
				<button class="switchBtn" type="button">other sign-ins</button>
				<div class="pop">
					<a href="https://account.gangdev.co/login/"><span>GangDev</span><span class="badge">main</span></a>
					<a href="/login/signin.php"><span>Candor</span><span class="badge">here</span></a>
				</div>
			</div>
		</div>

		<div class="body">
			<h1>Verify sign-in</h1>
			<p>Enter the 6-digit code sent to <?= htmlspecialchars($email) ?>.</p>

			<form method="post" action="/login/process_verify_login.php" autocomplete="off">
				<div class="grid" style="grid-template-columns: 1fr;">
					<div class="field">
						<div class="label">Code</div>
						<input class="input" name="code" required inputmode="numeric" pattern="[0-9]{6}" maxlength="6" autocomplete="one-time-code">
					</div>
				</div>

				<div class="row">
					<button class="btn primary" type="submit">Finish</button>
					<div class="links">
						<a href="/login/signin.php">Start over</a>
					</div>
				</div>

				<?php if ($error !== ''): ?>
					<div class="error"><?= htmlspecialchars($error) ?></div>
				<?php endif; ?>
			</form>
		</div>

		<div class="footer">
			<span>GangDev</span>
			<span>Candor</span>
		</div>

	</div>
</div>

</body>
</html>
