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
	<link rel="icon" href="https://candor.you/files/img/favicon/favicon.ico?v=8" type="image/x-icon">
	<link rel="icon" href="https://candor.you/files/img/favicon/favicon-dark.ico?v=8" type="image/x-icon" media="(prefers-color-scheme: dark)">
	<link rel="shortcut icon" href="https://candor.you/files/img/favicon/favicon.ico?v=8" type="image/x-icon">
	<link rel="shortcut icon" href="https://candor.you/files/img/favicon/favicon-dark.ico?v=8" type="image/x-icon" media="(prefers-color-scheme: dark)">
	<link rel="icon" type="image/png" sizes="32x32" href="https://candor.you/files/img/favicon/favicon-32.png?v=8">
	<link rel="icon" type="image/png" sizes="32x32" href="https://candor.you/files/img/favicon/favicon-dark-32.png?v=8" media="(prefers-color-scheme: dark)">
	<link rel="icon" type="image/png" sizes="64x64" href="https://candor.you/files/img/favicon/favicon-64.png?v=8">
	<link rel="icon" type="image/png" sizes="64x64" href="https://candor.you/files/img/favicon/favicon-dark-64.png?v=8" media="(prefers-color-scheme: dark)">
	<link rel="icon" type="image/png" sizes="128x128" href="https://candor.you/files/img/favicon/favicon-128.png?v=8">
	<link rel="icon" type="image/png" sizes="128x128" href="https://candor.you/files/img/favicon/favicon-dark-128.png?v=8" media="(prefers-color-scheme: dark)">

	<link rel="stylesheet" href="/login/login.css">
	<script src="/login/login.js" defer></script>
</head>
<body class="is-verify">

<div class="canvas">
	<div class="shell">

		<div class="top">
		<a class="brand brandLink" href="https://candor.you/">
			<div class="brandMark"><span class="logoGlyph">C</span></div>
			<div class="brandText">
				<div class="brandTitle"><span class="brandName">Candor</span></div>
				<div class="meta minimal">account</div>
			</div>
		</a>

			<div class="productSwitch">
				<button class="switchBtn" type="button">other sign-ins</button>
				<div class="pop">
					<a href="https://account.gangdev.co/login/signin.php"><span>GangDev</span><span class="badge">main</span></a>
					<a href="https://account.dcops.co/login/signin.php"><span>DCOPS</span><span class="badge">product</span></a>
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
			<a class="footLink" href="https://gangdev.co/"><span class="footStrong">GangDev</span></a>
			<a class="footLink" href="https://candor.you/"><span class="footStrong">Candor</span></a>
		</div>

	</div>
</div>

</body>
</html>

