<?php
$navbar = file_get_contents ("/html/navBar.html");
$copyright = file_get_contents("/html/copyright.html")
?>
<!DOCTYPE html>
<html lang="en" class="fullw">
  <head>
    <meta charset="UTF-8">
    <title>John</title>
    <link rel="stylesheet" href="/css/style.css">
    <script src="/js/script.js"></script>
  </head>
  <body class="main-p fullw">
    <?= $navbar ?>

    <h1>
      John
    </h1>

    <div class="fullw sect">
      <section class="fullw">
        <h2>heyo</h2>
        <p class="fullw" style="color: darkblue"> <!--hey jens you are very sus, in fact, you are an imposter.-->
          hey im sus?
        </p>
      </section>
    </div>

    <div class="fullw sect spacing">
      <section class="fullw">
        <h2>Chungus</h2>
        <p class="fullw">
          Amongus
        </p>
      </section>
    </div>

    <div class="fullw sect spacing">
       <section class="fullw">
         <h2>Chungus</h2>
         <p class="fullw">
           Amongus
         </p>
       </section>
    </div>

    <?= $navbar ?>
  </body>
</html>
