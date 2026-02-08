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
    <title>Candor - Updates</title>
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
</head>
<body class="is-updates">

<div class="page">
    <header class="nav">
        <a class="brand brandLink" href="https://candor.you/">
            <div class="logo"><span class="logoGlyph">C</span></div>
            <div class="brandText">
                <div class="brandTitle"><span class="brandName">Candor</span></div>
                <div class="meta minimal">updates</div>
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
                        <li>Create workspace launched for cadence planning with sleep rules and recurring tasks.</li>
                        <li>Core shortcut + base schedule nudge in My OS link directly into Create.</li>
                        <li>Sleep schedules render in the day header and on the timeline as sleep windows.</li>
                        <li>Floating add/today controls and mobile calendar dots keep schedules readable.</li>
                        <li>Mobile focus tiles and calendar grids compressed to stay fully on-screen.</li>
                        <li>Refreshed logo mark plus light/dark favicon set across all Candor pages.</li>
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
            <p>Tasks, notes, and planner blocks stay close to the day so planning stays honest.</p>
        </div>
        <div class="card">
            <h3>Account + access</h3>
            <p>Unified sign-in and verification keep your personal OS secure.</p>
        </div>
        <div class="card">
            <h3>Release cadence</h3>
            <p>Major updates are posted here with short, clear breakdowns.</p>
        </div>
    </section>

    <footer class="footer">
        <a class="footLink" href="https://candor.you/"><span class="footStrong">Candor</span> v0.2</a>
        <a class="footLink" href="https://gangdev.co/">Built by <span class="footStrong">GangDev</span></a>
    </footer>
</div>

</body>
</html>




