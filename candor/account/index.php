<?php
require_once '/var/www/gangdev/shared/php/init_candor.php';

if (!isset($_SESSION['candor_user_id'])) {
	header('Location: https://account.candor.you/login/signin.php');
	exit;
}

$userId = candor_current_user_id();
$name  = $_SESSION['candor_name'] ?? '';
$email = $_SESSION['candor_email'] ?? '';
$profile = $userId ? candor_profile_row($userId) : null;
$profileError = $_GET['profile_error'] ?? '';
$profileOk = $_GET['profile_ok'] ?? '';
$birthdate = $profile['birthdate'] ?? '';
$heightCm = $profile['height_cm'] ?? '';
$weightKg = $profile['weight_kg'] ?? '';
$unitSystem = $profile['unit_system'] ?? 'metric';
$heightFt = '';
$heightIn = '';
$weightLb = '';
if ($unitSystem === 'imperial') {
	if ($heightCm !== '' && $heightCm !== null) {
		$totalInches = (int)round(((float)$heightCm) / 2.54);
		$heightFt = (string)floor($totalInches / 12);
		$heightIn = (string)($totalInches % 12);
	}
	if ($weightKg !== '' && $weightKg !== null) {
		$weightLb = (string)round(((float)$weightKg) * 2.20462, 1);
	}
}
$unitSystem = $unitSystem === 'imperial' ? 'imperial' : 'metric';
$consent = !empty($profile['consent_health']);
?>
<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Candor - Account</title>
        <link rel="icon" href="/files/img/favicon/favicon.ico?v=3" type="image/x-icon">
        <link rel="shortcut icon" href="/files/img/favicon/favicon.ico?v=3" type="image/x-icon">
        <link rel="icon" type="image/png" sizes="32x32" href="/files/img/favicon/favicon-32.png?v=3">
        <link rel="icon" type="image/png" sizes="64x64" href="/files/img/favicon/favicon-64.png?v=3">
        <link rel="icon" type="image/png" sizes="128x128" href="/files/img/favicon/favicon-128.png?v=3">

        <link rel="stylesheet" href="style.css">
    </head>
    <body>

        <div class="page">

            <div class="top">
            <a class="brand brandLink" href="https://candor.you/">
                <div class="brandMark"><span class="logoGlyph">C</span></div>
                <div class="brandText">
                    <div class="brandTitle"><span class="brandName">Candor</span></div>
                    <div class="meta">account</div>
                </div>
            </a>

                <div class="topActions">
                    <span class="welcome">Welcome, <a class="accountLink" href="https://account.candor.you/"><?= htmlspecialchars($name !== '' ? $name : $email) ?></a></span>
                    <a class="btn primary" href="https://do.candor.you/">My OS</a>
                    <form method="post" action="/login/signout.php">
                        <button type="submit" class="btn accent">Sign out</button>
                    </form>
                </div>
            </div>

            <section class="accountLayout">
                <div class="card heroCard">
                    <div class="tag">Account</div>
                    <h1>Keep your access clean.</h1>
                    <p>Manage your account details and sign-in settings for your personal OS.</p>
                </div>

                <div class="card detailsCard">
                    <div class="row">
                        <span class="label">Name</span>
                        <span class="value"><?= htmlspecialchars($name) ?></span>
                    </div>

                    <div class="row">
                        <span class="label">Email</span>
                        <span class="value"><?= htmlspecialchars($email) ?></span>
                    </div>
                </div>

				<div class="card profileCard">
					<div class="tag">Baseline</div>
					<h2>Build a smarter schedule.</h2>
					<p>These details help tune sleep targets, workload balance, and long-term planning.</p>

					<?php if ($profileError !== ''): ?>
						<div class="alert error"><?= htmlspecialchars($profileError) ?></div>
					<?php elseif ($profileOk !== ''): ?>
						<div class="alert ok"><?= htmlspecialchars($profileOk) ?></div>
					<?php endif; ?>

					<form class="profileForm" method="post" action="/profile_update.php" data-unit="<?= htmlspecialchars($unitSystem) ?>">
						<input type="hidden" name="redirect" value="https://account.candor.you/">
						<div class="field">
							<label class="label" for="account-unit">Units</label>
							<select class="input select" id="account-unit" name="unit_system" data-unit-select>
								<option value="metric" <?= $unitSystem === 'metric' ? 'selected' : '' ?>>Metric (cm / kg)</option>
								<option value="imperial" <?= $unitSystem === 'imperial' ? 'selected' : '' ?>>Imperial (ft / lb)</option>
							</select>
						</div>
						<div class="profileGrid">
							<div class="field">
								<label class="label" for="account-birthdate">Birthday</label>
								<input class="input" id="account-birthdate" type="date" name="birthdate" required value="<?= htmlspecialchars((string)$birthdate) ?>">
							</div>
							<div class="unitFields" data-unit="metric">
								<div class="field">
									<label class="label" for="account-height-cm">Height (cm)</label>
									<input class="input" id="account-height-cm" type="number" name="height_cm" min="90" max="250" inputmode="numeric" value="<?= htmlspecialchars((string)$heightCm) ?>">
								</div>
								<div class="field">
									<label class="label" for="account-weight-kg">Weight (kg)</label>
									<input class="input" id="account-weight-kg" type="number" name="weight_kg" min="30" max="300" step="0.1" inputmode="decimal" value="<?= htmlspecialchars((string)$weightKg) ?>">
								</div>
							</div>
							<div class="unitFields" data-unit="imperial">
								<div class="field">
									<label class="label" for="account-height-ft">Height (ft)</label>
									<input class="input" id="account-height-ft" type="number" name="height_ft" min="3" max="8" inputmode="numeric" value="<?= htmlspecialchars((string)$heightFt) ?>">
								</div>
								<div class="field">
									<label class="label" for="account-height-in">Height (in)</label>
									<input class="input" id="account-height-in" type="number" name="height_in" min="0" max="11" inputmode="numeric" value="<?= htmlspecialchars((string)$heightIn) ?>">
								</div>
								<div class="field">
									<label class="label" for="account-weight-lb">Weight (lb)</label>
									<input class="input" id="account-weight-lb" type="number" name="weight_lb" min="66" max="660" step="0.1" inputmode="decimal" value="<?= htmlspecialchars((string)$weightLb) ?>">
								</div>
							</div>
						</div>

						<label class="consentLine">
							<input type="checkbox" name="consent_health" value="1" <?= $consent ? 'checked' : '' ?> required>
							<span>I understand this data is stored to personalize schedules, sleep targets, and wellness insights.</span>
						</label>

						<div class="profileNote">
							We only use this for personalization. You can update or remove it anytime.
						</div>

						<button class="btn primary" type="submit">Save baseline</button>
					</form>
				</div>
            </section>

        </div>

		<script>
			(() => {
				const selects = document.querySelectorAll('[data-unit-select]');
				selects.forEach((select) => {
					const form = select.closest('form');
					if (!form) return;
					const apply = () => {
						const value = select.value === 'imperial' ? 'imperial' : 'metric';
						form.dataset.unit = value;
					};
					apply();
					select.addEventListener('change', apply);
				});
			})();
		</script>
    </body>
</html>
