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
                </h1>
            </div>
        </div>

        <div class="sect cont two" id="overview">
            <h2>Snitches Get Stitches;<br><b>Merge Conflicts Get Fixes</b></h2>
            <hr>
            <p>
                At <b>GangDev</b>, we run this code like a <b>tight crew</b>—no loose ends, no weak links.
                When a bug steps out of line, we take it out <i>real quick</i>. Our <b>AI? Smarter than your average snitch</b>.
                Our <b>games? More addictive than a turf war</b> over high scores. And our <b>software?
                Built so solid, it’s basically bulletproof</b>.<br><br>
                We don’t just <i>commit</i> code; we <b>make power moves</b>.
                We don’t just <i>refactor</i>; we <b>put sloppy scripts in their place</b>. So if you’re looking for <b>clean code,
                big energy, and a dev gang that never sleeps</b>—welcome to <b>GangDev</b>, where we <b>deploy fast and commit for life</b>.
            </p>
        </div>

        <div class="sect cont three" id="products">
            <div>
                <div>
                    <h2>Mods</h2>
                    <p>
                        <a href="https://mods.gangdev.co/minecraft/php/resource_packs">Minecraft (Resource Packs)</a><br>
                        <a href="https://mods.gangdev.co/minecraft/php/data_packs">Minecraft (Data Packs)</a><br>
                    </p>
                </div>
                <div>
                    <h2>Games</h2>
                    <p>
                        <a href="https://gaming.gangdev.co/gameEngine" target="_blank">Game Engine (Alpha)</a><br>
                        <a href="https://gaming.gangdev.co/basicCubeGame" target="_blank">The Bouncing Cube (Alpha)</a><br>
                        <a href="https://gaming.gangdev.co/ultimatePong" target="_blank">Ultimate Pong (Alpha)</a><br>
                        <a href="https://gaming.gangdev.co/basicPlatformerGame" target="_blank">Platformer Game (Alpha)</a><br>
                        <a href="https://gaming.gangdev.co/game1" target="_blank">First Multiplayer Game (Alpha) [Online]</a><br>
                        <a href="https://gaming.gangdev.co/basicFighterGame" target="_blank">Fighting Game (Beta)</a><br>
                    </p>
                </div>
                <div>
                    <h2>Apps</h2>
                    <p>
                        <a href="https://apps.gangdev.co/roastGenerator/">Roast Generator</a><br>
                        <a href="https://apps.gangdev.co/mmfGenerator/">MMF Generator</a><br>
                        <a href="https://apps.gangdev.co/universalChat/" target="_blank">Universal Chat</a><br>
                    </p>
                </div>
            </div>
        </div>

        <div class="sect cont one" id="contact">
            <!-- add a form -->
            <h2>Contact</h2>
            <p>
                <a href="mailto:company@gangdev.co">Email Us (company@gangdev.co)</a>
            </p>
        </div>

        <?= $footer ?>
    </body>
</html>
