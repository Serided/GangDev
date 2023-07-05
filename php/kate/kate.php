<?php
$navbar = file_get_contents ("../html/navBar.html");
?>
<!DOCTYPE html>
<html lang="en" class="fullw">
  <head>
    <meta charset="UTF-8">
    <title>Kate</title>
    <link rel="stylesheet" href="../css/style.css">
    <script src="../js/script.js"></script>
  </head>
  <body class="main-p fullw">
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

    <div class="fullw cpy-w spacing">
      <section class="fullw">
        <p class="fullw">
          &copy; 2023 by Jens Hansen
        </p>
      </section>
    </div>
  </body>
</html>
