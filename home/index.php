<?php require_once '/var/www/gangdev/shared/php/init.php'; ?>
<!DOCTYPE html>
<html lang="en" class="fullw">
    <head>
        <meta charset="UTF-8" name="description" content="Home">
        <title>Home</title>
        <?= $head ?>
    </head>
    <body class="main-p fullw">
        <?= $navbar ?>
        <div class="mainSect">

        </div>
        <h1>
            Home
        </h1>

        <!--<div class="fullw sect">
            <section class="fullw">
                <h2 style="color:red">
                    <b>Note:</b>
                </h2>
                <p class="fullw">
                    This page is about to get an overhaul. Everything here is a little out dated and not nearly funny enough, so it's gotta go.
                </p>
            </section>
        </div>-->

        <div class="fullw sect">
            <section class="fullw">
                <h2>Overview</h2>
                <p class="fullw">
                    GangDev is a leading company in the field of game, app, and web development,<br>
                    founded by visionary entrepreneur <b>Jens Hansen</b>.<br>
                    With a strong commitment to innovation, creativity, and excellence,<br>
                    GangDev has established itself as a trusted partner for individuals and businesses<br>
                    seeking cutting-edge solutions in the digital realm.
                </p>
            </section>
        </div>

        <div class="fullw sect spacing" id="about">
            <section class="fullw">
                <h2>Mission Statement</h2>
                <p class="fullw">
                    At GangDev, our mission is to empower individuals and businesses<br>
                    with transformative digital solutions that inspire, engage, and elevate.<br>
                    We are dedicated to harnessing the latest technologies and creative methodologies<br>
                    to deliver immersive experiences that resonate with audiences worldwide.<br>
                    With a focus on innovation, collaboration, and client satisfaction,<br>
                    we strive to exceed expectations and drive success for our partners.
                </p>
            </section>
        </div>

        <div class="fullw sect spacing" id="mods">
            <section class="fullw">
            <h2>Mods</h2>
                <p class="fullw">
                    <a href="https://mods.gangdev.co/minecraft/php/resource_packs">Minecraft (Resource Packs)</a><br>
                    <a href="https://mods.gangdev.co/minecraft/php/data_packs">Minecraft (Data Packs)</a><br>
                </p>
            </section>
        </div>

        <div class="fullw sect spacing" id="apps">
            <section class="fullw">
            <h2>Apps</h2>
                <p class="fullw">
                    <a href="https://apps.gangdev.co/roastGenerator/">Roast Generator</a><br>
                    <a href="https://apps.gangdev.co/mmfGenerator/">MMF Generator</a><br>
                    <a href="https://apps.gangdev.co/universalChat/" target="_blank">Universal Chat</a><br>
                </p>
            </section>
        </div>

        <div class="fullw sect spacing" id="games">
            <section class="fullw">
                <h2>Games</h2>
                <p class="fullw">
                    <a href="https://gaming.gangdev.co/gameEngine" target="_blank">Game Engine (Alpha)</a><br>
                    <a href="https://gaming.gangdev.co/basicCubeGame" target="_blank">The Bouncing Cube (Alpha)</a><br>
                    <a href="https://gaming.gangdev.co/ultimatePong" target="_blank">Ultimate Pong (Alpha)</a><br>
                    <a href="https://gaming.gangdev.co/basicPlatformerGame" target="_blank">Platformer Game (Alpha)</a><br>
                    <!-- <a href="https://gaming.gangdev.co/game1" target="_blank">First Multiplayer Game (Alpha) [Online]</a><br> -->
                    <a href="https://gaming.gangdev.co/basicFighterGame" target="_blank">Fighting Game (Beta)</a><br>
                </p>
            </section>
        </div>

        <div class="fullw sect spacing" id="contact">
            <section class="fullw">
                <h2>Contact</h2>
                <p>
                    <a href="mailto:jens.hansen@gangdev.co">Email Jens (scandinalien.work@gmail.com)</a>
                </p>
            </section>
        </div>

    <?= $footer ?>
    </body>
</html>
