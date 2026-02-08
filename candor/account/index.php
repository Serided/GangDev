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
        <link rel="icon" href="https://candor.you/files/img/favicon/favicon.ico?v=4" type="image/x-icon">
        <link rel="shortcut icon" href="https://candor.you/files/img/favicon/favicon.ico?v=4" type="image/x-icon">
        <link rel="icon" type="image/png" sizes="32x32" href="https://candor.you/files/img/favicon/favicon-32.png?v=4">
        <link rel="icon" type="image/png" sizes="64x64" href="https://candor.you/files/img/favicon/favicon-64.png?v=4">
        <link rel="icon" type="image/png" sizes="128x128" href="https://candor.you/files/img/favicon/favicon-128.png?v=4">

        <link rel="stylesheet" href="style.css">
    </head>
    <body>

        <div class="page">

            <div class="top">
            <a class="brand brandLink" href="https://candor.you/">
                <div class="brandMark"><span class="logoGlyph">C</span></div>
                <div class="brandText">
                    <div class="brandTitle"><span class="brandName">Candor</span></div>
                    <div class="meta minimal">account</div>
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
					<h2>Essentials first.</h2>
					<p>Set the baseline now. Add refinements when you are ready.</p>

					<?php if ($profileError !== ''): ?>
						<div class="alert error"><?= htmlspecialchars($profileError) ?></div>
					<?php elseif ($profileOk !== ''): ?>
						<div class="alert ok"><?= htmlspecialchars($profileOk) ?></div>
					<?php endif; ?>

					<form class="profileForm" method="post" action="/profile_update.php" data-unit="<?= htmlspecialchars($unitSystem) ?>">
						<input type="hidden" name="redirect" value="https://account.candor.you/">
						<div class="profileSection">
							<div class="sectionTitle">Essentials</div>
							<div class="bulletGrid">
								<div class="bulletField is-compact">
									<label class="label" for="account-unit">Units</label>
									<select class="input compact select" id="account-unit" name="unit_system" data-unit-select>
										<option value="metric" <?= $unitSystem === 'metric' ? 'selected' : '' ?>>Metric (cm / kg)</option>
										<option value="imperial" <?= $unitSystem === 'imperial' ? 'selected' : '' ?>>Imperial (ft / lb)</option>
									</select>
								</div>
								<div class="bulletField is-compact">
									<label class="label" for="account-birthdate">Birthday</label>
									<input class="input compact" id="account-birthdate" type="date" name="birthdate" required value="<?= htmlspecialchars((string)$birthdate) ?>">
								</div>
							</div>
							<div class="unitFields bulletGrid" data-unit="metric">
								<div class="bulletField">
									<label class="label" for="account-height-cm">Height</label>
									<div class="rangeGroup" data-range-group>
										<input type="range" min="90" max="250" value="<?= htmlspecialchars((string)($heightCm !== '' && $heightCm !== null ? $heightCm : 170)) ?>" data-range>
										<div class="rangeValue">
											<input class="input compact" id="account-height-cm" type="number" name="height_cm" min="90" max="250" inputmode="numeric" value="<?= htmlspecialchars((string)$heightCm) ?>" data-range-output>
											<span class="unitBadge">cm</span>
										</div>
									</div>
								</div>
								<div class="bulletField is-compact">
									<label class="label" for="account-weight-kg">Weight</label>
									<div class="rangeGroup" data-range-group>
										<input type="range" min="30" max="300" step="0.1" value="<?= htmlspecialchars((string)($weightKg !== '' && $weightKg !== null ? $weightKg : 70)) ?>" data-range>
										<div class="rangeValue">
											<input class="input compact" id="account-weight-kg" type="number" name="weight_kg" min="30" max="300" step="0.1" inputmode="decimal" value="<?= htmlspecialchars((string)$weightKg) ?>" data-range-output>
											<span class="unitBadge">kg</span>
										</div>
									</div>
								</div>
							</div>
							<div class="unitFields bulletGrid" data-unit="imperial">
								<div class="bulletField">
									<label class="label">Height</label>
									<div class="heightSplit">
										<div class="rangeGroup" data-range-group>
											<input type="range" min="3" max="8" value="<?= htmlspecialchars((string)($heightFt !== '' && $heightFt !== null ? $heightFt : 5)) ?>" data-range>
											<div class="rangeValue">
												<input class="input compact" id="account-height-ft" type="number" name="height_ft" min="3" max="8" inputmode="numeric" value="<?= htmlspecialchars((string)$heightFt) ?>" data-range-output>
												<span class="unitBadge">ft</span>
											</div>
										</div>
										<div class="rangeGroup" data-range-group>
											<input type="range" min="0" max="11" value="<?= htmlspecialchars((string)($heightIn !== '' && $heightIn !== null ? $heightIn : 8)) ?>" data-range>
											<div class="rangeValue">
												<input class="input compact" id="account-height-in" type="number" name="height_in" min="0" max="11" inputmode="numeric" value="<?= htmlspecialchars((string)$heightIn) ?>" data-range-output>
												<span class="unitBadge">in</span>
											</div>
										</div>
									</div>
								</div>
								<div class="bulletField is-compact">
									<label class="label" for="account-weight-lb">Weight</label>
									<div class="rangeGroup" data-range-group>
										<input type="range" min="66" max="660" step="0.1" value="<?= htmlspecialchars((string)($weightLb !== '' && $weightLb !== null ? $weightLb : 160)) ?>" data-range>
										<div class="rangeValue">
											<input class="input compact" id="account-weight-lb" type="number" name="weight_lb" min="66" max="660" step="0.1" inputmode="decimal" value="<?= htmlspecialchars((string)$weightLb) ?>" data-range-output>
											<span class="unitBadge">lb</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="profileSection">
							<div class="sectionTitle">Refinements</div>
							<div class="sectionHint">More metrics land here once essentials are set.</div>
						</div>

						<label class="consentLine">
							<input type="checkbox" name="consent_health" value="1" <?= $consent ? 'checked' : '' ?> required>
							<span>I understand this data is stored to personalize schedules, sleep targets, and wellness insights.</span>
						</label>

						<div class="profileNote">
							We only use this for personalization. You can update or remove it anytime.
						</div>

						<button class="btn primary" type="submit">Save</button>
					</form>
				</div>
            </section>

			<div class="footer">
				<a class="footLink" href="https://updates.candor.you/"><span class="footStrong">Candor</span> v0.1</a>
				<a class="footLink" href="https://gangdev.co/">Built by <span class="footStrong">GangDev</span></a>
			</div>

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

				document.querySelectorAll('[data-range-group]').forEach((group) => {
					const range = group.querySelector('[data-range]');
					const output = group.querySelector('[data-range-output]');
					if (!range || !output) return;
					if (output.value !== '') {
						range.value = output.value;
					}
					range.addEventListener('input', () => {
						output.value = range.value;
					});
					output.addEventListener('input', () => {
						if (output.value !== '') {
							range.value = output.value;
						}
					});
				});
			})();
		</script>
    </body>
</html>
