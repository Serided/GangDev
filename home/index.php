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

        <div class="sect cont home" id="home">
            <div class="shimmer">
                <div class="logo"></div>
            </div>
            <div>
                <h1 class="shimmer-txt">
                    Gang<b>DEV</b><span class="trademark">&trade;</span>
                </h1>
            </div>
        </div>

        <div class="sect cont two" id="overview">
            <h2>Overview</h2>
            <p >
                GangDev is a leading company in the field of game, app, and web development,<br>
                founded by visionary entrepreneur <b>Jens Hansen</b>.<br>
                With a strong commitment to innovation, creativity, and excellence,<br>
                GangDev has established itself as a trusted partner for individuals and businesses<br>
                seeking cutting-edge solutions in the digital realm.
            </p>
        </div>

        <div class="sect cont three" id="about">
            <h2>Mission Statement</h2>
            <p >
                At GangDev, our mission is to empower individuals and businesses<br>
                with transformative digital solutions that inspire, engage, and elevate.<br>
                We are dedicated to harnessing the latest technologies and creative methodologies<br>
                to deliver immersive experiences that resonate with audiences worldwide.<br>
                With a focus on innovation, collaboration, and client satisfaction,<br>
                we strive to exceed expectations and drive success for our partners.
            </p>
        </div>

        <div class="sect cont four" id="mods">
            <h2>Mods</h2>
            <p >
                <a href="https://mods.gangdev.co/minecraft/php/resource_packs">Minecraft (Resource Packs)</a><br>
                <a href="https://mods.gangdev.co/minecraft/php/data_packs">Minecraft (Data Packs)</a><br>
            </p>
        </div>

        <div class="sect cont three" id="apps">
            <h2>Apps</h2>
            <p >
                <a href="https://apps.gangdev.co/roastGenerator/">Roast Generator</a><br>
                <a href="https://apps.gangdev.co/mmfGenerator/">MMF Generator</a><br>
                <a href="https://apps.gangdev.co/universalChat/" target="_blank">Universal Chat</a><br>
            </p>
        </div>

        <div class="sect cont two" id="games">
            <h2>Games</h2>
            <p >
                <a href="https://gaming.gangdev.co/gameEngine" target="_blank">Game Engine (Alpha)</a><br>
                <a href="https://gaming.gangdev.co/basicCubeGame" target="_blank">The Bouncing Cube (Alpha)</a><br>
                <a href="https://gaming.gangdev.co/ultimatePong" target="_blank">Ultimate Pong (Alpha)</a><br>
                <a href="https://gaming.gangdev.co/basicPlatformerGame" target="_blank">Platformer Game (Alpha)</a><br>
                <a href="https://gaming.gangdev.co/game1" target="_blank">First Multiplayer Game (Alpha) [Online]</a><br>
                <a href="https://gaming.gangdev.co/basicFighterGame" target="_blank">Fighting Game (Beta)</a><br>
            </p>
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
