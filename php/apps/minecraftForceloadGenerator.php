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
        <link rel="stylesheet" href="/css/apps/minecraftForceloadGenerator.css">
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
                <h2>Functionality</h2>
                <p>
                    Because Minecraft restricts the user to a max "/forceload" area of <b>65536 blocks</b>,
                    it can be a pain to manually figure out each command if you are wanting to load a large area.
                    Using a ton of <b>math</b> and <b>JavaScript</b>, I managed to make a generator to create these commands for you,
                    only requiring two sets of <b>XZ</b> coordinates.
                </p>
            </section>
        </div>

        <div class="fullw sect spacing">
            <section class="fullw">
                <h2>Generator</h2>
                <p class="fullw">
                    <div>
                        <input type="checkbox" id="sYN"> Forward Slash ( / )
                    </div><br>

                    <div>
                        <b>Execute in:</b>
                        <label><input type="radio" id="lC" name="location" checked> Current location</label>
                        <label><input type="radio" id="lO" name="location"> Overworld</label>
                        <label><input type="radio" id="lE" name="location"> End</label>
                        <label><input type="radio" id="lN" name="location"> Nether</label>
                    </div>

                    <div>
                        <b>Type:</b>
                        <label><input type="radio" id="tA" name="type" value="add" checked> Add</label>
                        <label><input type="radio" id="tR" name="type" value="remove"> Remove</label>
                        <label><input type="radio" id="tQ" name="type" value="query"> Query</label>
                    </div><br>

                    <div>
                        <b>/forceload add</b>
                        <input type="text" id="x1" placeholder="x1">
                        <input type="text" id="z1" placeholder="z1">
                        <input type="text" id="x2" placeholder="x2">
                        <input type="text" id="z2" placeholder="z2">
                    </div><br>
                    <div>
                        <button id="gen" class="coding-crcls fbtn">Generate</button>
                        <!-- <button id="cpy" class="coding-crcls fbtn">Copy</button> -->
                    </div><br>
                    <div>
                        <p id="output" class="no-m output nfullw">
                            Commands will generate here.
                        </p>
                    </div>
                </p>
                <script src="/js/apps/minecraftForceloadGenerate.js"></script>
            </section>
        </div>

        <?= $copyright ?>
    </body>
</html>
