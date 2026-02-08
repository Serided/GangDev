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
							<li>Create now centers on routines with child tasks and inline schedule lines.</li>
							<li>Routine tasks track estimated minutes for total duration.</li>
							<li>Week template fills with routines and repeat tasks by day.</li>
							<li>Pop-open time picker (scroll wheels) follows your clock preference across My OS + Create.</li>
							<li>Sleep schedules auto-calc end time from age with a weekend boost.</li>
							<li>Specific-day routines now support multi-day selection.</li>
							<li>Repeat-task plus keeps weekly chores in the cadence builder.</li>
							<li>Month header adds plan-ahead date picking and day popovers for extras.</li>
							<li>Birthday events auto-populate yearly.</li>
							<li>Timeline windows align to the slot line and stack flush when overlapping.</li>
							<li>Refreshed logo mark plus transparent favicons across all Candor pages.</li>
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
            <p>Daily timeline for windows/events, a monthly grid for planning ahead, and cadence building for sleep + routines.</p>
        </div>
        <div class="card">
            <h3>Account + access</h3>
            <p>Verified sign-in with baseline profile data (units, birthday, clock) to personalize sleep and scheduling.</p>
        </div>
        <div class="card">
            <h3>Release cadence</h3>
            <p>Public changelog tracks every version so new capabilities stay clear and traceable.</p>
        </div>
    </section>

    <?php require '/var/www/gangdev/candor/files/php/footer.php'; ?>
</div>

</body>
</html>




