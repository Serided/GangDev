<?php
require_once '/var/www/gangdev/shared/php/init_candor.php';

$userId = candor_current_user_id();
$user = $userId ? candor_user_row($userId) : null;
$name = $user['display_name'] ?? ($user['username'] ?? '');
$email = $user['email'] ?? '';
$authed = $userId && $user;
?>
<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Candor</title>
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
<body class="is-landing">

<div class="page">
	<header class="nav reveal" style="--d: 0ms;">
		<a class="brand brandLink" href="https://candor.you/">
			<div class="logo"><span class="logoGlyph">C</span></div>
			<div class="brandText">
				<div class="brandTitle"><span class="brandName">Candor</span></div>
				<div class="meta minimal">personal OS</div>
			</div>
		</a>

		<div class="actions">
			<?php if ($authed): ?>
				<span class="welcome">Welcome, <a class="accountLink" href="https://account.candor.you/"><?= htmlspecialchars($name !== '' ? $name : $email) ?></a></span>
				<a class="btn primary" href="https://do.candor.you/">My OS</a>
				<a class="btn accent" href="https://account.candor.you/login/signout.php">Sign out</a>
			<?php else: ?>
				<a class="btn primary" href="https://account.candor.you/login/signin.php">Sign in</a>
				<a class="btn accent" href="https://account.candor.you/login/signup.php">Create account</a>
			<?php endif; ?>
		</div>
	</header>

	<section class="hero">
		<div class="reveal" style="--d: 80ms;">
			<h1>Own today. Keep the backlog honest.</h1>
			<p>Candor is your personal operating system for tasks, notes, and a simple daily planner. It respects constraints, collapses misses back into the backlog, and keeps execution clean.</p>
		</div>

		<div class="card panel reveal" style="--d: 160ms;">
			<h3>Quick access</h3>
			<p class="subtle">Everything you need to move between planning and execution.</p>
			<ul class="list">
				<?php if ($authed): ?>
					<li><span>Tasks</span><span class="subtle">Status + rollover</span></li>
					<li><span>Notes</span><span class="subtle">Fast capture</span></li>
					<li><span>Planner</span><span class="subtle">Rule based</span></li>
				<?php else: ?>
					<li><span>Tasks</span><span class="subtle">Status + rollover</span></li>
					<li><span>Notes</span><span class="subtle">Fast capture</span></li>
					<li><span>Planner</span><span class="subtle">Rule based</span></li>
				<?php endif; ?>
			</ul>
		</div>
	</section>

	<section class="grid">
		<div class="card reveal" style="--d: 220ms;">
			<div class="chip chipTasks">Tasks</div>
			<h3>Precision tasks, no pileups</h3>
			<p>Track tasks with clear status and firm rollover rules. Missed blocks collapse back into the backlog.</p>
		</div>
		<div class="card reveal" style="--d: 280ms;">
			<div class="chip chipNotes">Notes</div>
			<h3>Notes that stay in play</h3>
			<p>Capture fast and keep context attached to the day, ready for the next planning pass.</p>
		</div>
		<div class="card reveal" style="--d: 340ms;">
			<div class="chip chipPlanner">Planner</div>
			<h3>Constraint-first planning</h3>
			<p>Rule-based daily plans now, adaptive reflow and smart scheduling later.</p>
		</div>
	</section>

	<div class="footer">
		<a class="footLink" href="https://updates.candor.you/"><span class="footStrong">Candor</span> v0.2</a>
		<a class="footLink" href="https://gangdev.co/">Built by <span class="footStrong">GangDev</span></a>
	</div>
</div>

</body>
</html>




