<?php
session_start();
$head = file_get_contents("https://shared.gangdev.co/html/repetitive.html");
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sign In</title>
        <link href="../style.css" rel="stylesheet" >
        <?= $head ?>
    </head>
    <body>
        <div class="loginContainer">
            <h1>Sign In</h1>
            <hr class="marginBoost">

            <form action="/submit" method="post">
                <label for="username">Username: </label><br>
                <input type="text" id="username" name="username" required><br>
                <div class="forgot margin"><a href="forgot.php">forgot username?</a></div>

                <label for="password">Password: </label><br>
                <input type="text" id="password" name="password" required><br>
                <div class="forgot"><a href="forgot.php">forgot password?</a></div>

                <button type="submit" class="submit">Ya</button>
            </form>
            <div class="create"><a href="signup.php"> - Create A New Account - </a></div>
        </div>
    </body>
</html>