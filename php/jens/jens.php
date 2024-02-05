<?php
$navbar = file_get_contents ("../../html/navBar.html");
$copyright = file_get_contents("../../html/copyright.html");
$fader = file_get_contents("../../html/pageFader.html");
?>
<!DOCTYPE html>
<html lang="en" class="fullw">
  <head>
    <meta charset="UTF-8">
    <title>Jens</title>
    <link rel="stylesheet" href="/css/style.css">
    <link rel="stylesheet" href="/css/jens/jens.css">
    <script src="/js/script.js"></script>
  </head>
  <body class="main-p fullw">
    <?= $fader ?>
    <?= $navbar ?>

    <h1>
      Jens
    </h1>

    <div class="fullw sect">
      <section>
        <h2>Who Am I?</h2>
        <p>
          Hello! My full name is Jens Hansen.<br>
          The superior gamer, I've been popping off in all of your favorite video games since you were a wee kid.<br>
          My current video games are Fortnite,
          <a href="/php/jens/minecraft.php" class="hidden-link">Minecraft</a>,
          League of Legends, and Valorant.<br>
          Recently, I have been getting into Factorio and Satisfactory.<br>
          Favorite food has <u>GOT</u> to be donuts. Those rings of perfection are my go-to for anything: meals, snacking, and wedding luncheons.<br>
          Favorite general activities are coding,
          <a href="/php/jens/jensGaming.php" class="hidden-link">gaming</a>,
          <a href="/php/jens/jensTheories.php" class="hidden-link">theorizing</a>, and
          <a href="/php/jens/jensGettinBuff.php" class="hidden-link">working out</a>. I get those gains and then I rapidly lose them.<br>
          I am toxic so don't kill me in Fortnite or I <u>WILL</u>
          <a href="/php/jens/jensRoastin.php" class="hidden-link">call you trash</a>. Even if you are better.<br>
        </p>
      </section>
    </div>

    <div class="fullw sect spacing">
      <div>
        <section>
          <h2>Expertise</h2>
          <p>
            I have a vast array of experience in computer science.
          </p>
        </section>
      </div>
      <div>
        <p class="coding-crcls">
          560+ hours of<br>
          <b style="font-size:30px; margin:0">MC Code</b>
        </p>
        <p class="no-m nfullw coding-crcls">
          110+ hours of<br>
          <b style="font-size:30px; margin:0">Python</b>
        </p>
        <p class="no-m nfullw coding-crcls">
          110+ hours of<br>
          <b style="font-size:30px; margin:0">HTML</b>
        </p>
        <p class="no-m nfullw coding-crcls">
          65+ hours of<br>
          <b style="font-size:30px; margin:0">CSS</b>
        </p>
        <p class="no-m nfullw coding-crcls">
          40+ hours of<br>
          <b style="font-size:30px; margin:0">JS</b>
        </p>
        <p class="no-m nfullw coding-crcls">
          30+ hours of<br>
          <b style="font-size:30px; margin:0">Ruby</b>
        </p>
        <p class="no-m nfullw coding-crcls">
          20+ hours of<br>
          <b style="font-size:30px; margin:0">PHP</b>
        </p>
        <p class="no-m nfullw coding-crcls">
          5+ hours of<br>
          <b style="font-size:30px; margin:0">Kotlin</b>
        </p>
      </div>
      <div>
        <p class="exp-crcls">
          60+ hours of<br>
          <b style="font-size:30px; margin:0">PC Assembly</b>
        </p>
        <p class="no-m nfullw exp-crcls">
          10+ hours of<br>
          <b style="font-size:30px; margin:0">PC Building</b>
        </p>
      </div>
    </div>


    <div class="fullw sect spacing">
      <section class="fullw">
        <h2>My Links</h2>
        <p class="fullw">
          <a href="https://www.instagram.com/ser1ded/" target="_blank">Instagram</a><br>
          <a href="https://scandinalienballer.wixsite.com/jenshansenportfolio" target="_blank">Digital Media Portfolio</a><br>
          <a href="https://www.youtube.com/channel/UC_SfGASnIXAkrVwugpZ9eLg" target="_blank">YouTube</a><br>
          <a href="https://github.com/Serided" target="_blank">GitHub</a><br>
          <a href="https://stackoverflow.com/users/20779197/serided" target="_blank">Stack Overflow</a>
        </p>
      </section>
    </div>

    <div class="fullw sect spacing">
      <section class="fullw">
        <h2>Projects</h2>
        <p class="fullw">
          <a href="https://github.com/Serided/GangDev" target="_blank">GangDev Website</a><br>
          <a href="/php/apps/minecraftForceloadGenerator.php" target="_blank">Minecraft Forceload Generator</a><br>
          <a href="/php/games/basicCubeGame.html" target="_blank">The Bouncing Cube (Beta)</a><br>
          <a href="/php/games/basicFighterGame.html" target="_blank">Fighting Game (Beta)</a><br>
          <a href="/php/games/basicPlatformerGame.html" target="_blank">Platformer Game (Alpha)</a><br>
          <a href="/php/games/theBigOne.html" target="_blank">The Big One (Alpha)</a><br>
          <a href="/php/games/testMultiplayerGame.php" target="_blank">Test Multiplayer Game (Alpha)</a><br>

        </p>
      </section>
    </div>

    <?= $copyright ?>
  </body>
</html>
