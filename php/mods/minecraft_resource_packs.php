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
        <title>Minecraft (Resource Packs)</title>
        <?= $head ?>
    </head>
    <body class="main-p fullw">
        <?= $fader ?>
        <?= $navbar ?>

        <h1>
            Minecraft (Resource Packs)
        </h1>

        <div class="fullw sect">
            <section class="fullw">
                <h2>
                    <a href="/files/minecraft/Unofficial_In-N-Out_Resource_Pack_1.20.5.zip">The Unofficial In-N-Out Resource Pack (1.20.5)</a>
                </h2>
                <p class="fullw">
                    In Dev
                    <br>
                    <br>
                    <b>Meant to be paired with <a href="/files/minecraft/Unofficial_In-N-Out_Datapack_1.20.5.zip">The Unofficial In-N-Out Data Pack (1.20.5)</a></b>
                </p>
            </section>
        </div>

        <div class="fullw sect spacing">
            <section class="fullw">
                <h2>
                    <a href="">IN PROGRESS</a>
                </h2>
                <p class="fullw">
                    Coming soon...<br>
                    <br>
                    <b>UNKNOWN</b>
                </p>
            </section>
        </div>

        <div class="fullw sect spacing">
            <section class="fullw">
                <h2 style="color:red">
                    <b>Note:</b>
                </h2>
                <p class="fullw">
                    In development.
                </p>
            </section>
        </div>

        <?= $copyright ?>
    </body>
</html>
