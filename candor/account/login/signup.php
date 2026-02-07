<?php
require_once '/var/www/gangdev/shared/php/init_candor.php';

$error = $_GET['error'] ?? '';
$ok = $_GET['ok'] ?? '';
$t = $_GET['t'] ?? '';

$prefill = [
        'name' => '',
        'email' => '',
];

if ($t !== '') {
    $stmt = $pdo->prepare("SELECT real_name, email FROM candor.signup_transfers WHERE token = ? AND expires_at > NOW()");
    $stmt->execute([$t]);
    $row = $stmt->fetch();
    if ($row) {
        $prefill['name'] = $row['real_name'] ?? '';
        $prefill['email'] = $row['email'] ?? '';
    }
}
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Candor - Create account</title>

    <link rel="stylesheet" href="/login/login.css">
    <script src="/login/login.js" defer></script>
</head>
<body class="is-signup">

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
					<h1>Create your account</h1>
					<p>Set up your Candor workspace and jump into do.candor.you.</p>

					<form method="post" action="/login/process_signup.php" autocomplete="on">
						<input type="hidden" name="t" value="<?= htmlspecialchars($t) ?>">

						<div class="grid">
							<div class="field" style="grid-column: 1 / -1;">
								<div class="label">Name</div>
								<input class="input" name="name" value="<?= htmlspecialchars($prefill['name']) ?>" required autocomplete="name">
							</div>

							<div class="field" style="grid-column: 1 / -1;">
								<div class="labelRow">
									<div class="label">Email</div>
									<div class="hint">
										<button class="hintBtn" type="button" aria-label="Why email matters">?</button>
										<div class="hintPop">
											Used for account access and recovery.
										</div>
									</div>
								</div>
								<input class="input" name="email" value="<?= htmlspecialchars($prefill['email']) ?>" required autocomplete="email" inputmode="email">
							</div>

							<div class="field">
								<div class="label">Password</div>
								<div class="pwWrap">
									<input class="input pw" type="password" name="password" required autocomplete="new-password" id="pw1">
									<button class="pwBtn" type="button" data-toggle-password="#pw1">show</button>
								</div>
							</div>

							<div class="field">
								<div class="label">Confirm password</div>
								<input class="input" type="password" name="confirm_password" required autocomplete="new-password">
							</div>
						</div>

						<div class="row">
							<button class="btn primary" type="submit">Create account</button>
							<div class="links">
								<a href="/login/signin.php">Sign in</a>
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
					<div class="sideCard alt">
						<div class="sideBadge">Setup</div>
						<h2>Build your operating system.</h2>
						<p>Start clean. Candor keeps the day sharp and the backlog honest.</p>
						<div class="sideSteps">
							<div class="sideStep"><span>1</span><span>Create your account</span></div>
							<div class="sideStep"><span>2</span><span>Open do.candor.you</span></div>
							<div class="sideStep"><span>3</span><span>Plan and execute</span></div>
						</div>
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
