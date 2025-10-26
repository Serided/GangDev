<?php require_once '/var/www/gangdev/shared/php/init.php'; ?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" name="description" content="Home">
        <title>Home</title>
        <link rel="stylesheet" type="text/css" href="style.css"/>
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
                Most people hit a goal and stop there — we don’t.
                We keep going because progress doesn’t stop just because we got comfortable.

                <br><br>

                <b>Perfect isn’t impossible<b>. It’s just not supposed to be easy.
                The things that used to be impossible — flight, phones, space travel — only stayed that way until someone decided to keep going.

                <br><br>

                Every push, every setback, every late night — it all pushes the line forward. The work doesn’t end. Neither do we.
            </p>
        </div>

        <div class="sect cont three" id="products">
            <div class="columns">
                <div class="mods sect">
                    <h2>Mods</h2>
                    <p class="desc">
                        <a href="https://mods.gangdev.co/minecraft/resource_packs">- Minecraft (Resource Packs) -</a><br>
                        <a href="https://mods.gangdev.co/minecraft/data_packs">- Minecraft (Data Packs) -</a><br>
                    </p>
                </div>
                <div class="games sect">
                    <h2>Games</h2>
                    <div class="cont">
                        <div class="link">
                            <a href="https://gaming.gangdev.co/gameEngine" target="_blank">- Game Engine -<br>(Alpha)</a>
                        </div>
                        <!--<div class="link">
                            <a href="https://gaming.gangdev.co/basicCubeGame" target="_blank">- The Bouncing Cube -<br>(Alpha)</a>
                        </div>
                        <div class="link">
                            <a href="https://gaming.gangdev.co/ultimatePong" target="_blank">- Ultimate Pong -<br>(Alpha)</a>
                        </div>
                        <div class="link">
                            <a href="https://gaming.gangdev.co/basicPlatformerGame" target="_blank">- Platformer Game -<br>(Alpha)</a>
                        </div>-->
                        <div class="link">
                            <a href="https://crust.gangdev.co/game1" target="_blank">- Crust -<br>(Alpha) <b>[Online]</b></a>
                        </div>
                        <div class="link">
                            <a href="https://gaming.gangdev.co/basicFighterGame" target="_blank">- Fighting Game -<br>(Beta)</a>
                        </div>
                    </div>
                </div>
                <div class="apps sect">
                    <h2>Apps</h2>
                    <p class="desc">
                        <a href="https://apps.gangdev.co/web/roastGenerator/">- Roast Generator -</a><br>
                        <a href="https://apps.gangdev.co/web/mmfGenerator/">- MMF Generator -</a><br>
                        <!--<a href="https://apps.gangdev.co/universalChat/" target="_blank">- Universal Chat -</a><br>-->
                    </p>
                </div>
            </div>
        </div>

        <div class="sect cont one" id="contact">
            <h2>Contact</h2>
            <a href="mailto:company@gangdev.co">(company@gangdev.co)</a>
            <form action="/shared/php/process_contact.php" method="post">
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
    </body>
</html>
