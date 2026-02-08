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
$cookieKey = 'candor_time_format_' . $userId;
$timeFormat = $_COOKIE[$cookieKey] ?? '24';
$timeFormat = $timeFormat === '12' ? '12' : '24';
$candorMeta = 'personal OS';
$candorLead = 'your';
$candorAuthed = true;
$candorName = $name !== '' ? $name : $email;
$candorShowMyOs = false;
$candorVersion = 'v0.2';
?>
<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>your Candor</title>
	<link rel="icon" href="https://candor.you/files/img/favicon/favicon.ico?v=13" type="image/x-icon">
	<link rel="icon" href="https://candor.you/files/img/favicon/favicon-dark.ico?v=13" type="image/x-icon" media="(prefers-color-scheme: dark)">
	<link rel="shortcut icon" href="https://candor.you/files/img/favicon/favicon.ico?v=13" type="image/x-icon">
	<link rel="shortcut icon" href="https://candor.you/files/img/favicon/favicon-dark.ico?v=13" type="image/x-icon" media="(prefers-color-scheme: dark)">
	<link rel="icon" type="image/png" sizes="32x32" href="https://candor.you/files/img/favicon/favicon-32.png?v=13">
	<link rel="icon" type="image/png" sizes="32x32" href="https://candor.you/files/img/favicon/favicon-dark-32.png?v=13" media="(prefers-color-scheme: dark)">
	<link rel="icon" type="image/png" sizes="64x64" href="https://candor.you/files/img/favicon/favicon-64.png?v=13">
	<link rel="icon" type="image/png" sizes="64x64" href="https://candor.you/files/img/favicon/favicon-dark-64.png?v=13" media="(prefers-color-scheme: dark)">
	<link rel="icon" type="image/png" sizes="128x128" href="https://candor.you/files/img/favicon/favicon-128.png?v=13">
	<link rel="icon" type="image/png" sizes="128x128" href="https://candor.you/files/img/favicon/favicon-dark-128.png?v=13" media="(prefers-color-scheme: dark)">
	<link rel="stylesheet" href="style.css">
	<script src="script.js" defer></script>
</head>
<body class="is-do" data-user-key="<?= htmlspecialchars((string)$userId) ?>" data-user-name="<?= htmlspecialchars($name !== '' ? $name : $email) ?>" data-birthdate="<?= htmlspecialchars((string)$birthdate) ?>" data-clock-cookie="<?= htmlspecialchars($cookieKey) ?>">

<div class="page">
	<?php require '/var/www/gangdev/candor/files/php/nav.php'; ?>

	<section class="calendarShell">
		<div class="calendarPanel dayPanel">
			<div class="dayHeader">
				<div class="dayIntroRow">
					<div class="dayIntro">
						<div class="dayTag">Your strive for perfection.</div>
						<div class="daySchedule is-empty" data-day-schedule></div>
						<div class="dayTitle" data-day-title>Today</div>
						<div class="dayMeta" data-day-sub></div>
					</div>
					<button class="panelAdd" type="button" data-add-kind="window" aria-label="Add window">+</button>
				</div>
				<div class="focusStrip">
					<div class="focusCard">
						<div class="focusLabel">
							<span class="labelLong">Execution pace</span>
							<span class="labelShort">Pace</span>
						</div>
						<div class="focusValue" data-focus-pace>
							<span class="valueLong">On pace</span>
							<span class="valueShort">On pace</span>
						</div>
						<div class="paceTrack"><span class="paceDot is-on"></span></div>
						<div class="focusSub">Margin check: ahead, on pace, behind.</div>
					</div>
					<div class="focusCard">
						<div class="focusLabel">
							<span class="labelLong">24h balance</span>
							<span class="labelShort">24h</span>
						</div>
						<div class="focusValue" data-focus-balance>
							<span class="valueLong">8h sleep / 8h focus / 8h life</span>
							<span class="valueShort">8h/8h/8h</span>
						</div>
						<div class="balanceBar">
							<span class="balanceSegment is-sleep"></span>
							<span class="balanceSegment is-focus"></span>
							<span class="balanceSegment is-life"></span>
						</div>
						<div class="focusSub">24h split, adjustable by goal.</div>
					</div>
					<div class="focusCard">
						<div class="focusLabel">
							<span class="labelLong">Momentum</span>
							<span class="labelShort">Momentum</span>
						</div>
						<div class="focusValue" data-focus-momentum>
							<span class="valueLong">0-day momentum</span>
							<span class="valueShort">0-day</span>
						</div>
						<div class="momentumDots">
							<span class="dot is-on"></span>
							<span class="dot"></span>
							<span class="dot"></span>
							<span class="dot"></span>
							<span class="dot"></span>
						</div>
						<div class="focusSub">Momentum grows with each completed window.</div>
					</div>
				</div>
				<div class="railStack">
					<div class="rail">
						<div class="railLabel">Priority tasks</div>
						<div class="railList" data-task-rail></div>
					</div>
					<div class="rail">
						<div class="railLabel">Notes</div>
						<div class="railList" data-note-rail></div>
					</div>
				</div>
			</div>

			<div class="dayTimeline">
				<div class="timelineHeader">
					<span>Today timeline</span>
					<span class="timelineMeta" data-day-short></span>
				</div>
				<div class="timelineGrid" data-day-grid></div>
			</div>
			<a class="panelAction panelCore" href="https://create.candor.you/">Core</a>
		</div>

		<div class="calendarPanel monthPanel">
			<div class="monthHeader">
				<button class="monthAction monthToday" type="button" data-month-nav="today">Today</button>
				<div class="monthTitleWrap">
					<button class="monthNav" type="button" data-month-nav="prev" aria-label="Previous month">&lsaquo;</button>
					<div class="monthTitle" data-month-title></div>
					<button class="monthNav" type="button" data-month-nav="next" aria-label="Next month">&rsaquo;</button>
				</div>
				<button class="monthAction monthAdd" type="button" data-month-add aria-label="Plan ahead">+</button>
			</div>
			<div class="weekdayRow">
				<span>Sun</span>
				<span>Mon</span>
				<span>Tue</span>
				<span>Wed</span>
				<span>Thu</span>
				<span>Fri</span>
				<span>Sat</span>
			</div>
			<div class="monthGrid" data-month-grid></div>
			<div class="monthPopover" data-month-popover>
				<div class="monthPopoverHead">
					<div class="monthPopoverTitle" data-popover-title></div>
					<button class="iconBtn" type="button" data-popover-close aria-label="Close">&times;</button>
				</div>
				<div class="monthPopoverList" data-popover-list></div>
			</div>
		</div>
	</section>

	<?php require '/var/www/gangdev/candor/files/php/footer.php'; ?>
</div>

<div class="createOverlay" data-create-overlay>
	<div class="createCard">
		<div class="createHeader">
			<div>
				<div class="createTitle">Create</div>
				<div class="createSub">Add a task, note, or focus window.</div>
			</div>
			<button class="iconBtn" type="button" data-create-close aria-label="Close">&times;</button>
		</div>
		<form class="createForm" data-create-form>
			<label class="label" for="create-kind">Type</label>
			<select class="input compact select" id="create-kind" name="kind" data-create-kind>
				<option value="task">Task</option>
				<option value="note">Note</option>
				<option value="event">Event</option>
				<option value="window">Window</option>
			</select>

			<div class="createRow">
				<div class="createField createTitleField">
					<label class="label" for="create-title">Title</label>
					<input class="input" id="create-title" type="text" name="title" placeholder="What are you doing?">
				</div>
				<div class="createField createColorField" data-kind="window,event">
					<label class="label" for="create-color">Color</label>
					<input class="input color" id="create-color" type="color" name="color" value="#f3c873" data-default="#f3c873">
				</div>
			</div>

			<div class="createField" data-kind="note">
				<label class="label" for="create-note">Note</label>
				<textarea class="input textarea" id="create-note" name="note" rows="3" placeholder="Capture the detail."></textarea>
			</div>

			<div class="createField" data-kind="task">
				<label class="label" for="create-duration">Time required (min)</label>
				<input class="input compact" id="create-duration" type="number" name="duration" min="5" step="5" inputmode="numeric" placeholder="45">
			</div>

			<div class="createField" data-kind="event">
				<label class="label" for="create-all-day">All day</label>
				<label class="toggleLine">
					<input type="checkbox" id="create-all-day" name="all_day">
					<span>All day event</span>
				</label>
			</div>

			<div class="createField" data-kind="window,event" data-event-time>
				<label class="label" for="create-time-hour">Start time</label>
				<div class="timeDial" data-time-dial>
					<input type="hidden" id="create-time" name="time" data-time-output>
					<div class="timeDialUnit">
						<button class="dialBtn" type="button" data-dial-step="hour" data-dial-dir="-1" aria-label="Decrease hour">-</button>
						<input class="dialInput" id="create-time-hour" type="text" inputmode="numeric" maxlength="2" placeholder="--" data-dial-hour>
						<button class="dialBtn" type="button" data-dial-step="hour" data-dial-dir="1" aria-label="Increase hour">+</button>
					</div>
					<span class="dialSep">:</span>
					<div class="timeDialUnit">
						<button class="dialBtn" type="button" data-dial-step="minute" data-dial-dir="-1" aria-label="Decrease minute">-</button>
						<input class="dialInput" id="create-time-minute" type="text" inputmode="numeric" maxlength="2" placeholder="--" data-dial-minute>
						<button class="dialBtn" type="button" data-dial-step="minute" data-dial-dir="1" aria-label="Increase minute">+</button>
					</div>
				</div>
			</div>
			<div class="createField" data-kind="window,event" data-event-time>
				<label class="label" for="create-end-time-hour">End time (optional)</label>
				<div class="timeDial" data-time-dial>
					<input type="hidden" id="create-end-time" name="end_time" data-time-output>
					<div class="timeDialUnit">
						<button class="dialBtn" type="button" data-dial-step="hour" data-dial-dir="-1" aria-label="Decrease hour">-</button>
						<input class="dialInput" id="create-end-time-hour" type="text" inputmode="numeric" maxlength="2" placeholder="--" data-dial-hour>
						<button class="dialBtn" type="button" data-dial-step="hour" data-dial-dir="1" aria-label="Increase hour">+</button>
					</div>
					<span class="dialSep">:</span>
					<div class="timeDialUnit">
						<button class="dialBtn" type="button" data-dial-step="minute" data-dial-dir="-1" aria-label="Decrease minute">-</button>
						<input class="dialInput" id="create-end-time-minute" type="text" inputmode="numeric" maxlength="2" placeholder="--" data-dial-minute>
						<button class="dialBtn" type="button" data-dial-step="minute" data-dial-dir="1" aria-label="Increase minute">+</button>
					</div>
				</div>
			</div>

			<div class="createField" data-create-date-field>
				<label class="label" for="create-date">Date</label>
				<input class="input compact" id="create-date" type="date" data-create-date-picker>
			</div>

			<div class="createMeta">
				<span class="metaLabel">Date</span>
				<span data-create-date>Today</span>
			</div>

			<input type="hidden" name="date" data-create-date-input>

			<button class="btn primary" type="submit">Create</button>
		</form>
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
		<?php endif; ?>

		<form class="onboardForm" method="post" action="https://account.candor.you/profile_update.php" data-unit="<?= htmlspecialchars($unitSystem) ?>">
			<input type="hidden" name="redirect" value="https://do.candor.you/">
			<div class="profileSection">
				<div class="sectionTitle">Essentials</div>
				<div class="bulletGrid">
					<div class="bulletField is-compact">
						<label class="label" for="profile-unit">Units</label>
						<select class="input compact select" id="profile-unit" name="unit_system" data-unit-select>
							<option value="metric" <?= $unitSystem === 'metric' ? 'selected' : '' ?>>Metric (cm / kg)</option>
							<option value="imperial" <?= $unitSystem === 'imperial' ? 'selected' : '' ?>>Imperial (ft / lb)</option>
						</select>
					</div>
					<div class="bulletField is-compact">
						<label class="label" for="profile-birthdate">Birthday</label>
						<input class="input compact" id="profile-birthdate" type="date" name="birthdate" required value="<?= htmlspecialchars((string)$birthdate) ?>">
					</div>
					<div class="bulletField is-compact">
						<label class="label" for="profile-clock">Clock</label>
						<select class="input compact select" id="profile-clock" name="clock_format" data-clock-select>
							<option value="24" <?= $timeFormat === '24' ? 'selected' : '' ?>>24-hour (military)</option>
							<option value="12" <?= $timeFormat === '12' ? 'selected' : '' ?>>12-hour (no AM/PM)</option>
						</select>
					</div>
					<div class="unitFields" data-unit="metric">
						<div class="bulletField is-compact is-height">
							<label class="label" for="profile-height-cm">Height</label>
							<div class="rangeValue">
								<input class="input compact" id="profile-height-cm" type="number" name="height_cm" min="90" max="250" inputmode="numeric" value="<?= htmlspecialchars((string)$heightCm) ?>">
								<span class="unitBadge">cm</span>
							</div>
						</div>
						<div class="bulletField is-compact">
							<label class="label" for="profile-weight-kg">Weight</label>
							<div class="rangeValue">
								<input class="input compact" id="profile-weight-kg" type="number" name="weight_kg" min="30" max="300" step="0.1" inputmode="decimal" value="<?= htmlspecialchars((string)$weightKg) ?>">
								<span class="unitBadge">kg</span>
							</div>
						</div>
					</div>
					<div class="unitFields" data-unit="imperial">
						<div class="bulletField is-compact is-height">
							<label class="label">Height</label>
							<div class="heightSplit">
								<div class="rangeValue">
									<input class="input compact" id="profile-height-ft" type="number" name="height_ft" min="3" max="8" inputmode="numeric" value="<?= htmlspecialchars((string)$heightFt) ?>">
									<span class="unitBadge">ft</span>
								</div>
								<div class="rangeValue">
									<input class="input compact" id="profile-height-in" type="number" name="height_in" min="0" max="11" step="0.1" inputmode="decimal" value="<?= htmlspecialchars((string)$heightIn) ?>">
									<span class="unitBadge">in</span>
								</div>
							</div>
						</div>
						<div class="bulletField is-compact">
							<label class="label" for="profile-weight-lb">Weight</label>
							<div class="rangeValue">
								<input class="input compact" id="profile-weight-lb" type="number" name="weight_lb" min="66" max="660" step="0.1" inputmode="decimal" value="<?= htmlspecialchars((string)$weightLb) ?>">
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
				<span>I understand this data is stored to tailor schedules, sleep targets, and wellness insights.</span>
			</label>

			<div class="onboardNote">
				We only use this for personalization. You can update or remove it anytime from your account.
			</div>

			<div class="saveWrap">
				<button class="btn primary" type="submit">Save</button>
				<?php if ($profileOk !== ''): ?>
					<div class="saveHint ok"><?= htmlspecialchars($profileOk) ?></div>
				<?php endif; ?>
			</div>
		</form>
	</div>
</div>
<?php endif; ?>

</body>
</html>




