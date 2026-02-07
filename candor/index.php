<?php
require_once '/var/www/gangdev/shared/php/init_candor.php';

$userId = candor_current_user_id();
$user = $userId ? candor_user_row($userId) : null;
$name = $user['username'] ?? '';
$email = $user['email'] ?? '';
$authed = $userId && $user;
?>
<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Candor</title>
	<link rel="stylesheet" href="style.css">
	<script src="script.js" defer></script>
</head>
<body>

<div class="page">
	<header class="nav reveal" style="--d: 0ms;">
		<div class="brand">
			<div class="logo">C</div>
			<div>
				<div class="brandTitle"><span class="brandLead">your</span><span class="brandName">CANDOR</span></div>
				<div class="meta">personal OS</div>
			</div>
		</div>

		<div class="actions">
			<?php if ($authed): ?>
				<a class="btn primary" href="https://do.candor.you/">Open Do</a>
				<a class="btn ghost" href="https://account.candor.you/">Account</a>
				<a class="btn accent" href="https://account.candor.you/login/signout.php">Sign out</a>
			<?php else: ?>
				<a class="btn primary" href="https://account.candor.you/login/signin.php">Sign in</a>
				<a class="btn accent" href="https://account.candor.you/login/signup.php">Create account</a>
			<?php endif; ?>
		</div>
	</header>

	<section class="hero">
		<div class="reveal" style="--d: 80ms;">
			<div class="badge">v0 build</div>
			<h1>Clear today, without losing the long game.</h1>
			<p>Candor is your personal operating system for tasks, notes, and a simple daily planner. Keep the day lightweight, keep the backlog honest, and move forward with intention.</p>
			<div class="cta-row">
				<?php if ($authed): ?>
					<a class="btn primary" href="https://do.candor.you/">Go to Today</a>
					<a class="btn ghost" href="https://account.candor.you/">Account center</a>
				<?php else: ?>
					<a class="btn primary" href="https://account.candor.you/login/signin.php">Sign in</a>
					<a class="btn accent" href="https://account.candor.you/login/signup.php">Create account</a>
				<?php endif; ?>
			</div>
		</div>

		<div class="card panel reveal" style="--d: 160ms;">
			<h3>Quick access</h3>
			<p class="subtle">Everything you need to move between planning and execution.</p>
			<ul class="list">
				<?php if ($authed): ?>
					<li><span>Today workspace</span><a class="btn slim" href="https://do.candor.you/">Open</a></li>
					<li><span>Account details</span><a class="btn slim" href="https://account.candor.you/">View</a></li>
					<li><span>Sign out</span><a class="btn slim" href="https://account.candor.you/login/signout.php">Sign out</a></li>
				<?php else: ?>
					<li><span>Sign in</span><a class="btn slim" href="https://account.candor.you/login/signin.php">Go</a></li>
					<li><span>Create account</span><a class="btn slim" href="https://account.candor.you/login/signup.php">Go</a></li>
					<li><span>Verify email</span><a class="btn slim" href="https://account.candor.you/login/verify.php">Check</a></li>
				<?php endif; ?>
			</ul>
			<?php if ($authed): ?>
				<p class="subtle">Signed in as <?= htmlspecialchars($name !== '' ? $name : $email) ?></p>
			<?php else: ?>
				<p class="subtle">Use your email to activate your account.</p>
			<?php endif; ?>
		</div>
	</section>

	<section class="grid">
		<div class="card reveal" style="--d: 220ms;">
			<div class="chip">Tasks</div>
			<h3>Daily focus, no pileups</h3>
			<p>Track tasks with clear status and gentle rollover rules. Missed blocks collapse back into the backlog.</p>
		</div>
		<div class="card reveal" style="--d: 280ms;">
			<div class="chip">Notes</div>
			<h3>Capture without clutter</h3>
			<p>Notes stay attached to context, ready for the next planning pass.</p>
		</div>
		<div class="card reveal" style="--d: 340ms;">
			<div class="chip">Planner</div>
			<h3>Lightweight daily plans</h3>
			<p>Start with a simple daily planner and grow into smart scheduling later.</p>
		</div>
	</section>

	<div class="footer">
		<span>Candor v0</span>
		<span>Built by GangDev</span>
	</div>
</div>

</body>
</html>
