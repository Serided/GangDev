<?php require_once '/var/www/gangdev/shared/php/init.php'; ?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Candor Updates</title>
    <link rel="stylesheet" href="style.css">
    <script defer src="script.js"></script>
    <?= $head ?>
</head>
<body class="updatesBody">
<?= $navbar ?>
<?= $warn ?>

<div class="updatesShell">
    <header class="updatesHeader">
        <div class="brand">
            <div class="logo"><span class="logoGlyph">C</span></div>
            <div class="brandText">
                <div class="brandTitle"><span class="brandLead">your</span><span class="brandName">CANDOR</span></div>
                <div class="meta">updates</div>
            </div>
        </div>
        <div class="updatesMeta">
            <span class="metaBadge">v0.0</span>
            <span class="metaText">Personal OS build log</span>
        </div>
    </header>

    <main class="updatesMain">
        <section class="currentRelease card" id="v0-0">
            <div class="releaseHead">
                <span class="releaseVer">v0.0</span>
                <span class="releaseState">Current</span>
            </div>
            <h1>Foundation release</h1>
            <p class="releaseLead">Identity, access gates, and the base layout for the personal OS.</p>

            <div class="filterRow">
                <button class="filterBtn isActive" data-filter="all" type="button">All</button>
                <button class="filterBtn" data-filter="high" type="button">High</button>
                <button class="filterBtn" data-filter="medium" type="button">Medium</button>
                <button class="filterBtn" data-filter="low" type="button">Low</button>
            </div>

            <div class="feedList">
                <div class="feedItem" data-impact="high">
                    <span class="impact high">High</span>
                    <span class="feedText">Username sign-in plus display name identity split.</span>
                </div>
                <div class="feedItem" data-impact="high">
                    <span class="impact high">High</span>
                    <span class="feedText">Email verification gate before access to do.candor.you.</span>
                </div>
                <div class="feedItem" data-impact="high">
                    <span class="impact high">High</span>
                    <span class="feedText">Do dashboard scaffold for tasks, notes, and planner blocks.</span>
                </div>
                <div class="feedItem" data-impact="medium">
                    <span class="impact medium">Medium</span>
                    <span class="feedText">Landing and account layouts tuned for the Candor palette and hover polish.</span>
                </div>
                <div class="feedItem" data-impact="medium">
                    <span class="impact medium">Medium</span>
                    <span class="feedText">Live display name availability check on signup.</span>
                </div>
                <div class="feedItem" data-impact="medium">
                    <span class="impact medium">Medium</span>
                    <span class="feedText">Account forms refit for username login and verification steps.</span>
                </div>
                <div class="feedItem" data-impact="low">
                    <span class="impact low">Low</span>
                    <span class="feedText">Footer links wired to updates and GangDev.</span>
                </div>
                <div class="feedItem" data-impact="low">
                    <span class="impact low">Low</span>
                    <span class="feedText">Personal OS tagline treatment and spacing passes.</span>
                </div>
            </div>
        </section>

        <section class="futureReleases">
            <div class="futureHead">
                <h2>Future versions</h2>
                <span class="futureHint">Latest at the front</span>
            </div>
            <div class="futureGrid">
                <article class="card futureCard" id="v1-0">
                    <div class="releaseHead">
                        <span class="releaseVer">v1.0</span>
                        <span class="releaseState">Planned</span>
                    </div>
                    <h3>Smart scheduler</h3>
                    <ul class="miniList">
                        <li>Constraint based scheduling and reflow</li>
                        <li>Personal time logging and analytics</li>
                        <li>Adaptive planning across the day</li>
                    </ul>
                </article>

                <article class="card futureCard" id="v0-5">
                    <div class="releaseHead">
                        <span class="releaseVer">v0.5</span>
                        <span class="releaseState">Planned</span>
                    </div>
                    <h3>Calendar events</h3>
                    <ul class="miniList">
                        <li>Calendar event capture</li>
                        <li>Event linking with tasks and notes</li>
                    </ul>
                </article>

                <article class="card futureCard" id="v0-1">
                    <div class="releaseHead">
                        <span class="releaseVer">v0.1</span>
                        <span class="releaseState">Planned</span>
                    </div>
                    <h3>Functional today view</h3>
                    <ul class="miniList">
                        <li>Basic task, note, and planner workflows</li>
                        <li>Rule based daily planning flow</li>
                    </ul>
                </article>
            </div>
        </section>
    </main>

    <div class="updatesFooter">
        <?= $footer ?>
    </div>
</div>

</body>
</html>
