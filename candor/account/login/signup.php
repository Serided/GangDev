<?php
require_once '/var/www/gangdev/shared/php/init_candor.php';

if (isset($_GET['check']) && $_GET['check'] === '1') {
	header('Content-Type: application/json');
	$username = trim($_GET['username'] ?? '');
	$valid = preg_match('/^[a-zA-Z0-9_-]{3,20}$/', $username) === 1;

	if ($username === '' || !$valid) {
		echo json_encode(['available' => false, 'message' => 'Use 3-20 letters, numbers, _ or -.']);
		exit;
	}

	if (!isset($pdo)) {
		echo json_encode(['available' => false, 'message' => 'Unable to check right now.']);
		exit;
	}

	$stmt = $pdo->prepare("SELECT 1 FROM candor.users WHERE LOWER(username) = LOWER(?) LIMIT 1");
	$stmt->execute([$username]);
	$exists = (bool)$stmt->fetchColumn();

	echo json_encode([
		'available' => !$exists,
		'message' => $exists ? 'Username taken.' : 'Username available.'
	]);
	exit;
}

$error = $_GET['error'] ?? '';
$ok = $_GET['ok'] ?? '';
$t = $_GET['t'] ?? '';

$prefill = [
	'username' => '',
	'email' => '',
];

if ($t !== '') {
    $stmt = $pdo->prepare("SELECT real_name, email FROM candor.signup_transfers WHERE token = ? AND expires_at > NOW()");
    $stmt->execute([$t]);
    $row = $stmt->fetch();
    if ($row) {
        $prefill['username'] = $row['real_name'] ?? '';
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
					<a href="https://account.dcops.co/login/signin.php"><span>DCOPS</span><span class="badge">product</span></a>
				</div>
			</div>
		</div>

        <div class="body">
			<form method="post" action="/login/process_signup.php" autocomplete="on" class="formPane">
				<input type="hidden" name="t" value="<?= htmlspecialchars($t) ?>">

				<div class="formHeader">
					<div class="formBadge">Create</div>
					<h1>Create your account</h1>
					<p>Create your account to unlock your workspace.</p>
				</div>

				<div class="formFields">
					<div class="formSection">
						<div class="sectionTitle">Identity</div>
						<div class="formSplit">
							<div class="field">
								<div class="label">Username</div>
								<input class="input" name="username" value="<?= htmlspecialchars($prefill['username']) ?>" required autocomplete="username" autocapitalize="none" spellcheck="false" pattern="[A-Za-z0-9_-]{3,20}" maxlength="20" id="usernameInput" data-username-check>
							</div>

							<div class="field">
								<div class="label">Email</div>
								<input class="input" name="email" value="<?= htmlspecialchars($prefill['email']) ?>" required autocomplete="email" inputmode="email">
							</div>

							<div class="status" id="usernameStatus" aria-live="polite"></div>
						</div>
					</div>

					<div class="formSection">
						<div class="sectionTitle">Security</div>
						<div class="formSplit">
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
					</div>
				</div>

				<div class="formActions">
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

        <div class="footer">
            <span>GangDev</span>
            <span>Candor</span>
        </div>

    </div>
</div>

</body>
</html>
