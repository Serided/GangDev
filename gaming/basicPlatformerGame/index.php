<?php
$head = file_get_contents("https://shared.gangdev.co/html/repetitive.html");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Basic Platformer Game</title>
    <link rel="stylesheet" href="style.css">
    <?= $head ?>
</head>
<body>
    <canvas id="game"></canvas>

    <script src="script.js" type="module"></script>
</body>
</html>
