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
	<link rel="stylesheet" href="../style.css">
	<script src="../script.js" defer></script>
</head>
<body class="is-do">

<div class="page">
	<header class="nav reveal" style="--d: 0ms;">
		<div class="brand">
			<div class="logo"><span class="logoGlyph">C</span></div>
			<div class="brandText">
				<div class="brandTitle"><span class="brandLead">your</span><span class="brandName">CANDOR</span></div>
				<div class="meta">execution cockpit</div>
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
			<h1>Plan like a menace. Execute with precision.</h1>
			<p>Candor adapts to your constraints, reshapes the day when things shift, and collapses misses back into the backlog.</p>
		</div>

		<div class="card panel reveal" style="--d: 160ms;">
			<h3>Session status</h3>
			<p class="subtle"><?= $authed ? 'Workspace ready.' : 'Sign in to unlock your workspace.' ?></p>
			<ul class="list">
				<li><span>Tasks</span><span class="subtle">Precision status</span></li>
				<li><span>Notes</span><span class="subtle">Rapid capture</span></li>
				<li><span>Planner</span><span class="subtle">Constraint driven</span></li>
			</ul>
			<?php if ($authed): ?>
				<p class="subtle">Signed in as <?= htmlspecialchars($name !== '' ? $name : $email) ?></p>
			<?php endif; ?>
		</div>
	</section>

	<section class="grid">
		<div class="card reveal" style="--d: 220ms;">
			<div class="chip">Focus</div>
			<h3>Constraint-first blocks</h3>
			<p>Schedule against real constraints and collapse misses back into the backlog.</p>
		</div>
		<div class="card reveal" style="--d: 280ms;">
			<div class="chip">Capture</div>
			<h3>Notes that drive action</h3>
			<p>Keep notes attached to the day so they feed the next plan.</p>
		</div>
		<div class="card reveal" style="--d: 340ms;">
			<div class="chip">Momentum</div>
			<h3>Adaptive scheduler</h3>
			<p>Built to reflow the day without stacking missed blocks.</p>
		</div>
	</section>

	<div class="footer">
		<span>Candor v0</span>
		<span>Built by GangDev</span>
	</div>
</div>

</body>
</html>
