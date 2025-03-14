<?php
if (session_status() == PHP_SESSION_NONE) {
	session_start();
}
$navbar = file_get_contents ("https://shared.gangdev.co/html/navBar.html");
$copyright = file_get_contents("https://shared.gangdev.co/html/copyright.html");
$head = file_get_contents("https://shared.gangdev.co/html/repetitive.html");
?>
<!DOCTYPE html>
<html lang="en" class="fullw">
    <head>
        <meta charset="UTF-8">
        <title>Isaac</title>
	    <?= $head ?>
    </head>
    <body class="main-p fullw">
        <?= $navbar ?>

        <h1>
            Isaac
        </h1>

        <div class="fullw sect">
            <section>
                <h2>Isaac</h2>
                <p>
                    More about me later u silly billy
                </p>
            </section>
        </div>

        <div class="fullw sect spacing">
            <div>
                <section>
                    <h2>
                        Games
                    </h2>
                    <p class="fullw">
                        <a href="https://gaming.gangdev.co/theBigOne" target="_blank">The Big One (Alpha)</a><br>
                    </p>
                </section>
            </div>
        </div>

        <?= $copyright ?>
    </body>
</html>
