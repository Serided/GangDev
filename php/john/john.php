<?php
$navbar = file_get_contents ("../html/navBar.html");
?>
<!DOCTYPE html>
<html lang="en" class="fullw">
  <head>
    <meta charset="UTF-8">
    <title>John</title>
    <link rel="stylesheet" href="../css/style.css">
    <script src="../js/script.js"></script>
  </head>
  <body class="main-p fullw">
    <?= $navbar ?>

    <h1>
      John
    </h1>

    <div class="fullw sect">
      <section class="fullw">
        <h2>Chungus</h2>
        <p class="fullw">
          Amongus
        </p>
      </section>
    </div>

    <div class="fullw cpy-w spacing">
      <section class="fullw">
        <p class="fullw">
          &copy; 2023 by Jens Hansen
        </p>
      </section>
    </div>
  </body>
</html>
