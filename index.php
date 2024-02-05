<?php
$navbar = file_get_contents ("html/navBar.html");
$copyright = file_get_contents("html/copyright.html");
$fader = file_get_contents("html/pageFader.html");
?>
<!DOCTYPE html>
<html lang="en" class="fullw">
  <head>
    <meta charset="UTF-8">
    <title>Home</title>
    <link rel="stylesheet" href="/css/style.css">
    <script src="/js/script.js"></script>
  </head>
  <body class="main-p fullw">
    <?= $fader ?>
    <?= $navbar ?>
    
    <h1>
      Home
    </h1>

    <div class="fullw sect">
      <section class="fullw">
        <h2 style="color:red">
          <b>Note:</b>
        </h2>
        <p class="fullw">
          This page is about to get an overhaul. Everything here is a little out dated and not nearly funny enough, so it's gotta go.
        </p>
      </section>
    </div>

    <div class="fullw sect spacing">
      <section class="fullw">
        <h2>General Information</h2>
        <p class="fullw">
          Hi! We are GangDev, a superior group of game developers.<br>
          Seriously though…<br>
          While we might not be the best we make up for it in charisma and an endless store of donuts.
          We are the evolution of everything gaming: skill, coding, gaming, and more skill.
        </p>
      </section>
    </div>

    <div class="fullw sect spacing" id="about">
      <section class="fullw">
        <h2>About</h2>
        <p class="fullw">
          The closest group of homies you ever known.<br>
          All family at heart, we eat together, yeet together, and be lite together.<br>
          Favorite games: all of them.<br>
          Favorite things to do: everything.<br>
          Favorite colors: every single one.
        </p>
      </section>
    </div>

    <div class="fullw sect spacing" id="contact">
      <section class="fullw">
        <h2>Contact</h2>
        <p>
          <a href="mailto:scandinalien.work@gmail.com">Email Jens (scandinalien.work@gmail.com)</a>
        </p>
      </section>
    </div>

    <div class="fullw sect spacing" id="games">
      <section class="fullw">
        <h2>Games</h2>
        <p class="fullw">
          <a href="/php/games/basicCubeGame.php">The Bouncing Cube (Alpha)</a><br>
          <a href="/php/games/basicFighterGame.php">Fighting Game (Beta)</a><br>
          <a href="/php/games/basicPlatformerGame.php">Platformer Game (Alpha)</a><br>
          <a href="/php/games/theBigOne.html" target="_blank">The Big One (Alpha)</a><br>
        </p>
      </section>
    </div>

    <?= $copyright ?>
  </body>
</html>
