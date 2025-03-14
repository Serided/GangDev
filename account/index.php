<?php require_once '/var/www/gangdev/shared/php/init.php'; ?>
<!DOCTYPE html>
<html lang="en" class="fullw">
    <head>
        <meta charset="UTF-8" name="description" content="Home">
        <title>Account</title>
        <link rel="stylesheet" href="style.css">
        <?= $head ?>
    </head>
    <body class="main-p fullw">
    <?= $navbar ?>

    <h1>
        Account
    </h1>

    <div class="fullw sect aSect">
        <section class="fullw">
            <?php if (isset($_SESSION["user_id"])): ?>
                <div class="icon">
                    <div class="iDisplay"></div>
                </div>
                <a href="php/login/signout.php" class="sign">Sign Out</a>
            <?php else: ?>
                <a href="php/login/signin.php" class="sign">Sign In</a>
            <?php endif; ?>
            <p style="color: red"><b>Note: </b>In development</p>
        </section>
    </div>

    <?= $footer ?>
    </body>
</html>
