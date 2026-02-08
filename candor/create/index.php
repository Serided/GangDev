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
	<link rel="icon" href="https://candor.you/files/img/favicon/favicon.ico?v=12" type="image/x-icon">
	<link rel="icon" href="https://candor.you/files/img/favicon/favicon-dark.ico?v=12" type="image/x-icon" media="(prefers-color-scheme: dark)">
	<link rel="shortcut icon" href="https://candor.you/files/img/favicon/favicon.ico?v=12" type="image/x-icon">
	<link rel="shortcut icon" href="https://candor.you/files/img/favicon/favicon-dark.ico?v=12" type="image/x-icon" media="(prefers-color-scheme: dark)">
	<link rel="icon" type="image/png" sizes="32x32" href="https://candor.you/files/img/favicon/favicon-32.png?v=12">
	<link rel="icon" type="image/png" sizes="32x32" href="https://candor.you/files/img/favicon/favicon-dark-32.png?v=12" media="(prefers-color-scheme: dark)">
	<link rel="icon" type="image/png" sizes="64x64" href="https://candor.you/files/img/favicon/favicon-64.png?v=12">
	<link rel="icon" type="image/png" sizes="64x64" href="https://candor.you/files/img/favicon/favicon-dark-64.png?v=12" media="(prefers-color-scheme: dark)">
	<link rel="icon" type="image/png" sizes="128x128" href="https://candor.you/files/img/favicon/favicon-128.png?v=12">
	<link rel="icon" type="image/png" sizes="128x128" href="https://candor.you/files/img/favicon/favicon-dark-128.png?v=12" media="(prefers-color-scheme: dark)">
	<link rel="stylesheet" href="style.css">
	<script src="script.js" defer></script>
</head>
<body class="is-create" data-user-key="<?= htmlspecialchars((string)$userId) ?>">

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
			<a class="btn primary" href="https://do.candor.you/">My OS</a>
			<a class="btn accent" href="https://account.candor.you/login/signout.php">Sign out</a>
		</div>
	</header>

	<section class="hero">
		<div class="heroCopy">
			<h1>Build your cadence.</h1>
			<p>Design the repeating structure behind your perfect days. Drop sleep, essentials, and recurring tasks into a weekly template that powers your OS.</p>
		</div>
		<div class="card heroCard">
			<div class="heroLabel">Starting point</div>
			<h3>Weekly template</h3>
			<p>Set a baseline week, then let Candor adapt the day-to-day execution in My OS.</p>
			<div class="legendList">Sleep - Anchors - Focus</div>
		</div>
	</section>

	<section class="builder">
		<div class="builderColumn">
			<div class="card scheduleCard">
				<div class="cardHead">
					<h2>Sleep schedule</h2>
					<span class="cardHint">Weekdays, weekends, daily, or a specific day.</span>
				</div>
				<form class="formGrid" data-sleep-form>
					<div class="field">
						<label class="label" for="sleep-start">Start</label>
						<input class="input" id="sleep-start" type="time" name="start" required>
					</div>
					<div class="field">
						<label class="label" for="sleep-end">End</label>
						<input class="input" id="sleep-end" type="time" name="end" required>
					</div>
					<div class="field">
						<label class="label" for="sleep-repeat">Repeat</label>
						<select class="input select" id="sleep-repeat" name="repeat" data-repeat-select>
							<option value="weekdays">Weekdays</option>
							<option value="weekends">Weekends</option>
							<option value="daily">Daily</option>
							<option value="day">Specific day</option>
						</select>
					</div>
					<div class="field" data-day-field>
						<label class="label" for="sleep-day">Day</label>
						<select class="input select" id="sleep-day" name="day">
							<option value="1">Monday</option>
							<option value="2">Tuesday</option>
							<option value="3">Wednesday</option>
							<option value="4">Thursday</option>
							<option value="5">Friday</option>
							<option value="6">Saturday</option>
							<option value="0">Sunday</option>
						</select>
					</div>
					<div class="formActions">
						<button class="btn primary" type="submit">Save sleep schedule</button>
						<button class="btn ghost" type="button" data-sleep-clear>Clear</button>
					</div>
				</form>
				<div class="listHeader">Active schedules</div>
				<div class="listEmpty" data-sleep-empty>No sleep schedule yet.</div>
				<div class="itemList" data-sleep-list></div>
				<div class="noteCard">
					<div class="noteTitle">Create vs. My OS</div>
					<p>Create is for the big structure. My OS is for fast adjustments and daily execution.</p>
				</div>
			</div>

			<div class="card tasksCard">
				<div class="cardHead">
					<h2>Daily tasks</h2>
					<span class="cardHint">Recurring tasks that preload in My OS.</span>
				</div>
				<form class="formGrid" data-task-form>
					<div class="field fieldWide">
						<label class="label" for="task-title">Task</label>
						<input class="input" id="task-title" type="text" name="title" placeholder="e.g. Morning review" required>
					</div>
					<div class="field">
						<label class="label" for="task-time">Time (optional)</label>
						<input class="input" id="task-time" type="time" name="time">
					</div>
					<div class="field">
						<label class="label" for="task-repeat">Repeat</label>
						<select class="input select" id="task-repeat" name="repeat" data-task-repeat>
							<option value="daily">Daily</option>
							<option value="weekdays">Weekdays</option>
							<option value="weekends">Weekends</option>
							<option value="day">Specific day</option>
						</select>
					</div>
					<div class="field" data-task-day-field>
						<label class="label" for="task-day">Day</label>
						<select class="input select" id="task-day" name="day">
							<option value="1">Monday</option>
							<option value="2">Tuesday</option>
							<option value="3">Wednesday</option>
							<option value="4">Thursday</option>
							<option value="5">Friday</option>
							<option value="6">Saturday</option>
							<option value="0">Sunday</option>
						</select>
					</div>
					<div class="formActions">
						<button class="btn primary" type="submit">Add task</button>
					</div>
				</form>
				<div class="listHeader">Saved tasks</div>
				<div class="listEmpty" data-task-empty>No recurring tasks yet.</div>
				<div class="itemList" data-task-list></div>
			</div>
		</div>

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
	</section>

	<div class="footer">
		<a class="footLink" href="https://updates.candor.you/"><span class="footStrong">Candor</span> v0.2</a>
		<a class="footLink" href="https://gangdev.co/">Built by <span class="footStrong">GangDev</span></a>
	</div>
</div>

</body>
</html>




