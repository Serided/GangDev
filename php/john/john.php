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
    <title>John</title>
    <?= $head ?>
  </head>
  <body class="main-p fullw">
    <?= $fader ?>
    <?= $navbar ?>

    <h1>
      John
    </h1>

    <div class="fullw sect">
      <section class="fullw">
        <h2>Heyo</h2>
        <p class="fullw" style="color: #8b0000"> <!--hey jens you are very sus, in fact, you are an imposter.-->
          I'm a interesting person (not really).
        </p>
      </section>
    </div>

    <?= $copyright ?>
  </body>
</html>
