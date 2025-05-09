<?php require_once '/var/www/gangdev/shared/php/init.php'; ?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Jens</title>
	    <?= $head ?>
        <link rel="stylesheet" href="style.css">
    </head>
    <body>
        <?= $navbar ?>
        <?= $warn ?>

        <div class="sect two single">
            <h1>
                MMF Generator
            </h1><br>

            <h2>Functionality</h2>
            <p>
                The MMF Generator, or Minecraft Mass Forceload Generator, was created because Minecraft restricts the user to a max "/forceload" area of <b>65536 blocks</b>.<br>
                It can be a pain to manually figure out each command if you are wanting to load a large area.<br>
                Using a ton of <b>math</b> and <b>JavaScript</b>, I managed to make a generator to create these commands for you,
                only requiring two sets of <b>XZ</b> coordinates.
            </p><br>

            <h2>Generator</h2>
            <div>
                <div>
                    <input type="checkbox" id="sYN">Forward Slash ( / )
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
            </div>
            <script src="script.js"></script>
        </div>

        <?= $footer ?>
    </body>
</html>
