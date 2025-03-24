<?php require_once '/var/www/gangdev/shared/php/init.php'; ?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Games</title>
	    <?= $head ?>
    </head>
    <body>
        <?= $navbar ?>
        <?= $warn ?>

        <div class="sect cont entry">
            <div class="bgWrapper"></div>
            <h1 class="shimmerText">
                Games
            </h1>
        </div>

        <!--<div class="sect cont two">
            <h2>
                <a href="basicCubeGame" target="_blank">The Bouncing Cube (Alpha)</a>
            </h2>
            <p>
                An incredibly produced knock-off of the dinosaur game, it'll blow you away with it's stunning art and riveting game play.<br>
                <br>
                <b>To play, click any key to make it jump.</b>
            </p>
        </div>

        <div class="sect cont three">
            <h2>
                <a href="basicCubeGame" target="_blank">Ultimate Pong (Alpha)</a>
            </h2>
            <p>
                Incredibly designed, COMPLETELY bug free pong game I'm developing with my new custom (and very much so in development)
                game engine.<br>
                <br>
                <b>To play, move thine mouse good sir.</b>
            </p>
        </div>-->

        <div class="sect cont two">
            <h2>
                <a href="gameEngine" target="_blank">Game Engine (Alpha)</a>
            </h2>
            <p>
                A tool I use to create my games and reuse code. Currently the only user friendly tool is the platformer.
                Saves created platforms as a json file for game use.<br>
                <br>
                <b>INCLUDED</b>
            </p>
        </div>

        <div class="sect cont three">
            <h2>
                <a href="basicPlatformerGame" target="_blank">Platformer Game (Alpha)</a>
            </h2>
            <p>
                Just hop around. Be a little bunny rabbit or smth. Currently being worked on, mainly used to test code
                optimization.<br>
                <br>
                <b>W, A, S, and D to move.</b>
            </p>
        </div>

        <div class="sect cont one">
            <h2>
                <a href="https://gaming.gangdev.co/game2" target="_blank">First Multiplayer Game (Alpha) [Online]</a>
            </h2>
            <p>
                First real experience and project with websockets. Just a basic chat app currently.<br>
                <br>
                <b>To play, type and send a message goofy.</b>
            </p>
        </div>

        <div class="sect cont four">
            <h2>
                <a href="basicFighterGame" target="_blank">Fighting Game (Beta)</a>
            </h2>
            <p>
                A piece of art, this game showcases some of the most unique game play and graphical art you have ever seen.<br>
                <br>
                <b>To play, player on the left uses the W, A, S and D keys and the player on the right uses the arrow keys.</b>
            </p>
        </div>

        <?= $footer ?>
    </body>
</html>
