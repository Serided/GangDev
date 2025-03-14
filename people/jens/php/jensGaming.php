<?php require_once '/var/www/gangdev/shared/php/init.php'; ?>
<!DOCTYPE html>
<html lang="en" class="fullw">
    <head>
        <meta charset="UTF-8">
        <title>Jens Be Gaming</title>
	    <?= $head ?>
        <link rel="stylesheet" href="../style.css">
    </head>
    <body class="jens-gaming fullw">
        <h1>
            Pizza Test
        </h1>

        <div class="fullw sect">
            <div class="video-wrapper">
                <button id="left-arrow"><</button>
                <div class="video-track">
                    <video src="/jens/files/lol/Sylas%20Beautiful%20Wombo.webm"></video>
                    <video src="/jens/files/lol/Sylas%20Burst.webm"></video>
                    <video src="/jens/files/lol/Sylas%201v2%20Outplay.webm"></video>
                </div>
                <button id="right-arrow">></button>
            </div>
        </div>

    <script src="/jens/js/gaming.js"></script>

    <?= $footer ?>

    </body>
</html>