<?php
require_once '/var/www/gangdev/shared/php/init_candor.php';

$userId = candor_current_user_id();
$user = $userId ? candor_user_row($userId) : null;
$name = $user['display_name'] ?? ($user['username'] ?? '');
$email = $user['email'] ?? '';
$authed = $userId && $user;
$candorMeta = 'personal OS';
$candorLead = '';
$candorAuthed = $authed;
$candorName = $name !== '' ? $name : $email;
$candorShowMyOs = $authed;
$candorVersion = 'v0.2';
$candorNavClass = 'reveal';
?>
<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Candor</title>
	<?php require '/var/www/gangdev/candor/files/php/repetitive.php'; ?>
	<link rel="stylesheet" href="style.css">
	<script src="script.js" defer></script>
</head>
<body class="is-landing">

<div class="page">
	<?php require '/var/www/gangdev/candor/files/php/nav.php'; ?>

	<section class="hero">
		<div class="reveal" style="--d: 80ms;">
			<h1>Own today. Keep the backlog honest.</h1>
			<p>Candor is your personal operating system for tasks, routines, notes, and a daily timeline. Plan on the month, execute by the hour, and keep the backlog honest.</p>
		</div>

		<div class="card panel reveal" style="--d: 160ms;">
			<h3>Quick access</h3>
			<p class="subtle">Everything you need to move between planning and execution.</p>
			<ul class="list">
				<?php if ($authed): ?>
					<li><span>Daily timeline</span><span class="subtle">Windows, events, now marker</span></li>
					<li><span>Monthly view</span><span class="subtle">Plan ahead + task dots</span></li>
					<li><span>Create cadence</span><span class="subtle">Sleep + routines + week template</span></li>
				<?php else: ?>
					<li><span>Daily timeline</span><span class="subtle">Windows, events, now marker</span></li>
					<li><span>Monthly view</span><span class="subtle">Plan ahead + task dots</span></li>
					<li><span>Create cadence</span><span class="subtle">Sleep + routines + week template</span></li>
				<?php endif; ?>
			</ul>
		</div>
	</section>

	<section class="grid">
		<div class="card reveal" style="--d: 220ms;">
			<div class="chip chipTasks">Tasks</div>
			<h3>Daily execution, fully scoped</h3>
			<p>Schedule windows, set durations, and keep the day honest with a real timeline.</p>
		</div>
		<div class="card reveal" style="--d: 280ms;">
			<div class="chip chipPlanner">Routines</div>
			<h3>Cadence that repeats cleanly</h3>
			<p>Build routines with task stacks, map sleep patterns, and drop them into a week template.</p>
		</div>
		<div class="card reveal" style="--d: 340ms;">
			<div class="chip chipNotes">Notes</div>
			<h3>Notes that stay in play</h3>
			<p>Capture fast and keep context attached to the day, ready for the next planning pass.</p>
		</div>
	</section>

	<?php require '/var/www/gangdev/candor/files/php/footer.php'; ?>
</div>

</body>
</html>





