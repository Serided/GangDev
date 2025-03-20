<?php require_once '/var/www/gangdev/shared/php/init.php'; ?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Contact</title>
	    <?= $head ?>
    </head>
    <body>
        <?= $navbar ?>
        <?= $warn ?>

        <div class="sect cont entry">
            <div class="bgWrapper"></div>
            <h1>
                Contact
            </h1>
        </div>

        <div class="sect cont two">
            <h2>Contacting The Company</h2>
            <a href="mailto:company@gangdev.co">Come say hi! (company@gangdev.co)</a>
        </div>

        <div class="sect cont three">
            <h2>Individual Contacts</h2>

            <h3>Jens</h3>
            <p style="color: purple">
                <a href="mailto:jens.hansen@gangdev.co">Email Me (jens.hansen@gangdev.co)</a>
            </p>
        </div>

        <?= $footer ?>
    </body>
</html>
