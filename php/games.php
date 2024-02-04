<?php
$navbar = file_get_contents ("../html/navBar.html");
$copyright = file_get_contents("../../html/copyright.html");
$fader = file_get_contents("../../html/pageFader.html");
?>
<!DOCTYPE html>
<html lang="en" class="fullw">
    <head>
        <meta charset="UTF-8">
        <title>Games</title>
        <link rel="stylesheet" href="/css/style.css">
        <script src="/js/script.js"></script>
    </head>
    <body class="main-p fullw">
        <?= $fader ?>
        <?= $navbar ?>

        <h1>
            Games
        </h1>

        <div class="fullw sect">
            <section class="fullw">
                <h2>
                    <a href="/php/games/basicCubeGame.php" target="_blank">The Bouncing Cube (Alpha)</a>
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
                    <a href="/php/games/basicFighterGame.php" target="_blank">Fighting Game (Beta)</a>
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
                <h2>
                    <a href="/php/games/basicPlatformerGame.php" target="_blank">Platformer Game (Alpha)</a>
                </h2>
                <p class="fullw">
                    Currently unplayable, the next stupendous production in this line of phenomenal games.
                </p>
            </section>
        </div>

        <div class="fullw sect spacing">
            <section class="fullw">
                <h2>
                    <a href="/php/games/theBigOne.html" target="_blank">The Big One (Alpha)</a>
                </h2>
                <p class="fullw">
                    Currently unplayable, going to be a scrolling left to right adventure game. First co-op project of Jens and
                    the new member of GangDev, Isaac.
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

        <?= $copyright ?>
    </body>
</html>
