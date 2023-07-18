<?php
$navbar = file_get_contents ("../../html/navBar.html");
?>
<!DOCTYPE html>
<html lang="en" class="fullw">
  <head>
  <meta charset="UTF-8">
    <title>Jens Be Roastin'</title>
    <link rel="stylesheet" href="/css/style.css">
    <script src="/js/script.js"></script>
  </head>
  <body class="main-p fullw">
    <?= $navbar ?>

    <h1>
      Best Roasts Around
    </h1>

    <div class="fullw sect">
      <section>
        <h2>Purpose?</h2>
        <p>
          You better believe that I'd rather have a generated insult than waste valuable seconds of my time thinking one up.
          Time is money, and I'm saving up for a heck ton of VBucks right now.
        </p>
      </section>
    </div>

    <div class="fullw sect spacing">
      <div>
        <section>
          <h2>
            <button id="btn">Insult Me</button>
          </h2>
          <p id="output">
            Insult should generate here.
          </p>
          <script src="/js/jens/roast.js"></script>
        </section>
      </div>
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
