<?php require_once '/var/www/gangdev/shared/php/init.php'; ?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Recovery</title>
        <link href="recovery.css" rel="stylesheet" >
        <?= $head ?>
    </head>
    <body>
        <div class="recoveryContainer">
            <div>
                <h2>Recover</h2>
                <h1>Password</h1>
            </div>
            <p class="mTop">
                We will send you the password associated with your email.
            </p>
            <form action="recover_password.php" method="post" class="mTop">
                <label for="email">Email: </label>
                <input type="email" id="email" name="email" required>
                <button type="submit" class="submit">Ya</button>
            </form>
        </div>
    </body>
</html>