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
	<title>yourCANDOR</title>
	<link rel="stylesheet" href="style.css">
	<script src="script.js" defer></script>
</head>
<body class="is-do">

<div class="page">
	<header class="nav">
		<div class="brand">
			<div class="logo"><span class="logoGlyph">C</span></div>
			<div class="brandText">
				<div class="brandTitle"><span class="brandLead">your</span><span class="brandName">CANDOR</span></div>
				<div class="meta">personal OS</div>
			</div>
		</div>

		<div class="actions">
			<span class="welcome">Welcome, <?= htmlspecialchars($name !== '' ? $name : $email) ?></span>
			<a class="btn ghost" href="https://candor.you/">Home</a>
			<a class="btn ghost" href="https://account.candor.you/">Account</a>
			<a class="btn accent" href="https://account.candor.you/login/signout.php">Sign out</a>
		</div>
	</header>

	<section class="overview">
		<div class="card heroCard">
			<div class="tag">Today</div>
			<h1>Plan like a menace. Execute with precision.</h1>
			<p>Your OS for decisive planning: constraints first, missed blocks collapse back into the backlog, and the day stays honest.</p>
		</div>
		<div class="card focusCard">
			<h2>Daily focus</h2>
			<div class="focusRow">
				<div>
					<div class="focusLabel">Priorities</div>
					<div class="focusValue">3 targets</div>
				</div>
				<div>
					<div class="focusLabel">Blocks</div>
					<div class="focusValue">2 windows</div>
				</div>
				<div>
					<div class="focusLabel">Backlog</div>
					<div class="focusValue">Ready</div>
				</div>
			</div>
			<p class="subtle">Set the next block, then move.</p>
		</div>
	</section>

	<section class="workspace">
		<div class="panel">
			<div class="panelHeader">
				<h2>Tasks</h2>
				<span class="panelHint">status + rollover</span>
			</div>
			<form class="quickForm" data-add-target="tasks" autocomplete="off">
				<input class="input" data-input placeholder="Add a task">
				<button class="btn primary" type="submit">Add</button>
			</form>
			<ul class="list" data-list="tasks"></ul>
		</div>

		<div class="panel">
			<div class="panelHeader">
				<h2>Notes</h2>
				<span class="panelHint">fast capture</span>
			</div>
			<form class="quickForm" data-add-target="notes" autocomplete="off">
				<input class="input" data-input placeholder="Capture a note">
				<button class="btn primary" type="submit">Save</button>
			</form>
			<ul class="list" data-list="notes"></ul>
		</div>

		<div class="panel">
			<div class="panelHeader">
				<h2>Planner</h2>
				<span class="panelHint">rule based</span>
			</div>
			<form class="quickForm is-planner" data-add-target="blocks" autocomplete="off">
				<input class="input time" type="time" data-time>
				<input class="input" data-input placeholder="Block title">
				<button class="btn primary" type="submit">Add</button>
			</form>
			<ul class="list" data-list="blocks"></ul>
		</div>
	</section>

	<div class="footer">
		<a href="https://candor.you/updates/#v0-0">Candor v0.0</a>
		<a href="https://gangdev.co/">Built by GangDev</a>
	</div>
</div>

</body>
</html>
