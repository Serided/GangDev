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
	<link rel="stylesheet" href="https://candor.you/style.css">
	<script src="https://candor.you/script.js" defer></script>
</head>
<body class="is-do">

<div class="page">
	<header class="nav reveal" style="--d: 0ms;">
		<div class="brand">
			<div class="logo">C</div>
			<div>
				<div class="brandTitle"><span class="brandLead">your</span><span class="brandName">CANDOR</span></div>
				<div class="meta">today workspace</div>
			</div>
		</div>

		<div class="actions">
			<a class="btn ghost" href="https://candor.you/">Home</a>
			<?php if ($authed): ?>
				<a class="btn primary" href="https://account.candor.you/">Account</a>
				<a class="btn accent" href="https://account.candor.you/login/signout.php">Sign out</a>
			<?php else: ?>
				<a class="btn primary" href="https://account.candor.you/login/signin.php">Sign in</a>
				<a class="btn accent" href="https://account.candor.you/login/signup.php">Create account</a>
			<?php endif; ?>
		</div>
	</header>

	<section class="hero">
		<div class="reveal" style="--d: 80ms;">
			<div class="badge">Today</div>
			<h1>Start with the next honest block.</h1>
			<p>Keep the day lightweight and real. Capture what matters, schedule what fits, and move the rest to the backlog without guilt.</p>
			<div class="cta-row">
				<?php if ($authed): ?>
					<a class="btn primary" href="https://account.candor.you/">Account center</a>
					<a class="btn ghost" href="https://candor.you/">Back to Candor</a>
				<?php else: ?>
					<a class="btn primary" href="https://account.candor.you/login/signin.php">Sign in to start</a>
					<a class="btn ghost" href="https://account.candor.you/login/verify.php">Verify email</a>
				<?php endif; ?>
			</div>
		</div>

		<div class="card panel reveal" style="--d: 160ms;">
			<h3>Session status</h3>
			<p class="subtle"><?= $authed ? 'Workspace ready.' : 'Sign in to unlock your workspace.' ?></p>
			<ul class="list">
				<li><span>Tasks</span><span class="subtle">Simple status</span></li>
				<li><span>Notes</span><span class="subtle">Fast capture</span></li>
				<li><span>Planner</span><span class="subtle">Rule based</span></li>
			</ul>
			<?php if ($authed): ?>
				<p class="subtle">Signed in as <?= htmlspecialchars($name !== '' ? $name : $email) ?></p>
			<?php endif; ?>
		</div>
	</section>

	<section class="grid">
		<div class="card reveal" style="--d: 220ms;">
			<div class="chip">Focus</div>
			<h3>Lightweight blocks</h3>
			<p>Plan only what you can finish. Everything else stays safely in the backlog.</p>
		</div>
		<div class="card reveal" style="--d: 280ms;">
			<div class="chip">Capture</div>
			<h3>Notes that stay close</h3>
			<p>Keep notes attached to the day so nothing drifts away from context.</p>
		</div>
		<div class="card reveal" style="--d: 340ms;">
			<div class="chip">Account</div>
			<h3>Verification once</h3>
			<p>Verify your email a single time, then focus on execution.</p>
		</div>
	</section>

	<div class="footer">
		<span>Candor</span>
		<span>v0 test build</span>
	</div>
</div>

</body>
</html>
