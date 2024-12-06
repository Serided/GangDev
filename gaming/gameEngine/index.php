<?php
$navbar = file_get_contents ("https://shared.gangdev.co/html/navBar.html");
$head = file_get_contents("https://shared.gangdev.co/html/repetitive.html");
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Game Engine (Alpha)</title>
	<link rel="stylesheet" href="style.css">
    <?= $head ?>
</head>
    <body>
        <?= $navbar ?>
        <div class="title">
            <h1>Tools</h1><br><br><br><br>
            <a href="platformer/index.php" target="_blank">Platformer (Beta)</a>
            <p>A tool for creating platforms in platforming games. Generates a JSON file.</p>
        </div>
    </body>
</html>