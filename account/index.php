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

    <div class="fullw sect">
        <section class="fullw">
            <h2 style="color:red">
                <b>Note:</b>
            </h2>
            <p class="fullw">
                In development.
            </p>
        </section>
    </div>

    <div class="fullw sect spacing">
        <section class="fullw">
            <h2>Information</h2>
            <p class="fullw">
	            <?php if (isset($_SESSION["user_id"])): ?>
                    <div class="icon">
                        <div class="iDisplay"></div>
                    </div>
                    <a href="php/login/signout.php">Sign Out</a>
                <?php else: ?>
                    <a href="php/login/signin.php">Sign In</a>
                <?php endif; ?>
            </p>
        </section>
    </div>

    <?= $footer ?>
    </body>
</html>
