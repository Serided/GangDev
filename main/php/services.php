<?php
$navbar = file_get_contents ("../html/navBar.html");
$copyright = file_get_contents("../html/copyright.html");
$fader = file_get_contents("../html/pageFader.html");
$head = file_get_contents("../html/repetitive.html");
?>
<!DOCTYPE html>
<html lang="en" class="fullw">
    <head>
        <meta charset="UTF-8">
        <title>Services</title>
	    <?= $head ?>
        <link rel="stylesheet" href="/main/css/style.css">
        <script src="/main/js/script.js"></script>
    </head>
    <body class="main-p fullw">
        <?= $fader ?>
        <?= $navbar ?>

        <h1>
            Services
        </h1>

        <div class="fullw sect">
            <section class="fullw">
                <h2>
                    PC Building
                </h2>
                <p class="fullw">
                    <b><i>"Have your PC fully assembled and/or built based on your budget!"</i></b><br>
                    Jens has 60+ hours experience assembling PC builds online, and 10+ hours experience building PCs.
                    He has also assembled PCs for multiple third parties.
                    Payments will be agreed on through communication. Further clarification through email.
                    <br><a href="mailto:scandinalien.work@gmail.com">Email Me (scandinalien.work@gmail.com)</a>
                </p>
            </section>
        </div>

        <div class="fullw sect spacing">
            <section class="fullw">
                <h2>
                    John's Lemonade
                </h2>
                <p class="fullw">
                    <b><i>"A cup of the finest lemonade, delivered straight to you. Shipping included in the cost. Very expensive."</i></b><br>
                    Basically "Buy Me A Coffee" but you buy yourself a lemonade and we use the remaining money to make coding profitable.
                    This also gives us a chance to get out of our chairs and drive around town (delivering the lemonade). All around dubs.
                    <br><a href="mailto:scandinalien.work@gmail.com">Email Me (scandinalien.work@gmail.com)</a>
                </p>
            </section>
        </div>

        <div class="fullw sect spacing">
            <section class="fullw">
                <h2>
                    Minecraft Coding and 'Adminning'
                </h2>
                <p class="fullw">
                    <b><i>"Hire an admin for your server for dirt cheap, and/or get a idea up and running in Minecraft with the use of datapacks and coding."</i></b><br>
                    Jens has over 450+ hours of experience coding in Minecraft, having done it since he was ten. Has been the admin of 10+ servers over the past few years,
                    half of which were not private.
                    <br><a href="mailto:scandinalien.work@gmail.com">Email Me (scandinalien.work@gmail.com)</a>
                </p>
            </section>
        </div>

        <div class="fullw sect spacing">
            <section class="fullw">
                <h2 style="color:red">
                    <b>Note:</b>
                </h2>
                <p class="fullw">
                    While these services are legit, it is a negotiation between the customer and the seller, as opposed to an official business.<br>
                    Currently nothing is available at a set price.
                </p>
            </section>
        </div>

        <?= $copyright ?>
    </body>
</html>
