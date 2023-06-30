<?php
$navbar = file_get_contents ("navBar.html");
?>
<!DOCTYPE html>
<html lang="en" class="fullw">
    <head>
        <meta charset="UTF-8">
        <title>Games</title>
        <link rel="stylesheet" href="css/style.css">
        <script src="js/script.js"></script>
    </head>
    <body class="main-p fullw">
        <?= $navbar ?>

        <h1>
            Games
        </h1>

        <div class="fullw sect spacing">
            <section class="fullw">
                <h2>
                    <a href="basicCubeGame.php" target="_blank">The Bouncing Cube (Alpha)</a>
                </h2>
                <p class="fullw">
                    An incredibly produced knock-off of the dinosaur game, it'll blow you away with it's stunning art and riveting game play.<br>
                    <br>
                    To play, click any key to make it jump.
                </p>
            </section>
        </div>

        <div class="fullw sect spacing">
            <section class="fullw">
                <h2>
                    <a href="basicFighterGame.php" target="_blank">Fighting Game (Beta)</a>
                </h2>
                <p class="fullw">
                    A piece of art, this game showcases some of the most unique game play and graphical art you have ever seen.<br>
                    <br>
                    To play, player on the left uses the W, A, S and D keys and the player on the right uses the arrow keys.
                </p>
            </section>
        </div>

        <div class="fullw sect spacing">
            <section class="fullw">
                <h2>
                    <a href="basicPlatformerGame.php" target="_blank">Platformer Game (Alpha)</a>
                </h2>
                <p class="fullw">
                    Unplayable currently, the next stupendous production in this line of phenomenal games.
                </p>
            </section>
        </div>

        <div class="fullw sect spacing">
            <section class="fullw">
                <h2 style="color:red">WARNING!</h2>
                <p class="fullw">
                    The descriptions for these games are all meant to be humorous. Many of these games were created using guides and are merely customized via the game play rather than the graphics. I claim no credit for the art in these games. The tactics and game play is what make these unique, as well as the format and tools used.
                </p>
            </section>
        </div>

        <div class="fullw cpy-w spacing">
            <section class="fullw">
                <p class="fullw">
                &copy; 2023 by Jens Hansen
                </p>
            </section>
        </div>
    </body>
</html>
