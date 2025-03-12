<?php
$navbar = file_get_contents ("https://shared.gangdev.co/html/navBar.html");
$footer = file_get_contents("https://shared.gangdev.co/html/footer.html");
$head = file_get_contents("https://shared.gangdev.co/html/repetitive.html");
?>
<!DOCTYPE html>
<html lang="en" class="fullw">
    <head>
        <meta charset="UTF-8" name="description" content="Home">
        <title>Account</title>
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
                This page is about to get an overhaul. Everything here is a little out dated and not nearly funny enough, so it's gotta go.
            </p>
        </section>
    </div>

    <div class="fullw sect spacing">
        <section class="fullw">
            <h2>Sign In</h2>
            <p class="fullw">
                <a href="php/signin.php">Sign In Page</a>
            </p>
        </section>
    </div>

    <?= $footer ?>
    </body>
</html>
