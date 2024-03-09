<?php
$navbar = file_get_contents ("../../html/navBar.html");
$copyright = file_get_contents("../../html/copyright.html");
$fader = file_get_contents("../../html/pageFader.html");
$head = file_get_contents("../../html/repetitive.html");
?>
<!DOCTYPE html>
<html lang="en" class="fullw">
    <head>
        <meta charset="UTF-8">
        <title>Jens Be Gaming</title>
	    <?= $head ?>
        <link rel="stylesheet" href="/css/jens/jens.css">
    </head>
    <body class="jens-gaming fullw">
    <?= $fader ?>

        <h1>
            Pizza Test
        </h1>
    </body>
</html>