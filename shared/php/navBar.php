<?php
require_once '/var/www/gangdev/shared/php/init.php';
?>
<div class="hNavbar">
    <link rel="stylesheet" href="https://shared.gangdev.co/css/navbar.css">
    <label class="hamburger">
        <input type="checkbox" id="hamburger">
    </label>
    <aside class="sidebar one">
        <nav>
            <input type="radio" id="account" name="menu">
            <label for="account" class="account-btn btnText">
                <div class="profile" style="background-image: url('<?= htmlspecialchars($userIconUrl) ?>');">
                    <p><?= htmlspecialchars($displayname) ?></p>
                </div>
            </label>
            <?php if (isset($_SESSION["user_id"])): ?> <!-- change account tab content -->
                <aside class="sidebar two">
                    <nav>
                        <a href="http://account.gangdev.co" class="btnText"><button class="hamburger-btn btnText two">Account</button></a>
                        <a href="#" class="btnText"><button class="hamburger-btn btnText two">Leaderboard</button></a>
                        <a href="https://account.gangdev.co/login/signout.php" class="btnText"><button class="hamburger-btn btnText two">Sign Out</button></a>
                    </nav>
                </aside>
            <?php else: ?>
                <aside class="sidebar two">
                    <nav>
                        <a href="https://account.gangdev.co/login/signin.php" class="btnText"><button class="hamburger-btn btnText two">Sign In</button></a>
                    </nav>
                </aside>
            <?php endif; ?>

            <a href="https://gangdev.co/"><button class="hamburger-btn btnText one">Home</button></a>

            <input type="radio" id="mods" name="menu">
            <label for="mods" class="hamburger-btn btnText one">Mods</label>
            <aside class="sidebar two">
                <nav>
                    <a href="https://mods.gangdev.co/minecraft/resource_packs/index.php"><button class="hamburger-btn btnText two">Minecraft<br>(Resource Packs)</button></a>
                    <a href="https://mods.gangdev.co/minecraft/data_packs/index.php"><button class="hamburger-btn btnText two">Minecraft<br>(Data Packs)</button></a>
                    <a href="https://mods.gangdev.co/" class="btnText"><button class="hamburger-btn btnText two">More...</button></a>
                </nav>
            </aside>

            <input type="radio" id="apps" name="menu">
            <label for="apps" class="hamburger-btn btnText one">Apps</label>
            <aside class="sidebar two">
                <nav>
                    <a href="https://apps.gangdev.co/roastGenerator"><button class="hamburger-btn btnText two">Roast Generator</button></a>
                    <a href="https://apps.gangdev.co/mmfGenerator"><button class="hamburger-btn btnText two">MMF Generator</button></a>
                    <!--<a href="https://apps.gangdev.co/universalChat" target="_blank"><button class="hamburger-btn btnText two">Universal Chat</button></a>-->
                    <a href="https://apps.gangdev.co/" class="btnText"><button class="hamburger-btn btnText two">More...</button></a>
                </nav>
            </aside>

            <input type="radio" id="games" name="menu">
            <label for="games" class="hamburger-btn btnText one">Games</label>
            <aside class="sidebar two">
                <nav>
                    <a href="https://gaming.gangdev.co/gameEngine"><button class="hamburger-btn btnText two">Game Engine<br>(Alpha)</button></a>
                    <!--<a href="https://gaming.gangdev.co/basicCubeGame" target="_blank"><button class="hamburger-btn btnText two">The Bouncing Cube<br>(Alpha)</button></a>
                    <a href="https://gaming.gangdev.co/ultimatePong" target="_blank"><button class="hamburger-btn btnText two">Ultimate Pong<br>(Alpha)</button></a>-->
                    <!--<a href="https://gaming.gangdev.co/basicPlatformerGame" target="_blank"><button class="hamburger-btn btnText two">Platformer Game<br>(Alpha)</button></a>-->
                    <a href="https://crust.gangdev.co/game1" target="_blank"><button class="hamburger-btn btnText two">Crust<br>(Alpha) <b style="color: lightgreen;">[Online]</b></button></a>
                    <a href="https://gaming.gangdev.co/basicFighterGame" target="_blank"><button class="hamburger-btn btnText two">Fighting Game<br>(Beta)</button></a>
                    <a href="https://gaming.gangdev.co/" class="btnText"><button class="hamburger-btn btnText two">More...</button></a>
                </nav>
            </aside>

            <input type="radio" id="about" name="menu">
            <label for="about" class="hamburger-btn btnText one">About</label>
            <aside class="sidebar two">
                <nav>
                    <a href="https://gangdev.co/" class="btnText"><button class="hamburger-btn btnText two">Company</button></a>
                    <a href="https://jens.gangdev.co/"><button class="hamburger-btn btnText two">Jens</button></a>
                </nav>
            </aside>

            <input type="radio" id="contact" name="menu">
            <label for="contact" class="hamburger-btn btnText one">Contact</label>
            <aside class="sidebar two">
                <nav>
                    <a href="https://gangdev.co/" class="btnText"><button class="hamburger-btn btnText two">Company</button></a>
                    <a href="https://jens.gangdev.co/"><button class="hamburger-btn btnText two">Jens</button></a>
                </nav>
            </aside>
        </nav>
    </aside>
    <script src="https://gangdev.co/shared/js/navbar.js"></script>
</div>