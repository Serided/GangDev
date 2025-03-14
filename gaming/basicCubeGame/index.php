<?php
if (session_status() == PHP_SESSION_NONE) session_start();
$navbar = file_get_contents ("https://shared.gangdev.co/html/navBar.html");
$copyright = file_get_contents("https://shared.gangdev.co/html/copyright.html");
$head = file_get_contents("https://shared.gangdev.co/html/repetitive.html");
?>
<!DOCTYPE html>
<html lang="en" onclick="jump()" onkeypress="jump()">
<head>
  <meta charset="UTF-8">
  <title>Basic Cube Game (Alpha)</title>
  <?= $head ?>
  <link rel="stylesheet" href="style.css">
</head>
<body>
    <?= $navbar ?>

    <div id="game"></div>
    <div id="character"></div>
    <div id="enemy"></div>

    <div>
        <p id="timer" style="text-align: center;margin: 10px">Time</p>
    </div>
    <!--
    <div class="scoreboard">
        <p style="text-align: center">
            <u>Furthest Traveled</u>
        </p>
    </div>

    <div class="popup" id="popup">
        <img src="/img/green_tick.png" class="submit" id="submit1">
        <div id="submit2">
            <div id="error"></div>
            <div>
                <form action="/" method="get">
                    <label style="color: white">Put your name here</label>
                    <input type="text" id="name" maxlength="15">
                </form>
            </div>
            <button type="submit" class="popupbtn btn-text" onclick="submitbtn()">Submit</button>
        </div>
        <div style="margin-top: 20px" class="submit" id="submit3">
            <h2 style="color: limegreen">
                Congrats!
            </h2>
            <p style="color: limegreen">
                Your score has been submitted!
            </p>
            <button type="submit" class="btn-text tnybtnuwu" onclick="closePopup()">OKAY!!!</button>
        </div>
    </div>
    -->
    </body>
    <script src="script.js"></script>
</html>
