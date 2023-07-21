<!DOCTYPE html>
<html lang="en" onclick="jump()" onkeypress="jump()">
<head>
  <meta charset="UTF-8">
  <title>Basic Cube Game (Alpha)</title>
  <link rel="stylesheet" href="/css/games/basicCubeGame.css">
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <div id="game">
    <div id="character"></div>
    <div id="block"></div>
  </div>

  <div class="scoreboard spacing">
      <p style="text-align: center">
          <u>Furthest Traveled</u>
      </p>
  </div>

  <div class="popup">
      <img src="/img/green_tick.png"">
      <div>
          <button type="submit" class="popupbtn btn-text">Submit</button>
      </div>
      <div style="margin-top: 20px;">
          <h2 style="color: limegreen">
              Congrats!
          </h2>
          <p style="color: limegreen">
              Your score has been submitted!
          </p>
          <button type="submit" class="btn-text tnybtnuwu">OKAY!!!</button>
      </div>
  </div>
</body>
<script src="/js/games/basicCubeGame/script.js"></script>
</html>
