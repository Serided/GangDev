<?php
require_once '/var/www/gangdev/shared/php/init_candor.php';

$userId = candor_current_user_id();
$user = $userId ? candor_user_row($userId) : null;
$name = $user['display_name'] ?? ($user['username'] ?? '');
$email = $user['email'] ?? '';
$authed = $userId && $user;
$candorMeta = 'updates';
$candorLead = '';
$candorAuthed = $authed;
$candorName = $name !== '' ? $name : $email;
$candorShowMyOs = $authed;
$candorVersion = 'v0.2';
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Candor - Updates</title>
	<?php require '/var/www/gangdev/candor/files/php/repetitive.php'; ?>
    <link rel="stylesheet" href="style.css">
</head>
<body class="is-updates">

<div class="page">
    <?php require '/var/www/gangdev/candor/files/php/nav.php'; ?>

    <section class="hero">
        <div class="heroText">
            <h1>Product updates, delivered.</h1>
            <p>Short, clear updates on what shipped, what improved, and how Candor keeps evolving.</p>
            <div class="cta">
                <a class="btn accent" href="https://candor.you/">Home</a>
            </div>
        </div>

        <div class="card updatesCard">
            <div class="miniCaption">public updates</div>
            <div class="updatesFeed">
                <article class="updateCard">
                    <div class="updateHeader">
                        <span class="updateVersion">v0.2</span>
                        <span class="updateMeta">Current</span>
                    </div>
					<h3>Create cadence + sleep structure</h3>
					<ul class="updateList">
						<li>Create now centers on cadence windows (routine, work, focus) with child tasks.</li>
						<li>Sleep schedules auto-calc end time from age with a weekend boost.</li>
						<li>Scroll-wheel time picker supports drag, manual entry, and 12/24-hour display.</li>
						<li>Daily timeline items open an edit panel with start/finish now + time delta.</li>
						<li>All-day events sit in a pinned strip (including auto birthday entries).</li>
						<li>24h balance now reflects your sleep hours (9h weekdays, 11h weekends by default).</li>
						<li>Month header keeps fixed nav positions plus plan-ahead date picking.</li>
						<li>Account now includes a time zone selector for precise scheduling.</li>
						<li>Shared head includes keep favicon links centralized.</li>
					</ul>
                </article>

                <article class="updateCard">
                    <div class="updateHeader">
                        <span class="updateVersion">v0.1</span>
                        <span class="updateMeta">Shipped</span>
                    </div>
                    <h3>Account + My OS foundation</h3>
                    <ul class="updateList">
                        <li>My OS calendar view with a daily timeline, monthly grid, and priority rails.</li>
                        <li>Create tasks, notes, and focus windows in one overlay with remove controls.</li>
                        <li>Tasks, notes, and windows persist across reloads via the Candor DB.</li>
                        <li>Account onboarding captures baseline profile data with consent, units, and clock choice.</li>
                        <li>Mobile layout tightened with stacked panels and task dots.</li>
                    </ul>
                </article>

                <article class="updateCard">
                    <div class="updateHeader">
                        <span class="updateVersion">v0.0</span>
                        <span class="updateMeta">Base build</span>
                    </div>
                    <h3>Design system + layout foundations</h3>
                    <ul class="updateList">
                        <li>Initial home, account, and My OS layouts.</li>
                        <li>Core visual language, typography, and gradients.</li>
                        <li>Quick access structure and feature framing.</li>
                    </ul>
                </article>
            </div>
        </div>
    </section>

    <section class="grid">
		<div class="card">
			<h3>Core tools</h3>
			<p>Daily timeline with edit + start/finish controls, monthly planning for future adds, and cadence building for sleep + windows.</p>
		</div>
		<div class="card">
			<h3>Account + access</h3>
			<p>Verified sign-in with baseline profile data (units, birthday, time zone, clock) to personalize sleep and schedules.</p>
		</div>
		<div class="card">
			<h3>Release cadence</h3>
			<p>Public changelog tracks each version so new capabilities stay clear and traceable.</p>
		</div>
    </section>

    <?php require '/var/www/gangdev/candor/files/php/footer.php'; ?>
</div>

</body>
</html>






