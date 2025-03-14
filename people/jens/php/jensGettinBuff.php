<?php
if (session_status() == PHP_SESSION_NONE) {
	session_start();
}
$navbar = file_get_contents ("../../html/navBar.html");
$copyright = file_get_contents("../../html/copyright.html");
$fader = file_get_contents("../../html/pageFader.html");
$head = file_get_contents("../../html/repetitive.html");
?>
<!DOCTYPE html>
<html lang="en" class="fullw">
    <head>
        <meta charset="UTF-8">
        <title>Jens Be Gettin' Buff</title>
	    <?= $head ?>
        <link rel="stylesheet" href="/css/jens/jens.css">
        <link rel="stylesheet" href="/css/jens/jensGettinBuff.css">
    </head>
    <body class="">
        <?= $fader ?>

        <div class="timeline" style="text-align: center">
            <img src="/files/img/jens/jens_noob_one.jpg" width="400px" height="600px" style="margin-left: auto" class="buff">
            <img src="/files/img/jens/arrow.png" width="400px" height="300px" style="margin-top: 140px; margin-bottom: 160px">
            <img src="/files/img/jens/jens_two_7-26-2023.jpg" width="400px" height="600px" style="margin-right: auto" class="buff">
        </div>
        <div>
            <p>
                Why I look so amazing (3/10): 120 push-ups in sets of 30, 500 sit-ups in sets of 250, and helka good lighting.
            </p>
        </div>
    </body>
</html>