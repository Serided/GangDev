<?php require_once '/var/www/gangdev/shared/php/init.php'; ?>
<!DOCTYPE html>
<html lang="en" class="fullw">
    <head>
        <meta charset="UTF-8">
        <title>Games</title>
	    <?= $head ?>
    </head>
    <body class="main-p fullw">
        <?= $navbar ?>

        <h1>
            Games
        </h1>

        <div class="fullw sect">
            <section class="fullw">
                <h2>
                    <a href="basicCubeGame" target="_blank">The Bouncing Cube (Alpha)</a>
                </h2>
                <p class="fullw">
                    An incredibly produced knock-off of the dinosaur game, it'll blow you away with it's stunning art and riveting game play.<br>
                    <br>
                    <b>To play, click any key to make it jump.</b>
                </p>
            </section>
        </div>

        <div class="fullw sect spacing">
            <section class="fullw">
                <h2>
                    <a href="basicCubeGame" target="_blank">Ultimate Pong (Alpha)</a>
                </h2>
                <p class="fullw">
                    Incredibly designed, COMPLETELY bug free pong game I'm developing with my new custom (and very much so in development)
                    game engine.<br>
                    <br>
                    <b>To play, move thine mouse good sir.</b>
                </p>
            </section>
        </div>

        <div class="fullw sect spacing">
            <section class="fullw">
                <h2>
                    <a href="basicPlatformerGame" target="_blank">Platformer Game (Alpha)</a>
                </h2>
                <p class="fullw">
                    Currently unplayable, the next stupendous production in this line of phenomenal games.<br>
                    <br>
                    <b>UNKNOWN</b>
                </p>
            </section>
        </div>
        <!--
        <div class="fullw sect spacing">
            <section class="fullw">
                <h2>
                    <a href="https://gaming.gangdev.co/game1" target="_blank">First Multiplayer Game (Alpha) [Online]</a>
                </h2>
                <p class="fullw">
                    First real experience and project with websockets. Just a basic chat app currently<br>
                    <br>
                    <b>To play, type and send a message goofy.</b>
                </p>
            </section>
        </div>
        -->
        <div class="fullw sect spacing">
            <section class="fullw">
                <h2>
                    <a href="basicFighterGame" target="_blank">Fighting Game (Beta)</a>
                </h2>
                <p class="fullw">
                    A piece of art, this game showcases some of the most unique game play and graphical art you have ever seen.<br>
                    <br>
                    <b>To play, player on the left uses the W, A, S and D keys and the player on the right uses the arrow keys.</b>
                </p>
            </section>
        </div>

        <div class="fullw sect spacing">
            <section class="fullw">
                <h2 style="color:red">
                    <b>Note:</b>
                </h2>
                <p class="fullw">
                    The descriptions for these games are all meant to be humorous. Many of these games were created using guides and are merely customized via the game play rather than the graphics. I claim no credit for the art in these games. The tactics and game play is what make these unique, as well as the format and tools used.
                </p>
            </section>
        </div>

        <?= $footer ?>
    </body>
</html>
