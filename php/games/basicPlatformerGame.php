<?php
$fader = file_get_contents("../../html/pageFader.html");
$head = file_get_contents("../../html/repetitive.html");
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Basic Platformer Game</title>
  <?= $head ?>
</head>
<body>
    <?= $fader ?>

</body>
</html>
