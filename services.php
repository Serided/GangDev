<?php
$navbar = file_get_contents ("navBar.html");
?>
<!DOCTYPE html>
<html lang="en" class="fullw">
    <head>
        <meta charset="UTF-8">
        <title>Services</title>
        <link rel="stylesheet" href="css/style.css">
        <script src="js/script.js"></script>
    </head>
    <body class="main-p fullw">
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
                    Jens has 60+ hours experience assembling PC builds online, and 10+ hours experience building PCs.<br>

                </p>
            </section>
        </div>

        <div class="fullw sect spacing">
            <section class="fullw">
                <h2>
                    John's Lemonade
                </h2>
                <p class="fullw">
                    A cup of the finest lemonade, delivered straight to you. Shipping included in the cost. Very expensive.
                </p>
            </section>
        </div>

        <div class="fullw sect spacing">
            <section class="fullw">
                <h2>
                    Minecraft Coding
                </h2>
                <p class="fullw">
                    One sec...
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

        <div class="fullw cpy-w spacing">
            <section class="fullw">
                <p class="fullw">
                &copy; 2023 by Jens Hansen
                </p>
            </section>
        </div>
    </body>
</html>
