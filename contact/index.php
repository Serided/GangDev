<?php require_once '/var/www/gangdev/shared/php/init.php'; ?>
<!DOCTYPE html>
<html lang="en" >
    <head>
        <meta charset="UTF-8">
        <title>Contact</title>
	    <?= $head ?>
    </head>
    <body class="main-p fullw">
        <?= $navbar ?>

        <h1>
        Contact
        </h1>

        <div class="fullw sect">
        <section >
            <h2>Contacting The Company</h2>
            <p >
                We don't currently have a group email or phone set up yet. I will keep you posted though... I swear.
            </p>
        </section>
        </div>

        <div class="fullw sect spacing">
        <section >
            <h2>Individual Contacts</h2>

            <h3>Jens</h3>
            <p  style="margin:0; color: purple">
                <a href="mailto:scandinalien.work@gmail.com">Email Me (scandinalien.work@gmail.com)</a>
            </p>

            <h3>Jorgen</h3>
            <p  style="margin-top:0; margin-bottom:20px; color: green">
                <a href="mailto:jorgen@iviking.org">Email Me(jorgen@iviking.org)</a>
            </p>

            <!-- <h3>Kate</h3>
            <p  style="margin:0; color: pink">
                Kinda SUS that you looking over here... keep your eyes to your own email, buddy.
            </p>

            <h3>John</h3>
            <p  style="margin-top:0; margin-bottom:20px; color: blue">
                "Probably not for now" says he.
            </p> -->
        </section>
        </div>

        <?= $footer ?>
    </body>
</html>
