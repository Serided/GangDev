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
	<title>Candor - Create</title>
	<link rel="icon" href="https://candor.you/files/img/favicon/favicon.ico?v=6" type="image/x-icon">
	<link rel="shortcut icon" href="https://candor.you/files/img/favicon/favicon.ico?v=6" type="image/x-icon">
	<link rel="icon" type="image/png" sizes="32x32" href="https://candor.you/files/img/favicon/favicon-32.png?v=6">
	<link rel="icon" type="image/png" sizes="64x64" href="https://candor.you/files/img/favicon/favicon-64.png?v=6">
	<link rel="icon" type="image/png" sizes="128x128" href="https://candor.you/files/img/favicon/favicon-128.png?v=6">
	<link rel="stylesheet" href="style.css">
	<script src="script.js" defer></script>
</head>
<body class="is-create">

<div class="page">
	<header class="nav">
		<a class="brand brandLink" href="https://candor.you/">
			<div class="logo"><span class="logoGlyph">C</span></div>
			<div class="brandText">
				<div class="brandTitle"><span class="brandName">Candor</span></div>
				<div class="meta minimal">create</div>
			</div>
		</a>

		<div class="actions">
			<span class="welcome">Welcome, <a class="accountLink" href="https://account.candor.you/"><?= htmlspecialchars($name !== '' ? $name : $email) ?></a></span>
			<a class="btn accent" href="https://account.candor.you/login/signout.php">Sign out</a>
		</div>
	</header>

	<section class="hero">
		<div class="heroCopy">
			<div class="tag">Create</div>
			<h1>Build your cadence.</h1>
			<p>Design the repeating structure behind your perfect days. Drop sleep, essentials, and recurring tasks into a weekly template that powers your OS.</p>
		</div>
		<div class="card heroCard">
			<div class="heroLabel">Starting point</div>
			<h3>Weekly template</h3>
			<p>Set a baseline week, then let Candor adapt the day-to-day execution in My OS.</p>
			<div class="legend">
				<span class="legendItem is-sleep">Sleep</span>
				<span class="legendItem is-anchor">Anchors</span>
				<span class="legendItem is-focus">Focus</span>
			</div>
		</div>
	</section>

	<section class="builder">
		<div class="card weekCard">
			<div class="cardHead">
				<h2>Week template</h2>
				<span class="cardHint">Draft your cadence across the week.</span>
			</div>
			<div class="weekGrid">
				<div class="weekColumn">
					<div class="weekDay">Mon</div>
					<div class="weekStack">
						<div class="weekBlock is-sleep">Sleep</div>
						<div class="weekBlock is-anchor">Morning anchor</div>
						<div class="weekBlock is-focus">Focus block</div>
					</div>
				</div>
				<div class="weekColumn">
					<div class="weekDay">Tue</div>
					<div class="weekStack">
						<div class="weekBlock is-sleep">Sleep</div>
						<div class="weekBlock is-anchor">Daily anchor</div>
						<div class="weekBlock is-focus">Deep work</div>
					</div>
				</div>
				<div class="weekColumn">
					<div class="weekDay">Wed</div>
					<div class="weekStack">
						<div class="weekBlock is-sleep">Sleep</div>
						<div class="weekBlock is-anchor">Midweek reset</div>
						<div class="weekBlock is-focus">Creative work</div>
					</div>
				</div>
				<div class="weekColumn">
					<div class="weekDay">Thu</div>
					<div class="weekStack">
						<div class="weekBlock is-sleep">Sleep</div>
						<div class="weekBlock is-anchor">Daily anchor</div>
						<div class="weekBlock is-focus">Execution</div>
					</div>
				</div>
				<div class="weekColumn">
					<div class="weekDay">Fri</div>
					<div class="weekStack">
						<div class="weekBlock is-sleep">Sleep</div>
						<div class="weekBlock is-anchor">Wrap up</div>
						<div class="weekBlock is-focus">Finish line</div>
					</div>
				</div>
				<div class="weekColumn">
					<div class="weekDay">Sat</div>
					<div class="weekStack">
						<div class="weekBlock is-sleep">Sleep</div>
						<div class="weekBlock is-anchor">Recovery</div>
						<div class="weekBlock is-focus">Personal time</div>
					</div>
				</div>
				<div class="weekColumn">
					<div class="weekDay">Sun</div>
					<div class="weekStack">
						<div class="weekBlock is-sleep">Sleep</div>
						<div class="weekBlock is-anchor">Weekly reset</div>
						<div class="weekBlock is-focus">Plan</div>
					</div>
				</div>
			</div>
		</div>

		<div class="card rulesCard">
			<div class="cardHead">
				<h2>Essentials</h2>
				<span class="cardHint">Define the rules Candor should enforce.</span>
			</div>
			<div class="ruleList">
				<div class="rule">
					<div class="ruleTitle">Sleep schedule</div>
					<div class="ruleSub">Weekday + weekend targets, with buffer windows.</div>
				</div>
				<div class="rule">
					<div class="ruleTitle">Daily anchors</div>
					<div class="ruleSub">Essentials like workout, meals, and recovery blocks.</div>
				</div>
				<div class="rule">
					<div class="ruleTitle">Repeat rules</div>
					<div class="ruleSub">Daily, weekly, or every N days for rolling habits.</div>
				</div>
			</div>
			<div class="noteCard">
				<div class="noteTitle">Create vs. My OS</div>
				<p>Create is for the big structure. My OS is for fast adjustments and daily execution.</p>
			</div>
		</div>
	</section>

	<div class="footer">
		<a class="footLink" href="https://updates.candor.you/"><span class="footStrong">Candor</span> v0.1</a>
		<a class="footLink" href="https://gangdev.co/">Built by <span class="footStrong">GangDev</span></a>
	</div>
</div>

</body>
</html>
