<?php
require_once 'https://shared.gangdev.co/php/init.php';
$copyright = file_get_contents("../../html/copyright.html");
$fader = file_get_contents("../../html/pageFader.html");
$head = file_get_contents("../../html/repetitive.html");
?>
<!DOCTYPE html>
<html lang="en" class="fullw">
    <head>
        <meta charset="UTF-8">
        <title>Jens Be Theorizing</title>
	    <?= $head ?>
        <link rel="stylesheet" href="/css/jens/jens.css">
        <link rel="stylesheet" href="/css/jens/jensTheories.css">
    </head>
    <body class="main-p-theory fullw">
        <?= $fader ?>

        <div class="fullw spacing">
            <div class="navbar-theory sect-theory">
                <p class="txt">
                    I've been looking for answers my whole life.
                </p>

                <button class="btn-theory btn-text" id="time">Time</button>
                <button class="btn-theory btn-text" id="space">Space</button>
                <button class="btn-theory btn-text" id="god">God</button>
                <button class="btn-theory btn-text" id="morality">Morality</button>

                <p class="txt">
                    Here is my knowledge.
                </p>
            </div>
        </div>

        <div class="fullw sect-theory spacing">
            <p id="output" class="txt">Answer</p>
        </div>

        <script src="/js/jens/theories.js"></script>

        <?= $copyright ?>
    </body>
</html>