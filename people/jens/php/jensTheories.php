<?php require_once '/var/www/gangdev/shared/php/init.php'; ?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Jens Be Theorizing</title>
	    <?= $head ?>
        <link rel="stylesheet" href="/css/jens/jens.css">
        <link rel="stylesheet" href="/css/jens/jensTheories.css">
    </head>
    <body class="main-p-theory">
        <?= $fader ?>

        <div class="spacing">
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

        <div class="sect-theory">
            <p id="output" class="txt">Answer</p>
        </div>

        <script src="/js/jens/theories.js"></script>

        <?= $copyright ?>
    </body>
</html>