<?php
session_start();
$head = file_get_contents("https://shared.gangdev.co/html/repetitive.html");
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sign Up</title>
        <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet">
        <link href="../style.css" rel="stylesheet" >
        <?= $head ?>
    </head>
    <body>
        <div class="loginContainer">
            <h1>Sign Up</h1>
            <hr>

            <form action="">
                <label for="displayname">Display Name: </label>
                <span class="tooltip">ⓘ
                    <span class="tooltipText">
                        The name other players will know you by.
                    </span>
                </span>
                <br>
                <input type="text" id="displayname" name="displayname" required><br><br>

                <label for="username">Username: </label>
                <span class="tooltip">ⓘ
                    <span class="tooltipText">
                        A unique identifier for you (and it helps you sign in faster).
                    </span>
                </span>
                <br>
                <input type="text" id="username" name="username" required><br><br>

                <label for="email">Email: </label>
                <span class="tooltip">ⓘ
                    <span class="tooltipText">
                        How we store your account.
                    </span>
                </span>
                <br>
                <input type="text" id="email" name="email" required><br><br>

                <label for="password">Password: </label>
                <span class="tooltip">ⓘ
                    <span class="tooltipText">
                        The main thing making your data yours.
                    </span>
                </span>
                <br>
                <input type="text" id="password" name="password" required><br><br>
            </form>
        </div>
    </body>
</html>