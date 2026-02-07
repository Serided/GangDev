<?php
require_once '/var/www/gangdev/shared/php/init_candor.php';

candor_require_verified();

$userId = candor_current_user_id();
$user = $userId ? candor_user_row($userId) : null;
$name = $user['display_name'] ?? ($user['username'] ?? '');
$email = $user['email'] ?? '';
$profile = $userId ? candor_profile_row($userId) : null;
$needsProfile = $userId ? candor_profile_needs_setup($userId) : false;
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
	<title>your Candor</title>
	<link rel="icon" href="/files/img/favicon/favicon.ico?v=3" type="image/x-icon">
	<link rel="shortcut icon" href="/files/img/favicon/favicon.ico?v=3" type="image/x-icon">
	<link rel="icon" type="image/png" sizes="32x32" href="/files/img/favicon/favicon-32.png?v=3">
	<link rel="icon" type="image/png" sizes="64x64" href="/files/img/favicon/favicon-64.png?v=3">
	<link rel="icon" type="image/png" sizes="128x128" href="/files/img/favicon/favicon-128.png?v=3">
	<link rel="stylesheet" href="style.css">
	<script src="script.js" defer></script>
</head>
<body class="is-do" data-user-key="<?= htmlspecialchars((string)$userId) ?>">

<div class="page">
	<header class="nav">
		<a class="brand brandLink" href="https://candor.you/">
			<div class="logo"><span class="logoGlyph">C</span></div>
			<div class="brandText">
				<div class="brandTitle"><span class="brandLead">your</span><span class="brandName">Candor</span></div>
				<div class="meta minimal">personal OS</div>
			</div>
		</a>

		<div class="actions">
			<span class="welcome">Welcome, <a class="accountLink" href="https://account.candor.you/"><?= htmlspecialchars($name !== '' ? $name : $email) ?></a></span>
			<a class="btn accent" href="https://account.candor.you/login/signout.php">Sign out</a>
		</div>
	</header>

	<section class="calendarShell">
		<div class="calendarPanel dayPanel">
			<div class="dayHeader">
				<div class="dayIntro">
				<div class="dayTag">Strive for perfection. Execute with intent.</div>
				<div class="dayTitle" data-day-title>Today</div>
				<div class="dayMeta" data-day-sub></div>
			</div>
			<div class="focusStrip">
				<div class="focusCard">
					<div class="focusLabel">Execution pace</div>
					<div class="focusValue" data-focus-pace>On track</div>
					<div class="focusSub">Updates as blocks land: ahead, on track, behind.</div>
				</div>
				<div class="focusCard">
					<div class="focusLabel">24h balance</div>
					<div class="focusValue" data-focus-balance>8h / 8h / 8h</div>
					<div class="balanceBar">
						<span class="balanceSegment is-sleep"></span>
						<span class="balanceSegment is-focus"></span>
						<span class="balanceSegment is-life"></span>
					</div>
					<div class="focusSub">Sleep / Focus / Life. Tune your split.</div>
				</div>
				<div class="focusCard">
					<div class="focusLabel">Momentum</div>
					<div class="focusValue" data-focus-momentum>0-day streak</div>
					<div class="focusSub">Finish blocks to build momentum.</div>
				</div>
			</div>
		</div>

			<div class="dayTimeline">
				<div class="timelineHeader">
					<span>Day timeline</span>
					<span class="timelineMeta" data-day-short></span>
				</div>
				<div class="timelineGrid" data-day-grid></div>
			</div>
		</div>

		<div class="calendarPanel monthPanel">
			<div class="monthHeader">
				<button class="monthNav" type="button" data-month-nav="prev" aria-label="Previous month">&lsaquo;</button>
				<div class="monthTitle" data-month-title></div>
				<button class="monthToday" type="button" data-month-nav="today">Today</button>
				<button class="monthNav" type="button" data-month-nav="next" aria-label="Next month">&rsaquo;</button>
			</div>
			<div class="weekdayRow">
				<span>Mon</span>
				<span>Tue</span>
				<span>Wed</span>
				<span>Thu</span>
				<span>Fri</span>
				<span>Sat</span>
				<span>Sun</span>
			</div>
			<div class="monthGrid" data-month-grid></div>
		</div>
	</section>

	<button class="fab" type="button" aria-label="Create">+</button>

	<div class="footer">
		<a class="footLink" href="https://updates.candor.you/"><span class="footStrong">Candor</span> v0.1</a>
		<a class="footLink" href="https://gangdev.co/">Built by <span class="footStrong">GangDev</span></a>
	</div>
</div>

<?php if ($needsProfile): ?>
<div class="onboardOverlay" role="dialog" aria-modal="true">
	<div class="onboardCard">
		<div class="onboardHeader">
			<div class="onboardTitle">Finish setting up your account</div>
			<div class="onboardSub">Baseline details power better schedules and sleep targets.</div>
		</div>

		<?php if ($profileError !== ''): ?>
			<div class="alert error"><?= htmlspecialchars($profileError) ?></div>
		<?php elseif ($profileOk !== ''): ?>
			<div class="alert ok"><?= htmlspecialchars($profileOk) ?></div>
		<?php endif; ?>

		<form class="onboardForm" method="post" action="https://account.candor.you/profile_update.php" data-unit="<?= htmlspecialchars($unitSystem) ?>">
			<input type="hidden" name="redirect" value="https://do.candor.you/">
			<div class="field">
				<label class="label" for="profile-unit">Units</label>
				<select class="input select" id="profile-unit" name="unit_system" data-unit-select>
					<option value="metric" <?= $unitSystem === 'metric' ? 'selected' : '' ?>>Metric (cm / kg)</option>
					<option value="imperial" <?= $unitSystem === 'imperial' ? 'selected' : '' ?>>Imperial (ft / lb)</option>
				</select>
			</div>
			<div class="onboardGrid">
				<div class="field">
					<label class="label" for="profile-birthdate">Birthday</label>
					<input class="input" id="profile-birthdate" type="date" name="birthdate" required value="<?= htmlspecialchars((string)$birthdate) ?>">
				</div>
				<div class="unitFields" data-unit="metric">
					<div class="field">
						<label class="label" for="profile-height-cm">Height (cm)</label>
						<input class="input" id="profile-height-cm" type="number" name="height_cm" min="90" max="250" inputmode="numeric" value="<?= htmlspecialchars((string)$heightCm) ?>">
					</div>
					<div class="field">
						<label class="label" for="profile-weight-kg">Weight (kg)</label>
						<input class="input" id="profile-weight-kg" type="number" name="weight_kg" min="30" max="300" step="0.1" inputmode="decimal" value="<?= htmlspecialchars((string)$weightKg) ?>">
					</div>
				</div>
				<div class="unitFields" data-unit="imperial">
					<div class="field">
						<label class="label" for="profile-height-ft">Height (ft)</label>
						<input class="input" id="profile-height-ft" type="number" name="height_ft" min="3" max="8" inputmode="numeric" value="<?= htmlspecialchars((string)$heightFt) ?>">
					</div>
					<div class="field">
						<label class="label" for="profile-height-in">Height (in)</label>
						<input class="input" id="profile-height-in" type="number" name="height_in" min="0" max="11" inputmode="numeric" value="<?= htmlspecialchars((string)$heightIn) ?>">
					</div>
					<div class="field">
						<label class="label" for="profile-weight-lb">Weight (lb)</label>
						<input class="input" id="profile-weight-lb" type="number" name="weight_lb" min="66" max="660" step="0.1" inputmode="decimal" value="<?= htmlspecialchars((string)$weightLb) ?>">
					</div>
				</div>
			</div>

			<label class="consentLine">
				<input type="checkbox" name="consent_health" value="1" <?= $consent ? 'checked' : '' ?> required>
				<span>I understand this data is stored to tailor schedules, sleep targets, and wellness insights.</span>
			</label>

			<div class="onboardNote">
				We only use this for personalization. You can update or remove it anytime from your account.
			</div>

			<button class="btn primary" type="submit">Save baseline</button>
		</form>
	</div>
</div>
<?php endif; ?>

</body>
</html>
