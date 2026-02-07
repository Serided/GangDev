<?php
require_once '/var/www/gangdev/shared/php/init_candor.php';

$error = $_GET['error'] ?? '';
$ok = $_GET['ok'] ?? '';
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Candor - Sign in</title>
    <link rel="icon" href="/files/img/favicon/favicon.ico?v=3" type="image/x-icon">
    <link rel="shortcut icon" href="/files/img/favicon/favicon.ico?v=3" type="image/x-icon">
    <link rel="icon" type="image/png" sizes="32x32" href="/files/img/favicon/favicon-32.png?v=3">
    <link rel="icon" type="image/png" sizes="64x64" href="/files/img/favicon/favicon-64.png?v=3">
    <link rel="icon" type="image/png" sizes="128x128" href="/files/img/favicon/favicon-128.png?v=3">

    <link rel="stylesheet" href="/login/login.css">
    <script src="/login/login.js" defer></script>
</head>
<body class="is-signin">

<div class="canvas">
    <div class="shell">

        <div class="top">
			<a class="brand brandLink" href="https://candor.you/">
				<div class="brandMark"><span class="logoGlyph">C</span></div>
				<div class="brandText">
					<div class="brandTitle"><span class="brandName">Candor</span></div>
					<div class="meta">account</div>
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
			<form method="post" action="/login/process_signin.php" autocomplete="on" class="formPane">
				<div class="formHeader">
					<h1>Sign in</h1>
					<p>Sign in to operate your <span class="osEm">personal OS</span>.</p>
				</div>

				<div class="formFields">
					<div class="field">
						<div class="label">Username</div>
						<input class="input" name="username" required autocomplete="username" autocapitalize="none" spellcheck="false">
					</div>

					<div class="field">
						<div class="label">Password</div>
						<div class="pwWrap">
							<input class="input pw" type="password" name="password" required autocomplete="current-password" id="pwLogin">
							<button class="pwBtn" type="button" data-toggle-password="#pwLogin">show</button>
						</div>
					</div>
				</div>

				<div class="formActions">
					<div class="row">
						<button class="btn primary" type="submit">Sign in</button>
						<div class="links">
							<a href="/login/signup.php">Create account</a>
						</div>
					</div>
				</div>

				<?php if ($error !== ''): ?>
					<div class="error"><?= htmlspecialchars($error) ?></div>
				<?php endif; ?>

				<?php if ($ok !== ''): ?>
					<div class="ok"><?= htmlspecialchars($ok) ?></div>
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
