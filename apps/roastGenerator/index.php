<?php require_once '/var/www/gangdev/shared/php/init.php'; ?>
<!DOCTYPE html>
<html lang="en" >
  <head>
  <meta charset="UTF-8">
    <title>Roast Generator</title>
    <?= $head ?>
    <link rel="stylesheet" href="style.css">
  </head>
  <body class="main-p fullw">
    <?= $navbar ?>

    <h1>
      Roast Generator
    </h1>

    <div class="fullw sect">
      <section>
        <h2>Purpose?</h2>
        <p>
          If you ever need a clean way of crushing someone's soul in your meaty hands, you now have that.
        </p>
      </section>
    </div>

    <div class="fullw sect spacing">
      <div>
        <section>
          <h2>
            <button id="btn" class="roastbtn roastbtntext" style="font-size: 15px">
              Push me to <br> <b style="font-size: 25px">Roast Yourself</b>
            </button>
          </h2>
          <div>
            <p style="margin-top: 1px; font-size: 15px">
              Or <b id="timer" style="font-size: 18px">15</b> seconds until it roasts you, for you.
            </p>
            <p id="output" style="color: red; font-size: 25px">
              Roast generates here.
            </p>
          </div>
          <script src="script.js"></script>
        </section>
      </div>
    </div>

    <?= $footer ?>
  </body>
</html>
