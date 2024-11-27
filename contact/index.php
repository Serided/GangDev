<?php
$navbar = file_get_contents ("../const/html/navBar.html");
$footer = file_get_contents("../const/html/footer.html");
$head = file_get_contents("../const/html/repetitive.html");
?>
<!DOCTYPE html>
<html lang="en" class="fullw">
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
        <section class="fullw">
            <h2>Contacting The Company</h2>
            <p class="fullw">
                We don't currently have a group email or phone set up yet. I will keep you posted though... I swear.
            </p>
        </section>
        </div>

        <div class="fullw sect spacing">
        <section class="fullw">
            <h2>Individual Contacts</h2>

            <h3>Jens</h3>
            <p class="fullw" style="margin:0; color: purple">
                <a href="mailto:scandinalien.work@gmail.com">Email Me (scandinalien.work@gmail.com)</a>
            </p>

            <h3>Jorgen</h3>
            <p class="fullw" style="margin-top:0; margin-bottom:20px; color: green">
                <a href="mailto:jorgen@iviking.org">Email Me(jorgen@iviking.org)</a>
            </p>

            <!-- <h3>Kate</h3>
            <p class="fullw" style="margin:0; color: pink">
                Kinda SUS that you looking over here... keep your eyes to your own email, buddy.
            </p>

            <h3>John</h3>
            <p class="fullw" style="margin-top:0; margin-bottom:20px; color: blue">
                "Probably not for now" says he.
            </p> -->
        </section>
        </div>

        <?= $footer ?>
    </body>
</html>
