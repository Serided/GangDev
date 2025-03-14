<?php
if (session_status() == PHP_SESSION_NONE) session_start();
$navbar = file_get_contents ("https://shared.gangdev.co/html/navBar.html");
$copyright = file_get_contents("https://shared.gangdev.co/html/copyright.html");
$head = file_get_contents("https://shared.gangdev.co/html/repetitive.html");
?>
<!DOCTYPE html>
<html lang="en" class="fullw">
  <head>
    <meta charset="UTF-8">
    <title>Jorgen</title>
    <?= $head ?>
  </head>
  <body class="main-p fullw">
    <?= $navbar ?>

    <h1>
      Jorgen
    </h1>

    <div class="fullw sect">
      <section class="fullw">
        <h2>About Me</h2>
        <p class="fullw">
          As your friendly neighborhood Amongus, I find it my first priority to be amazing in every way, shape, and form.
          <br>
          The games I play include: Minecraft (username: scandinaliens), Albion (username: gailselt), League of Legends
          (username: Estreywo),
          <br>
          Fortnite (username: Scandinaliens), Trove (username: Raaj_Nak), and of course, Amongus (username: I have no idea).
          <br>
          My discord is Scandinaliens#5838, and my main email is jorgen@iviking.org.
          As always, stay AMONGUS.
        </p>
      </section>
    </div>

    <?= $copyright ?>
  </body>
</html>
