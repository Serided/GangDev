<?php require_once '/var/www/gangdev/main/src/php/init.php'; ?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" name="description" content="Home">
        <title>GangDev</title>
        <link rel="stylesheet" type="text/css" href="style.css"/>
        <link rel="stylesheet" href="/shared/css/product-themes.css">
        <?= $head ?>
    </head>
    <body>
        <?= $navbar ?>
        <?= $warn ?>

        <div class="sect cont entry" id="home">
            <div class="bgWrapper"></div>
            <div class="shimmer">
                <div class="logo"></div>
            </div>
            <div>
                <h1 class="shimmerText">
                    Gang<b>DEV</b><span class="trademark">&trade;</span>
                </h1><br>
                <h2 class="shimmerText">
                    Founded by <b>Jens Hansen</b>
                </h2>
            </div>
        </div>

        <div class="sect cont two" id="overview">
            <h2>Done Doesn't Exist;<br><b>Only Doing.</b></h2>
            <hr>
            <p class="desc">
                <i>GangDev was built on the dissatisfaction of how easy it is to settle</i>.
                Most people hit a goal and stop there — we don't.
                We keep going because progress doesn't stop just because we got comfortable.

                <br><br>

                <b>Perfect isn't impossible</b>. It's just not supposed to be easy.
                The things that used to be impossible — flight, phones, space travel — only stayed that way until someone decided to keep going.

                <br><br>

                Every push, every setback, every late night — it all pushes the line forward. The work doesn't end. Neither do we.
            </p>
        </div>

        <div class="sect cont three" id="products">
            <div class="productsLayout">
                <div class="productsColumn">
                    <h2 class="productsHeading">Products</h2>

                    <section class="productBlock theme-candor" data-href="https://candor.you/">
                        <div class="productBanner">
                            <img class="productIcon" src="https://candor.you/src/img/logo/candor-mark.png?v=13" alt="">
                            <span class="productName">Candor</span>
                            <span class="productVersion"><?= $VERSIONS['candor'] ?></span>
                            <span class="productTag">personal OS</span>
                        </div>
                        <div class="productDesc">Personal OS for tasks, notes, routines, and a daily timeline.</div>
                    </section>

                    <section class="productBlock theme-dcops" data-href="https://dcops.co/">
                        <div class="productBanner">
                            <span class="productName"><span class="dc">DC</span><span class="ops">OPS</span></span>
                            <span class="productVersion"><?= $VERSIONS['dcops'] ?></span>
                            <span class="productTag">operations</span>
                        </div>
                        <div class="productDesc">Automation and ops tooling for clean execution.</div>
                    </section>

                    <section class="productBlock theme-inspectre" data-href="https://inspectre.link/">
                        <div class="productBanner">
                            <img class="productIcon" src="https://inspectre.link/src/inspectre-extension/icons/ghost.png" alt="">
                            <span class="productName">inspectre</span>
                            <span class="productVersion"><?= $VERSIONS['inspectre'] ?></span>
                            <span class="productTag">inspector</span>
                        </div>
                        <div class="productDesc">Instant browser tweaking for demos, mockups, and satire.</div>
                    </section>

                    <section class="productBlock theme-lafter" data-href="https://lafter.gg/">
                        <div class="productBanner">
                            <span class="productName">L<span class="brandLafterA">a</span>fter</span>
                            <span class="productVersion"><?= $VERSIONS['lafter'] ?></span>
                            <span class="productTag">drafting tool</span>
                        </div>
                        <div class="productDesc">Live draft scouting, team comp scoring, and recommendations for League.</div>
                    </section>
                </div>

                <div class="productsColumn">
                    <h2 class="productsHeading">Labs</h2>

                    <section class="productBlock theme-crust" data-href="https://crust.gangdev.co/game1">
                        <div class="crustMapBg"></div>
                        <div class="productBanner">
                            <span class="productName">CRUST</span>
                            <span class="productVersion"><?= $VERSIONS['crust'] ?></span>
                            <span class="productTag">game engine</span>
                        </div>
                        <div class="productDesc">Multiplayer WebSocket game engine with Perlin noise terrain generation.</div>
                    </section>

                    <section class="productBlock theme-gangdev" data-href="https://gaming.gangdev.co/gameEngine">
                        <div class="productBanner">
                            <img class="productIcon" src="https://gangdev.co/src/img/favicon/new/favicon-96x96.png" alt="">
                            <span class="productName">Game Engine</span>
                            <span class="productTag">alpha</span>
                        </div>
                        <div class="productDesc">Custom 2D engine with physics, input, and rendering pipeline.</div>
                    </section>

                    <section class="productBlock theme-gangdev" data-href="https://gaming.gangdev.co/basicFighterGame">
                        <div class="productBanner">
                            <img class="productIcon" src="https://gangdev.co/src/img/favicon/new/favicon-96x96.png" alt="">
                            <span class="productName">Fighting Game</span>
                            <span class="productTag">beta</span>
                        </div>
                        <div class="productDesc">2D fighter with hitboxes, combos, and frame-based combat.</div>
                    </section>

                    <section class="productBlock theme-gangdev" data-href="https://apps.gangdev.co/web/roastGenerator/">
                        <div class="productBanner">
                            <img class="productIcon" src="https://gangdev.co/src/img/favicon/new/favicon-96x96.png" alt="">
                            <span class="productName">Roast Generator</span>
                            <span class="productTag">alpha</span>
                        </div>
                        <div class="productDesc">AI-powered roasts on demand.</div>
                    </section>

                    <section class="productBlock theme-gangdev" data-href="https://apps.gangdev.co/web/mmfGenerator/">
                        <div class="productBanner">
                            <img class="productIcon" src="https://gangdev.co/src/img/favicon/new/favicon-96x96.png" alt="">
                            <span class="productName">MMF Generator</span>
                            <span class="productTag">beta</span>
                        </div>
                        <div class="productDesc">Marry, make friends, or fight — the random generator.</div>
                    </section>
                </div>
            </div>
        </div>

        <div class="sect cont one" id="contact">
            <h2>Contact</h2>
            <a href="mailto:company@gangdev.co">(company@gangdev.co)</a>
            <form action="/src/php/process_contact.php" method="post">
                <div class="details">
                    <input type="hidden" name="recipient" value="company">
                    <?php if (!isset($_SESSION["user_id"])): ?>
                    <label for="name">Name: *</label><br>
                    <div class="info"><input name="name" id="name" type="text" required></div>
                    <label for="email">Email:</label><br>
                    <div class="info"><input name="email" id="email" type="email"></div>
                    <label for="message">Message: *</label><br>
                    <div><textarea name="message" id="message" rows="5" maxlength="1000" required></textarea></div>
	                <?php else: ?>
                    <label for="name">Name:</label><br>
                    <div class="info"><input name="name" id="name" type="text"></div>
                    <label for="message">Message:</label><br>
                    <div><textarea name="message" id="message" rows="7" maxlength="2500" style="width: " required></textarea></div>
                    <?php endif; ?>
                </div>
                <div><button type="submit">Send</button></div>
            </form>
        </div>

        <?= $footer ?>

        <script>
        // Product block click handler
        document.querySelectorAll('.productBlock[data-href]').forEach(block => {
            block.addEventListener('click', () => {
                window.location.href = block.dataset.href;
            });
        });
        </script>
    </body>
</html>
