<?php require_once '/var/www/gangdev/shared/php/init.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" name="description" content="GangDev updates and change log">
    <title>Updates</title>

    <link rel="stylesheet" href="style.css">
    <script defer src="script.js"></script>

    <?= $head ?>
</head>
<body>
<?= $navbar ?>
<?= $warn ?>

<main class="gdUpdates">
    <header class="gdHero">
        <div class="gdHero__bg"></div>

        <div class="gdHero__inner">
            <div class="gdKicker">
                <span class="gdDot"></span>
                <span>GangDev</span>
                <span class="gdSep">/</span>
                <span>Updates</span>
            </div>

            <h1 class="gdTitle">
                Change Log <span class="trademark">™</span>
            </h1>

            <p class="gdSub">
                Clean, timestamped updates. 24-hour time. No fluff.
            </p>
        </div>
    </header>

    <section class="gdPanel">
        <div class="gdPanel__head">
            <h2>Latest</h2>
            <div class="gdHint">
                <span class="kbd">Scroll</span>
                <span class="muted">inside to move through history</span>
            </div>
        </div>

        <!--
            HOW TO ADD AN UPDATE:
            1) Duplicate one <article class="gdCard">...</article>
            2) Keep the datetime in 24h format (YYYY-MM-DD HH:mm)
            3) Write changes under Added / Changed / Fixed (or remove what you don't need)
        -->

        <div class="gdRailWrap">
            <div class="gdRail" id="gdUpdatesRail" aria-label="Updates timeline" tabindex="0">

                <article class="gdCard isActive">
                    <div class="gdCard__top">
                        <div class="gdStamp">
                            <span class="gdDate">2026-01-22</span>
                            <span class="gdTime">18:34</span>
                            <span class="gdTz">MT</span>
                        </div>
                        <span class="gdTag">v0.9</span>
                    </div>

                    <h3 class="gdCard__title">Updates page redesign (this)</h3>

                    <div class="gdPills">
                        <span class="pill">UI</span>
                        <span class="pill">Quality</span>
                        <span class="pill">Changelog</span>
                    </div>

                    <div class="gdBlocks">
                        <div class="gdBlock">
                            <div class="gdBlock__label">Added</div>
                            <ul>
                                <li>Framed update “window” with horizontal history rail.</li>
                                <li>Wheel/trackpad vertical scroll mapped to horizontal timeline.</li>
                                <li>24-hour timestamps + consistent layout for each entry.</li>
                            </ul>
                        </div>

                        <div class="gdBlock">
                            <div class="gdBlock__label">Notes</div>
                            <p>
                                The page does <b>not</b> side-scroll. Only the rail scrolls.
                                You’ll always see the “next/previous card edge” as a hint.
                            </p>
                        </div>
                    </div>
                </article>

                <article class="gdCard">
                    <div class="gdCard__top">
                        <div class="gdStamp">
                            <span class="gdDate">2026-01-21</span>
                            <span class="gdTime">22:07</span>
                            <span class="gdTz">MT</span>
                        </div>
                        <span class="gdTag">v0.8</span>
                    </div>

                    <h3 class="gdCard__title">Account system polish</h3>

                    <div class="gdPills">
                        <span class="pill">Auth</span>
                        <span class="pill">Email</span>
                    </div>

                    <div class="gdBlocks">
                        <div class="gdBlock">
                            <div class="gdBlock__label">Added</div>
                            <ul>
                                <li>Sign-in code included in email subject line.</li>
                                <li>Home button on account page for quick return.</li>
                            </ul>
                        </div>

                        <div class="gdBlock">
                            <div class="gdBlock__label">Changed</div>
                            <ul>
                                <li>Minor copy + form layout tightening to match site theme.</li>
                            </ul>
                        </div>
                    </div>
                </article>

                <article class="gdCard">
                    <div class="gdCard__top">
                        <div class="gdStamp">
                            <span class="gdDate">2026-01-19</span>
                            <span class="gdTime">21:33</span>
                            <span class="gdTz">MT</span>
                        </div>
                        <span class="gdTag">v0.7</span>
                    </div>

                    <h3 class="gdCard__title">Navbar structure pass</h3>

                    <div class="gdPills">
                        <span class="pill">Navigation</span>
                        <span class="pill">UX</span>
                    </div>

                    <div class="gdBlocks">
                        <div class="gdBlock">
                            <div class="gdBlock__label">Changed</div>
                            <ul>
                                <li>Menu labeling/ordering cleanup across core sections.</li>
                                <li>Reduced “clunky” naming (less “Changelog”, more “Updates”).</li>
                            </ul>
                        </div>

                        <div class="gdBlock">
                            <div class="gdBlock__label">Fixed</div>
                            <ul>
                                <li>Small alignment issues on smaller viewports.</li>
                            </ul>
                        </div>
                    </div>
                </article>

            </div>

            <div class="gdRailFade left" aria-hidden="true"></div>
            <div class="gdRailFade right" aria-hidden="true"></div>
        </div>
    </section>
</main>

<?= $footer ?>
</body>
</html>
