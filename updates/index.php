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
                    <div class="uSpacer"></div>

                    <article class="uCard active">
                        <div class="uHead">
                            <span class="uStamp">2026-01-22 18:34 MT</span>
                            <span class="uVer">v0.9</span>
                        </div>
                        <h2 class="uTitle">Updates page rework</h2>

                        <div class="uBlock">
                            <div class="uLabel">Added</div>
                            <ul class="uList">
                                <li>Horizontal changelog window</li>
                                <li>Vertical scroll → horizontal rail</li>
                                <li>24-hour timestamps</li>
                            </ul>
                        </div>

                        <div class="uBlock">
                            <div class="uLabel">Notes</div>
                            <p class="uText">Only this panel scrolls. Page stays normal.</p>
                        </div>
                    </article>

                    <article class="uCard">
                        <div class="uHead">
                            <span class="uStamp">2026-01-21 22:07 MT</span>
                            <span class="uVer">v0.8</span>
                        </div>
                        <h2 class="uTitle">Account system polish</h2>

                        <div class="uBlock">
                            <div class="uLabel">Added</div>
                            <ul class="uList">
                                <li>Sign-in code added to email subject</li>
                                <li>Home button on account page</li>
                            </ul>
                        </div>

                        <div class="uBlock">
                            <div class="uLabel">Changed</div>
                            <ul class="uList">
                                <li>Form spacing + copy cleanup</li>
                            </ul>
                        </div>
                    </article>

                    <article class="uCard">
                        <div class="uHead">
                            <span class="uStamp">2026-01-19 21:33 MT</span>
                            <span class="uVer">v0.7</span>
                        </div>
                        <h2 class="uTitle">Navbar structure pass</h2>

                        <div class="uBlock">
                            <div class="uLabel">Changed</div>
                            <ul class="uList">
                                <li>Menu ordering cleanup</li>
                                <li>Less clunky naming</li>
                            </ul>
                        </div>
                    </article>

                    <div class="uSpacer"></div>
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
