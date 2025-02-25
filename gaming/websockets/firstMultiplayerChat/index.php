<?php
$navbar = file_get_contents ("https://shared.gangdev.co/html/navBar.html");
$footer = file_get_contents("https://shared.gangdev.co/html/footer.html");
$head = file_get_contents("https://shared.gangdev.co/html/repetitive.html");
?>
<html>
    <head>
        <meta charset="UTF-8" name="description" content="Game 1">
        <title>Game 1</title>
	    <?= $head ?>
        <link rel="stylesheet" href="/websockets/firstMultiplayerChat/style.css">
    </head>
    <body>
        <form id="input-form">
            <label for="message">Enter Message:</label>
            <input type="text" id="message" name="message" /><br /><br />
            <input type="submit" value="Send" />
        </form>

        <div id="clientCount"></div>

        <div id="messages"></div>

        <script src="/websockets/firstMultiplayerChat/script.js"></script>
    </body>
</html>