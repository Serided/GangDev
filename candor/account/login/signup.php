<?php
require_once '/var/www/gangdev/shared/php/init_candor.php';

if (isset($_GET['check']) && $_GET['check'] === '1') {
	header('Content-Type: application/json');
	$displayName = trim($_GET['display_name'] ?? '');
	$valid = preg_match('/^[a-zA-Z0-9][a-zA-Z0-9 _-]{2,19}$/', $displayName) === 1;

	if ($displayName === '' || !$valid) {
		echo json_encode(['available' => false, 'message' => 'Use 3-20 letters, numbers, spaces, _ or -.']);
		exit;
	}

	if (!isset($pdo)) {
		echo json_encode(['available' => false, 'message' => 'Unable to check right now.']);
		exit;
	}

	$stmt = $pdo->prepare("SELECT 1 FROM candor.users WHERE LOWER(display_name) = LOWER(?) LIMIT 1");
	$stmt->execute([$displayName]);
	$exists = (bool)$stmt->fetchColumn();

	echo json_encode([
		'available' => !$exists,
		'message' => $exists ? 'Display name taken.' : 'Display name available.'
	]);
	exit;
}

$error = $_GET['error'] ?? '';
$ok = $_GET['ok'] ?? '';
$t = $_GET['t'] ?? '';

$prefill = [
	'display_name' => '',
	'username' => '',
	'email' => '',
	'birthdate' => '',
];

if ($t !== '') {
    $stmt = $pdo->prepare("SELECT real_name, email FROM candor.signup_transfers WHERE token = ? AND expires_at > NOW()");
    $stmt->execute([$t]);
    $row = $stmt->fetch();
    if ($row) {
        $prefill['display_name'] = $row['real_name'] ?? '';
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
    <link rel="icon" href="https://candor.you/files/img/favicon/favicon.ico?v=4" type="image/x-icon">
    <link rel="shortcut icon" href="https://candor.you/files/img/favicon/favicon.ico?v=4" type="image/x-icon">
    <link rel="icon" type="image/png" sizes="32x32" href="https://candor.you/files/img/favicon/favicon-32.png?v=4">
    <link rel="icon" type="image/png" sizes="64x64" href="https://candor.you/files/img/favicon/favicon-64.png?v=4">
    <link rel="icon" type="image/png" sizes="128x128" href="https://candor.you/files/img/favicon/favicon-128.png?v=4">

    <link rel="stylesheet" href="/login/login.css">
    <script src="/login/login.js" defer></script>
</head>
<body class="is-signup">

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
			<form method="post" action="/login/process_signup.php" autocomplete="on" class="formPane">
				<input type="hidden" name="t" value="<?= htmlspecialchars($t) ?>">

				<div class="formHeader">
					<h1>Create your account</h1>
					<p>Create your account to unlock your <span class="osEm">personal OS</span>.</p>
				</div>

				<div class="formFields">
					<div class="formSection">
						<div class="sectionTitle">Identity</div>
						<div class="formIndent">
							<div class="formSplit">
								<div class="field fieldInlineLabel">
									<div class="inputRow">
										<input class="input" name="display_name" value="<?= htmlspecialchars($prefill['display_name']) ?>" required autocomplete="nickname" spellcheck="false" pattern="[A-Za-z0-9][A-Za-z0-9 _-]{2,19}" maxlength="20" id="displayNameInput" data-display-check>
										<div class="hint">
											<button class="hintBtn" type="button" aria-label="Display name info">?</button>
											<div class="hintPop">This is what everyone sees. It must be unique.</div>
										</div>
									</div>
									<div class="label">Display name</div>
								</div>

								<div class="field fieldSpacer" aria-hidden="true"></div>

								<div class="field">
									<div class="label">Email</div>
									<input class="input" name="email" value="<?= htmlspecialchars($prefill['email']) ?>" required autocomplete="email" inputmode="email">
								</div>

								<div class="field">
									<div class="label">Verify email</div>
									<input class="input" name="confirm_email" value="<?= htmlspecialchars($prefill['email']) ?>" required autocomplete="email" inputmode="email">
								</div>

								<div class="field">
									<div class="label">Birthday</div>
									<input class="input" type="date" name="birthdate" value="<?= htmlspecialchars($prefill['birthdate']) ?>">
								</div>

								<div class="field fieldFull">
									<label class="consentLine">
										<input type="checkbox" name="consent_health" value="1">
										<span>I agree to store my birthday for scheduling and sleep personalization.</span>
									</label>
								</div>

								<div class="status" id="displayNameStatus" aria-live="polite"></div>
							</div>
						</div>
					</div>

					<div class="formSection">
						<div class="sectionTitle">Security</div>
						<div class="formIndent">
							<div class="formSplit">
								<div class="field">
									<div class="label">Username</div>
									<div class="inputRow">
										<input class="input" name="username" value="<?= htmlspecialchars($prefill['username']) ?>" required autocomplete="username" autocapitalize="none" spellcheck="false" pattern="[A-Za-z0-9_-]{3,20}" maxlength="20">
										<div class="hint">
											<button class="hintBtn" type="button" aria-label="Username info">?</button>
											<div class="hintPop">Used only for sign-in and security. Keep it private and hard to guess.</div>
										</div>
									</div>
								</div>

								<div class="field fieldSpacer" aria-hidden="true"></div>

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
				</div>

				<div class="formActions">
					<div class="row">
						<button class="btn primary" type="submit">Create account</button>
						<div class="links">
							<a href="/login/signin.php">Sign in</a>
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
