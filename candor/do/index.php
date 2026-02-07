<?php
require_once '/var/www/gangdev/shared/php/init_candor.php';

candor_require_verified();

$userId = candor_current_user_id();
$user = $userId ? candor_user_row($userId) : null;
$name = $user['display_name'] ?? ($user['username'] ?? '');
$email = $user['email'] ?? '';
?>
<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>your Candor</title>
	<link rel="icon" href="/favicon.ico?v=2" type="image/x-icon">
	<link rel="shortcut icon" href="/favicon.ico?v=2" type="image/x-icon">
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png?v=2">
	<link rel="icon" type="image/png" sizes="64x64" href="/favicon-64.png?v=2">
	<link rel="icon" type="image/png" sizes="128x128" href="/favicon-128.png?v=2">
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
					<div class="dayTag">Plan like a menace. Execute with precision.</div>
					<div class="dayTitle" data-day-title>Today</div>
					<div class="dayMeta" data-day-sub></div>
				</div>
				<div class="focusStrip">
					<div class="focusCard">
						<div class="focusLabel">Current run</div>
						<div class="focusValue" data-focus-current>Ready</div>
						<div class="focusSub">No active run yet.</div>
					</div>
					<div class="focusCard">
						<div class="focusLabel">Capacity balance</div>
						<div class="focusValue" data-focus-capacity>0h / 8h</div>
						<div class="focusSub">Open capacity remains.</div>
					</div>
					<div class="focusCard">
						<div class="focusLabel">Momentum</div>
						<div class="focusValue" data-focus-momentum>0%</div>
						<div class="focusSub">Keep the streak alive.</div>
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
				<button class="monthNav" type="button" data-month-nav="prev" aria-label="Previous month">‹</button>
				<div class="monthTitle" data-month-title></div>
				<button class="monthNav" type="button" data-month-nav="next" aria-label="Next month">›</button>
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

</body>
</html>
