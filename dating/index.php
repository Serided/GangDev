<?php require_once '/var/www/gangdev/shared/php/init.php'; ?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" name="description" content="Home">
        <title>Home</title>
        <?= $head ?>
    </head>
    <body>
        <p style="color: red">yikes looks like im slacking u'll have to come back later :(</p>
        <!--<div class="navbar">
            <a class="navbtn" href="">hi</a><br>
            <a class="navbtn" href="">hi</a><br>
            <a class="navbtn" href="">hi</a><br>
            <a class="navbtn" href="">hi</a><br>
            <a class="navbtn" href="">hi</a>
        </div>-->
        <div class="subject" id="subject">
            <div class="skip">
                <button class="btn" type="button" hidden="hidden" id="skip"></button>
            </div>
            <div class="match">
                <button class="btn" type="button" hidden="hidden" id="match"></button>
            </div>
        </div>
        <script type="text/javascript" src="script.js"></script>
    </body>
</html>