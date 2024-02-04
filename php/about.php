<?php
$navbar = file_get_contents ("../html/navBar.html");
$copyright = file_get_contents("../../html/copyright.html")
?>
<!DOCTYPE html>
<html lang="en" class="fullw">
    <head>
        <meta charset="UTF-8">
        <title>About</title>
        <link rel="stylesheet" href="/css/style.css">
        <script src="/js/script.js"></script>
    </head>
    <body class="main-p fullw">
        <?= $navbar ?>

        <h1>
        About
        </h1>

        <div class="fullw sect">
        <section class="fullw">
            <h2>About The Company</h2>
            <p class="fullw">
                Founded by the One and Only Most Amazing Jens Hansen, under the influence of too much sugar and a tad bit of caffeine.
            </p>
        </section>
        </div>

        <div class="fullw sect spacing">
        <section class="fullw">
            <h2>About The Gang</h2>

            <h3>Jens</h3>
            <p class="fullw" style="margin:0; color: purple">
                During the most convenient of times (school finals), Jens got the sudden inspiration to create his own website. He then proceeded to buy an ip, server,
                and whip out the bones of this website in the span of 16 hours. Thus started GangDev, the coolest group of programmers you ever dreamed of.
            </p>

            <h3>Jorgen</h3>
            <p class="fullw" style="margin-top:0; margin-bottom:20px; color: green">
                He's playing Minecraft... one sec.
            </p>

            <!-- <h3>Kate</h3>
            <p class="fullw" style="margin:0; color: pink">
                Doing something healthy and not in front of her computer...
            </p> -->

            <h3>John</h3>
            <p class="fullw" style="margin-top:0; margin-bottom:20px; color: blue">
                Pwning noobs either irl or online... I really don't know.
            </p>
        </section>
        </div>

        <?= $copyright ?>
    </body>
</html>
