<?php
require_once 'https://shared.gangdev.co/php/init.php';
$head = file_get_contents("https://shared.gangdev.co/html/repetitive.html");
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Basic Fighter Game (Beta)</title>
  <?= $head ?>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <!-- first container -->
  <div style="position: relative; display: inline-block">
    <!-- second container -->
    <div style="position: absolute; display: flex; width: 100%; align-items: center; padding: 20px">
      <!-- player1 health -->
      <div style="display: flex; justify-content: flex-end; border-left: 4px solid white" class="hb">
        <div style="width: 100%" class="hbf"></div>
        <div id="player1Health" style="width: 100%" class="hbb"></div>
      </div>
      <!-- timer -->
      <div class="t">
        <div id="timer" style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%"></div>
        <div style="display: flex; align-items: center; justify-content: center">
          <button class="gamebtn" style="margin: 10px">
            <a href="https://gangdev.co" class="btn-text" style="text-align: center">Home</a>
          </button>
        </div>
      </div>
      <!-- player2 health -->
      <div style="border-right: 4px solid white" class="hb">
        <div class="hbf"></div>
        <div id="player2Health" style="left: 0" class="hbb"></div>
      </div>
    </div>
    <div id="displayText" style="position: absolute; color: white; display: none; align-items: center; justify-content: center; top: 0; left: 0; right: 0; bottom: 0; font-size: 40px">Winner</div>
    <canvas></canvas>
  </div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.3/gsap.min.js" integrity="sha512-gmwBmiTVER57N3jYS3LinA9eb8aHrJua5iQD7yqYCKa5x6Jjc7VDVaEA0je0Lu0bP9j7tEjV3+1qUm6loO99Kw==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
  <script src="js/utilities.js"></script>
  <script src="js/classes.js"></script>
  <script src="script.js"></script>
</body>
</html>
