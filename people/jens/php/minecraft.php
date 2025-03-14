<?php
require_once 'https://shared.gangdev.co/php/init.php';
$navbar = file_get_contents ("../../html/navBar.html");
$copyright = file_get_contents("../../html/copyright.html");
$fader = file_get_contents("../../html/pageFader.html");
$head = file_get_contents("../../html/repetitive.html");
?>
<!DOCTYPE html>
<html lang="en" class="fullw">
    <head>
        <meta charset="UTF-8">
        <title>Jens</title>
	    <?= $head ?>
    </head>
    <body class="main-p fullw">
        <?= $fader ?>
        <?= $navbar ?>

        <h1>
            Minecraft
        </h1>

        <div class="fullw sect">
            <section>
                <h2>Datapacks</h2>
                <p>
                    Nothing here for now.<br>
                </p>
            </section>
        </div>

        <div class="fullw sect spacing">
            <section class="fullw">
                <h2>Resource Packs</h2>
                <p class="fullw">
                    FortCraft Resource Pack <a href="/files/minecraft/FortCraftResourcePack.zip" target="_blank" download="FortCraftResourcePack">(Download)</a><br>
                </p>
            </section>
        </div>

        <div class="fullw sect spacing">
            <section class="fullw">
                <h2>Servers</h2>
                <p class="fullw">
                    Nothing here for now.<br>
                </p>
            </section>
        </div>

        <?= $copyright ?>

    </body>
</html>
