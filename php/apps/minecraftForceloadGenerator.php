<?php
$navbar = file_get_contents ("../../html/navBar.html");
$copyright = file_get_contents("../../html/copyright.html");
$fader = file_get_contents("../../html/pageFader.html");
?>
<!DOCTYPE html>
<html lang="en" class="fullw">
    <head>
        <meta charset="UTF-8">
        <title>Jens</title>
        <link rel="stylesheet" href="/css/style.css">
        <script src="/js/script.js"></script>
    </head>
    <body class="main-p fullw">
        <?= $fader ?>
        <?= $navbar ?>

        <h1>
            Minecraft Mass ForceLoad Generator
        </h1>

        <div class="fullw sect">
            <section>
                <h2>What the actwaw fweek is dis??</h2>
                <p>

                </p>
            </section>
        </div>

        <div class="fullw sect spacing">
            <section class="fullw">
                <h2>Testing</h2>
                <p class="fullw">
                    /forceload add
                    <input type="text" id="x1">
                    <input type="text" id="x2">
                    <input type="text" id="z1">
                    <input type="text" id="z2"><br>
                    <button id="btn gFLA">Press to generate commands for adding forceloads</button>
                    <button id="btn gFLR">Press to generate commands for removing forceloads</button>
                </p>
                <p id="output">
                    Commands should generate here.
                </p>
                <script src="/js/apps/forceloadGenerate.js"></script>
            </section>
        </div>

        <?= $copyright ?>
    </body>
</html>
