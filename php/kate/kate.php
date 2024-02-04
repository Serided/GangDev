<?php
$navbar = file_get_contents ("../../html/navBar.html");
$copyright = file_get_contents("../../html/copyright.html");
$fader = file_get_contents("../../html/pageFader.html");
?>
<!DOCTYPE html>
<html lang="en" class="fullw">
  <head>
    <meta charset="UTF-8">
    <title>Kate</title>
    <link rel="stylesheet" href="/css/style.css">
    <script src="/js/script.js"></script>
  </head>
  <body class="main-p fullw">
    <?= $fader ?>
    <?= $navbar ?>

    <h1>
      Kate
    </h1>

    <div class="fullw sect">
      <section class="fullw">
        <h2>No</h2>
        <p class="fullw">
          This isn't ready yet buddy
        </p>
      </section>
    </div>

    <?= $copyright ?>
  </body>
</html>
