<?php
require_once '/var/www/gangdev/shared/php/init_candor.php';

candor_require_verified();

$userId = candor_current_user_id();
$user = $userId ? candor_user_row($userId) : null;
$name = $user['display_name'] ?? ($user['username'] ?? '');
$email = $user['email'] ?? '';
$cookieKey = 'candor_time_format_' . $userId;
?>
<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Candor - Create</title>
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
<body class="is-create" data-user-key="<?= htmlspecialchars((string)$userId) ?>" data-clock-cookie="<?= htmlspecialchars($cookieKey) ?>">

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
			<p>Design the repeating structure behind your perfect days. Map sleep, focus, and life into a weekly template so My OS can adapt the execution.</p>
		</div>
	</section>

	<section class="builder">
		<div class="builderRow is-top">
			<div class="card scheduleCard">
				<div class="cardHead">
					<h2>Sleep schedule</h2>
					<span class="cardHint">Weekdays, weekends, daily, or a specific day.</span>
				</div>
				<form class="formGrid" data-sleep-form>
					<div class="field">
						<label class="label" for="sleep-start">Start</label>
						<input class="input compact" id="sleep-start" type="time" name="start" step="60" required>
					</div>
					<div class="field">
						<label class="label" for="sleep-end">End</label>
						<input class="input compact" id="sleep-end" type="time" name="end" step="60" required>
					</div>
					<div class="field">
						<label class="label" for="sleep-repeat">Repeat</label>
						<select class="input compact select" id="sleep-repeat" name="repeat" data-repeat-select>
							<option value="weekdays">Weekdays</option>
							<option value="weekends">Weekends</option>
							<option value="daily">Daily</option>
							<option value="day">Specific day</option>
						</select>
					</div>
					<div class="field" data-day-field>
						<label class="label" for="sleep-day">Day</label>
						<select class="input compact select" id="sleep-day" name="day">
							<option value="0">Sunday</option>
							<option value="1">Monday</option>
							<option value="2">Tuesday</option>
							<option value="3">Wednesday</option>
							<option value="4">Thursday</option>
							<option value="5">Friday</option>
							<option value="6">Saturday</option>
						</select>
					</div>
					<div class="formActions">
						<button class="btn primary" type="submit">Save</button>
						<button class="btn ghost" type="button" data-sleep-clear>Clear</button>
					</div>
				</form>
				<div class="sleepSummary">
					<div class="listHeader">Active schedules</div>
					<div class="listEmpty" data-sleep-empty>No sleep schedule yet.</div>
					<div class="itemList savedScroll" data-sleep-list></div>
				</div>
			</div>

			<div class="card routineCard">
				<div class="cardHead">
					<h2>Routines</h2>
					<span class="cardHint">Build reusable stacks with child tasks.</span>
				</div>
				<form class="formGrid routineForm" data-routine-form>
					<div class="field">
						<label class="label" for="routine-title">Routine</label>
						<input class="input compact" id="routine-title" type="text" name="title" placeholder="e.g. Morning reset" required>
					</div>
					<div class="field">
						<label class="label" for="routine-time">Time (optional)</label>
						<input class="input compact" id="routine-time" type="time" name="time" step="60">
					</div>
					<div class="field">
						<label class="label" for="routine-repeat">Repeat</label>
						<select class="input compact select" id="routine-repeat" name="repeat" data-routine-repeat>
							<option value="daily">Daily</option>
							<option value="weekdays">Weekdays</option>
							<option value="weekends">Weekends</option>
							<option value="day">Specific day</option>
						</select>
					</div>
					<div class="field" data-routine-day-field>
						<label class="label" for="routine-day">Day</label>
						<select class="input compact select" id="routine-day" name="day">
							<option value="0">Sunday</option>
							<option value="1">Monday</option>
							<option value="2">Tuesday</option>
							<option value="3">Wednesday</option>
							<option value="4">Thursday</option>
							<option value="5">Friday</option>
							<option value="6">Saturday</option>
						</select>
					</div>
					<div class="field fieldWide">
						<label class="label">Routine tasks</label>
						<div class="taskStack" data-routine-tasks></div>
						<button class="btn ghost mini" type="button" data-routine-add-task>+ Task</button>
					</div>
					<div class="formActions">
						<button class="btn primary" type="submit">Add routine</button>
					</div>
				</form>
				<div class="savedSection">
					<div class="listHeader">Saved routines</div>
					<div class="listEmpty" data-routine-empty>No routines yet.</div>
					<div class="itemList savedScroll" data-routine-list></div>
				</div>
			</div>
		</div>

		<div class="builderRow is-full">
			<div class="card weekCard">
				<div class="cardHead">
					<h2>Week template</h2>
					<span class="cardHint">Draft the full week so routines land under each day.</span>
				</div>
				<div class="weekGrid" data-week-grid>
					<div class="weekColumn" data-week-day="0">
						<div class="weekDay">Sun</div>
						<div class="weekStack">
							<div class="weekBlock is-sleep">Sleep</div>
							<div class="weekBlock is-morning">Morning routine</div>
							<div class="weekBlock is-focus">Focus</div>
							<div class="weekBlock is-evening">Evening routine</div>
							<div class="weekBlock is-sleep">Sleep</div>
						</div>
						<div class="weekRoutines" data-week-list></div>
					</div>
					<div class="weekColumn" data-week-day="1">
						<div class="weekDay">Mon</div>
						<div class="weekStack">
							<div class="weekBlock is-sleep">Sleep</div>
							<div class="weekBlock is-morning">Morning routine</div>
							<div class="weekBlock is-focus">Focus</div>
							<div class="weekBlock is-evening">Evening routine</div>
							<div class="weekBlock is-sleep">Sleep</div>
						</div>
						<div class="weekRoutines" data-week-list></div>
					</div>
					<div class="weekColumn" data-week-day="2">
						<div class="weekDay">Tue</div>
						<div class="weekStack">
							<div class="weekBlock is-sleep">Sleep</div>
							<div class="weekBlock is-morning">Morning routine</div>
							<div class="weekBlock is-focus">Focus</div>
							<div class="weekBlock is-evening">Evening routine</div>
							<div class="weekBlock is-sleep">Sleep</div>
						</div>
						<div class="weekRoutines" data-week-list></div>
					</div>
					<div class="weekColumn" data-week-day="3">
						<div class="weekDay">Wed</div>
						<div class="weekStack">
							<div class="weekBlock is-sleep">Sleep</div>
							<div class="weekBlock is-morning">Morning routine</div>
							<div class="weekBlock is-focus">Focus</div>
							<div class="weekBlock is-evening">Evening routine</div>
							<div class="weekBlock is-sleep">Sleep</div>
						</div>
						<div class="weekRoutines" data-week-list></div>
					</div>
					<div class="weekColumn" data-week-day="4">
						<div class="weekDay">Thu</div>
						<div class="weekStack">
							<div class="weekBlock is-sleep">Sleep</div>
							<div class="weekBlock is-morning">Morning routine</div>
							<div class="weekBlock is-focus">Focus</div>
							<div class="weekBlock is-evening">Evening routine</div>
							<div class="weekBlock is-sleep">Sleep</div>
						</div>
						<div class="weekRoutines" data-week-list></div>
					</div>
					<div class="weekColumn" data-week-day="5">
						<div class="weekDay">Fri</div>
						<div class="weekStack">
							<div class="weekBlock is-sleep">Sleep</div>
							<div class="weekBlock is-morning">Morning routine</div>
							<div class="weekBlock is-focus">Focus</div>
							<div class="weekBlock is-evening">Evening routine</div>
							<div class="weekBlock is-sleep">Sleep</div>
						</div>
						<div class="weekRoutines" data-week-list></div>
					</div>
					<div class="weekColumn" data-week-day="6">
						<div class="weekDay">Sat</div>
						<div class="weekStack">
							<div class="weekBlock is-sleep">Sleep</div>
							<div class="weekBlock is-morning">Morning routine</div>
							<div class="weekBlock is-focus">Focus</div>
							<div class="weekBlock is-evening">Evening routine</div>
							<div class="weekBlock is-sleep">Sleep</div>
						</div>
						<div class="weekRoutines" data-week-list></div>
					</div>
				</div>
				<button class="weekAdd" type="button" data-repeat-open aria-label="Add repeat task">+</button>
			</div>
		</div>
	</section>

	<div class="repeatOverlay" data-repeat-overlay>
		<div class="repeatCard">
			<div class="repeatHeader">
				<div class="repeatTitle">Repeat task</div>
				<button class="iconBtn" type="button" data-repeat-close aria-label="Close">&times;</button>
			</div>
			<form class="repeatForm" data-repeat-form>
				<div class="field">
					<label class="label" for="repeat-title">Task</label>
					<input class="input compact" id="repeat-title" type="text" name="title" placeholder="Laundry, dishes, reset" required>
				</div>
				<div class="field">
					<label class="label" for="repeat-day">Day</label>
					<select class="input compact select" id="repeat-day" name="day">
						<option value="0">Sunday</option>
						<option value="1">Monday</option>
						<option value="2">Tuesday</option>
						<option value="3">Wednesday</option>
						<option value="4">Thursday</option>
						<option value="5">Friday</option>
						<option value="6">Saturday</option>
					</select>
				</div>
				<div class="field">
					<label class="label" for="repeat-time">Time (optional)</label>
					<input class="input compact" id="repeat-time" type="time" name="time" step="60">
				</div>
				<div class="formActions">
					<button class="btn primary" type="submit">Add repeat task</button>
					<button class="btn ghost" type="button" data-repeat-close>Cancel</button>
				</div>
			</form>
		</div>
	</div>

	<div class="footer">
		<a class="footLink" href="https://updates.candor.you/"><span class="footStrong">Candor</span> v0.2</a>
		<a class="footLink" href="https://gangdev.co/">Built by <span class="footStrong">GangDev</span></a>
	</div>
</div>

</body>
</html>




