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

    <link rel="stylesheet" href="/login/login.css">
    <script src="/login/login.js" defer></script>
</head>
<body class="is-signin">

<div class="canvas">
    <div class="shell">

        <div class="top">
			<div class="brand">
				<div class="brandMark"><span class="logoGlyph">C</span></div>
				<div class="brandText">
					<div class="brandTitle"><span class="brandLead">your</span><span class="brandName">CANDOR</span></div>
					<div class="meta">account</div>
				</div>
			</div>

            <div class="productSwitch">
                <button class="switchBtn" type="button">other sign-ins</button>
                <div class="pop">
					<a href="https://account.gangdev.co/login/signin.php"><span>GangDev</span><span class="badge">main</span></a>
					<a href="https://account.dcops.co/login/signin.php"><span>DCOPS</span><span class="badge">ops</span></a>
				</div>
			</div>
		</div>

        <div class="body">
			<div class="bodyGrid">
				<div class="formPane">
					<h1>Sign in</h1>
					<p>Open your do.candor.you dashboard.</p>

					<form method="post" action="/login/process_signin.php" autocomplete="on">
						<div class="grid" style="grid-template-columns: 1fr;">
							<div class="field">
								<div class="label">Email</div>
								<input class="input" name="email" required autocomplete="email" inputmode="email">
							</div>

							<div class="field">
								<div class="label">Password</div>
								<div class="pwWrap">
									<input class="input pw" type="password" name="password" required autocomplete="current-password" id="pwLogin">
									<button class="pwBtn" type="button" data-toggle-password="#pwLogin">show</button>
								</div>
							</div>
						</div>

						<div class="row">
							<button class="btn primary" type="submit">Continue</button>
							<div class="links">
								<a href="/login/signup.php">Create account</a>
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

				<div class="sidePane">
					<div class="sideCard">
						<div class="sideBadge">Dashboard</div>
						<h2>Execution cockpit, ready.</h2>
						<p>Jump into do.candor.you and run today with precision.</p>
						<ul class="sideList">
							<li><span>Tasks</span><span>Live status</span></li>
							<li><span>Notes</span><span>Fast capture</span></li>
							<li><span>Planner</span><span>Constraint first</span></li>
						</ul>
					</div>
				</div>
			</div>
        </div>

        <div class="footer">
            <span>GangDev</span>
            <span>Candor</span>
        </div>

    </div>
</div>

</body>
</html>
