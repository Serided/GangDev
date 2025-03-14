<?php require_once '/var/www/gangdev/shared/php/init.php'; ?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Platformer</title>
        <link rel="stylesheet" href="style.css">
        <?= $head ?>
    </head>
    <body>
        <div id="engineInputs" class="visible">
            <p class="title">
                Press 'Tab' to toggle overlay
            </p>
            <input type="file" id="loadFile" accept=".json">
            <button id="exportButton">Export</button>
            <button id="clearButton">Clear</button>
            <button id="colorButton">Color</button>
        </div>

        <canvas id="game"></canvas>

        <script src="script.js" type="module"></script>
    </body>
</html>
