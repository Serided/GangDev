<?php
require_once '/var/www/gangdev/shared/php/init_candor.php';
require_once '/var/www/gangdev/candor/files/php/countries.php';

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
$birthDisplay = 'Not set';
if ($birthdate !== '') {
    $ts = strtotime((string)$birthdate);
    if ($ts !== false) {
        $birthDisplay = date('M j, Y', $ts);
    }
}
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
$cookieKey = 'candor_time_format_' . $userId;
$timeFormat = $_COOKIE[$cookieKey] ?? '24';
$timeFormat = $timeFormat === '12' ? '12' : '24';
$timezone = $profile['timezone'] ?? '';
$countries = candor_country_list();
$countryCode = strtoupper((string)($profile['country_code'] ?? ''));
if ($countryCode === '' || !isset($countries[$countryCode])) {
	$countryCode = isset($countries['US']) ? 'US' : array_key_first($countries);
}
$timezoneMap = candor_country_timezones($countries);
$timezones = $timezoneMap[$countryCode] ?? candor_timezones_for_country($countryCode);
if (!$timezones) {
	$timezones = ['UTC'];
}
if ($timezone === '' || !in_array($timezone, $timezones, true)) {
	$timezone = $timezones[0] ?? 'UTC';
}
$candorMeta = 'account';
$candorLead = '';
$candorAuthed = true;
$candorName = $name !== '' ? $name : $email;
$candorShowMyOs = true;
$candorVersion = 'v0.2';
?>
<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Candor - Account</title>
	<?php require '/var/www/gangdev/candor/files/php/repetitive.php'; ?>

        <link rel="stylesheet" href="style.css">
    </head>
    <body>

        <div class="page">

            <?php require '/var/www/gangdev/candor/files/php/nav.php'; ?>

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

                    <div class="row">
                        <span class="label">Birthday</span>
                        <span class="value"><?= htmlspecialchars($birthDisplay) ?></span>
                    </div>
                </div>

				<div class="card profileCard">
					<h2>Essentials first.</h2>
					<p>Set the baseline now. Add refinements when you are ready.</p>

					<?php if ($profileError !== ''): ?>
						<div class="alert error"><?= htmlspecialchars($profileError) ?></div>
					<?php endif; ?>

					<form class="profileForm" method="post" action="/profile_update.php" data-unit="<?= htmlspecialchars($unitSystem) ?>">
						<input type="hidden" name="redirect" value="https://account.candor.you/">
						<div class="profileSection">
							<div class="sectionTitle">Essentials</div>
							<div class="bulletGrid">
								<div class="bulletField is-compact">
									<label class="label" for="account-country">Country</label>
									<select class="input compact select" id="account-country" name="country_code" data-country-select>
										<?php foreach ($countries as $code => $label): ?>
											<option value="<?= htmlspecialchars($code) ?>" <?= $code === $countryCode ? 'selected' : '' ?>>
												<?= htmlspecialchars($label) ?>
											</option>
										<?php endforeach; ?>
									</select>
								</div>
								<div class="bulletField is-compact">
									<label class="label" for="account-unit">Units</label>
									<select class="input compact select" id="account-unit" name="unit_system" data-unit-select>
										<option value="metric" <?= $unitSystem === 'metric' ? 'selected' : '' ?>>Metric (cm / kg)</option>
										<option value="imperial" <?= $unitSystem === 'imperial' ? 'selected' : '' ?>>Imperial (ft / lb)</option>
									</select>
								</div>
								<div class="bulletField is-compact">
									<label class="label" for="account-timezone">Time zone</label>
									<select class="input compact select" id="account-timezone" name="timezone" data-timezone-select>
										<?php foreach ($timezones as $tz): ?>
											<option value="<?= htmlspecialchars($tz) ?>" <?= $tz === $timezone ? 'selected' : '' ?>>
												<?= htmlspecialchars($tz) ?>
											</option>
										<?php endforeach; ?>
									</select>
								</div>
								<div class="bulletField is-compact">
									<label class="label" for="account-clock">Clock</label>
									<select class="input compact select" id="account-clock" name="clock_format" data-clock-select>
										<option value="24" <?= $timeFormat === '24' ? 'selected' : '' ?>>24-hour (military)</option>
										<option value="12" <?= $timeFormat === '12' ? 'selected' : '' ?>>12-hour (AM/PM)</option>
									</select>
								</div>
								<div class="unitFields" data-unit="metric">
									<div class="bulletField is-compact is-height">
									<label class="label" for="account-height-cm">Height</label>
									<div class="rangeValue">
										<input class="input compact" id="account-height-cm" type="number" name="height_cm" min="90" max="250" inputmode="numeric" value="<?= htmlspecialchars((string)$heightCm) ?>">
										<span class="unitBadge">cm</span>
									</div>
								</div>
								<div class="bulletField is-compact">
									<label class="label" for="account-weight-kg">Weight</label>
									<div class="rangeValue">
										<input class="input compact" id="account-weight-kg" type="number" name="weight_kg" min="30" max="300" step="0.1" inputmode="decimal" value="<?= htmlspecialchars((string)$weightKg) ?>">
										<span class="unitBadge">kg</span>
									</div>
								</div>
								</div>
								<div class="unitFields" data-unit="imperial">
									<div class="bulletField is-compact is-height">
									<label class="label">Height</label>
									<div class="heightSplit">
										<div class="rangeValue">
											<input class="input compact" id="account-height-ft" type="number" name="height_ft" min="3" max="8" inputmode="numeric" value="<?= htmlspecialchars((string)$heightFt) ?>">
											<span class="unitBadge">ft</span>
										</div>
										<div class="rangeValue">
											<input class="input compact" id="account-height-in" type="number" name="height_in" min="0" max="11" step="0.1" inputmode="decimal" value="<?= htmlspecialchars((string)$heightIn) ?>">
											<span class="unitBadge">in</span>
										</div>
									</div>
								</div>
								<div class="bulletField is-compact">
									<label class="label" for="account-weight-lb">Weight</label>
									<div class="rangeValue">
										<input class="input compact" id="account-weight-lb" type="number" name="weight_lb" min="66" max="660" step="0.1" inputmode="decimal" value="<?= htmlspecialchars((string)$weightLb) ?>">
										<span class="unitBadge">lb</span>
									</div>
								</div>
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

						<div class="saveWrap">
							<button class="btn primary" type="submit">Save</button>
							<?php if ($profileOk !== ''): ?>
								<div class="saveHint ok"><?= htmlspecialchars($profileOk) ?></div>
							<?php endif; ?>
						</div>
					</form>
				</div>
            </section>

			<?php require '/var/www/gangdev/candor/files/php/footer.php'; ?>

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

				const clockCookieKey = <?= json_encode($cookieKey) ?>;
				const setClockCookie = (value) => {
					const mode = value === '12' ? '12' : '24';
					document.cookie = `${clockCookieKey}=${mode}; path=/; domain=.candor.you; max-age=31536000`;
				};
				document.querySelectorAll('[data-clock-select]').forEach((select) => {
					setClockCookie(select.value);
					select.addEventListener('change', () => setClockCookie(select.value));
				});

				const timezoneMap = <?= json_encode($timezoneMap) ?>;
				const syncTimezones = (scope) => {
					const countrySelect = scope.querySelector('[data-country-select]');
					const timezoneSelect = scope.querySelector('[data-timezone-select]');
					const clockSelect = scope.querySelector('[data-clock-select]');
					if (!countrySelect || !timezoneSelect) return;
					const pad2 = (value) => String(value).padStart(2, '0');
					const formatZoneLabel = (zone, hour12) => {
						try {
							const formatter = new Intl.DateTimeFormat('en-US', {
								hour: '2-digit',
								minute: '2-digit',
								hour12,
								timeZone: zone,
							});
							return formatter.format(new Date());
						} catch (error) {
							return '';
						}
					};
					const getZoneOffset = (zone) => {
						try {
							const now = new Date();
							const formatter = new Intl.DateTimeFormat('en-US', {
								timeZone: zone,
								year: 'numeric',
								month: '2-digit',
								day: '2-digit',
								hour: '2-digit',
								minute: '2-digit',
								second: '2-digit',
								hourCycle: 'h23',
							});
							const parts = formatter.formatToParts(now).reduce((acc, part) => {
								if (part.type !== 'literal') {
									acc[part.type] = part.value;
								}
								return acc;
							}, {});
							const asUtc = Date.UTC(
								parseInt(parts.year, 10),
								parseInt(parts.month, 10) - 1,
								parseInt(parts.day, 10),
								parseInt(parts.hour, 10),
								parseInt(parts.minute, 10),
								parseInt(parts.second, 10)
							);
							return Math.round((asUtc - now.getTime()) / 60000);
						} catch (error) {
							return 0;
						}
					};
					const formatOffset = (minutes) => {
						const sign = minutes >= 0 ? '+' : '-';
						const total = Math.abs(minutes);
						const hours = pad2(Math.floor(total / 60));
						const mins = pad2(total % 60);
						return `UTC${sign}${hours}:${mins}`;
					};
					const getZoneAbbrev = (zone) => {
						try {
							const formatter = new Intl.DateTimeFormat('en-US', {
								timeZone: zone,
								timeZoneName: 'short',
							});
							const part = formatter.formatToParts(new Date()).find((item) => item.type === 'timeZoneName');
							const raw = part ? part.value : '';
							if (!raw) return '';
							const upper = raw.toUpperCase();
							if (upper.includes('GMT') || upper.includes('UTC')) return '';
							return raw.replace(/\s+/g, '');
						} catch (error) {
							return '';
						}
					};
					const buildOptions = (country, selected) => {
						const zones = timezoneMap[country] && timezoneMap[country].length
							? timezoneMap[country]
							: ['UTC'];
						const hour12 = clockSelect ? clockSelect.value === '12' : false;
						timezoneSelect.innerHTML = '';
						const bucket = new Map();
						zones.forEach((zone) => {
							const offset = getZoneOffset(zone);
							const abbrev = getZoneAbbrev(zone);
							const key = `${offset}|${abbrev}`;
							const timeLabel = formatZoneLabel(zone, hour12);
							const label = abbrev
								? `${formatOffset(offset)} (${abbrev})`
								: formatOffset(offset);
							const entry = { zone, offset, abbrev, label, timeLabel };
							if (!bucket.has(key) || zone === selected) {
								bucket.set(key, entry);
							}
						});
						const entries = Array.from(bucket.values()).sort((a, b) => {
							if (a.offset !== b.offset) return a.offset - b.offset;
							if (a.abbrev !== b.abbrev) return a.abbrev.localeCompare(b.abbrev);
							return a.zone.localeCompare(b.zone);
						});
						entries.forEach((entry) => {
							const option = document.createElement('option');
							option.value = entry.zone;
							option.textContent = entry.timeLabel
								? `${entry.label} \u00b7 ${entry.timeLabel}`
								: entry.label;
							if (entry.zone === selected) option.selected = true;
							timezoneSelect.appendChild(option);
						});
						if (!timezoneSelect.value && timezoneSelect.options.length) {
							timezoneSelect.selectedIndex = 0;
						}
					};
					buildOptions(countrySelect.value, timezoneSelect.value);
					countrySelect.addEventListener('change', () => {
						buildOptions(countrySelect.value, '');
					});
					if (clockSelect) {
						clockSelect.addEventListener('change', () => {
							buildOptions(countrySelect.value, timezoneSelect.value);
						});
					}
				};
				syncTimezones(document);
			})();
		</script>
    </body>
</html>






