<?php
$navbar = file_get_contents ("../../html/navBar.html");
$copyright = file_get_contents("../../html/copyright.html");
$fader = file_get_contents("../../html/pageFader.html");
?>
<!DOCTYPE html>
<html lang="en" class="fullw">
  <head>
  <meta charset="UTF-8">
    <title>Jens Be Roastin'</title>
    <link rel="stylesheet" href="/css/style.css">
    <link rel="stylesheet" href="/css/jens/jensRoastin.css">
    <script src="/js/script.js"></script>
  </head>
  <body class="main-p fullw">
    <?= $fader ?>
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
            <button id="btn" class="roastbtn roastbtntext" style="font-size: 15px">
              Push me to <br> <b style="font-size: 25px">Insult Yourself</b>
            </button>
          </h2>
          <div>
            <p style="margin-top: 1px; font-size: 15px">
              Or <b id="timer" style="font-size: 18px">15</b> seconds until it insults you, for you.
            </p>
            <p id="output" style="color: red; font-size: 25px">
              Insult should generate here, and if it doesn't, it just doesn't like you. Rest in pepperonis!
            </p>
          </div>
          <script src="/js/jens/roast.js"></script>
        </section>
      </div>
    </div>

    <?= $copyright ?>
  </body>
</html>
