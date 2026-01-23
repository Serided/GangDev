<?php require_once '/var/www/gangdev/shared/php/init.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Updates</title>
    <link rel="stylesheet" href="style.css">
    <script defer src="script.js"></script>
    <?= $head ?>
</head>
<body class="updatesBody">
<?= $navbar ?>
<?= $warn ?>

<div class="updatesShell">

    <section class="sect cont two updatesPage">
        <div class="updatesInner">

            <div class="updatesTop">
                <h1>Updates</h1>
                <div class="updatesHintTop">Scroll to snap. Drag to slide.</div>
            </div>

            <div class="updatesFrame" id="updatesFrame">
                <div class="updatesRail" id="updatesRail" tabindex="0">

                    <article class="uCard active">
                        <div class="uHead">
                            <span class="uStamp">2025-04-18 14:10 MT</span>
                            <span class="uVer">v1.0.0</span>
                        </div>
                        <h2 class="uTitle">Website revamp + rebrand baseline</h2>

                        <div class="uBlock">
                            <div class="uLabel">Added</div>
                            <ul class="uList">
                                <li>Full site layout rebuild with uniform sections</li>
                                <li>New logo + refreshed brand identity</li>
                                <li>New theme system + consistent styling across pages</li>
                            </ul>
                        </div>

                        <div class="uBlock">
                            <div class="uLabel">Changed</div>
                            <ul class="uList">
                                <li>Navigation + page structure cleaned up across the site</li>
                            </ul>
                        </div>
                    </article>

                    <article class="uCard">
                        <div class="uHead">
                            <span class="uStamp">2025-06-27 19:45 MT</span>
                            <span class="uVer">v1.1.0</span>
                        </div>
                        <h2 class="uTitle">Crust project kicked off</h2>

                        <div class="uBlock">
                            <div class="uLabel">Added</div>
                            <ul class="uList">
                                <li>Crust project foundation (new game track)</li>
                                <li>Early core structure for world/game loop iteration</li>
                                <li>Prep for future multiplayer + procedural systems</li>
                            </ul>
                        </div>

                        <div class="uBlock">
                            <div class="uLabel">Notes</div>
                            <p class="uText">Start building the game stack without bloating the site.</p>
                        </div>
                    </article>

                    <article class="uCard">
                        <div class="uHead">
                            <span class="uStamp">2025-08-15 21:05 MT</span>
                            <span class="uVer">v1.2.0</span>
                        </div>
                        <h2 class="uTitle">Accounts system shipped</h2>

                        <div class="uBlock">
                            <div class="uLabel">Added</div>
                            <ul class="uList">
                                <li>Account creation + login flow</li>
                                <li>Account recovery flow (password reset / regain access)</li>
                                <li>Partial account management foundation (account area + structure)</li>
                            </ul>
                        </div>

                        <div class="uBlock">
                            <div class="uLabel">Changed</div>
                            <ul class="uList">
                                <li>Auth-related UI tightened to match site theme</li>
                            </ul>
                        </div>
                    </article>

                    <article class="uCard">
                        <div class="uHead">
                            <span class="uStamp">2025-11-22 13:20 MT</span>
                            <span class="uVer">v1.3.0</span>
                        </div>
                        <h2 class="uTitle">GangDev became “real on paper”</h2>

                        <div class="uBlock">
                            <div class="uLabel">Added</div>
                            <ul class="uList">
                                <li>Registered as a Utah business with proper identifiers</li>
                                <li>Business financial setup + separation from personal ops</li>
                                <li>Inspectre project started (new tooling track)</li>
                            </ul>
                        </div>

                        <div class="uBlock">
                            <div class="uLabel">Notes</div>
                            <p class="uText">Less “idea”, more “company”.</p>
                        </div>
                    </article>

                    <article class="uCard">
                        <div class="uHead">
                            <span class="uStamp">2026-01-22 18:34 MT</span>
                            <span class="uVer">v1.4.0</span>
                        </div>
                        <h2 class="uTitle">Tabs + DCOPS + updates revamp</h2>

                        <div class="uBlock">
                            <div class="uLabel">Added</div>
                            <ul class="uList">
                                <li>New tab structure for cleaner navigation across the site</li>
                                <li>DCOPS foundation work (dcops.co) for ops tooling</li>
                                <li>Updates page rebuilt into a snap + drag timeline window</li>
                            </ul>
                        </div>

                        <div class="uBlock">
                            <div class="uLabel">Changed</div>
                            <ul class="uList">
                                <li>Formatting pass to keep pages consistent with the core theme</li>
                            </ul>
                        </div>
                    </article>

                </div>
            </div>

        </div>
    </section>

    <div id="updatesFooterWrap">
        <?= $footer ?>
    </div>

</div>

</body>
</html>
