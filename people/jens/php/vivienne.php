<?php
if (session_status() == PHP_SESSION_NONE) {
	session_start();
}
$navbar = file_get_contents ("https://shared.gangdev.co/html/navBar.html");
$footer = file_get_contents("https://shared.gangdev.co/html/footer.html");
$head = file_get_contents("https://shared.gangdev.co/html/repetitive.html");
?>
<!DOCTYPE html>
<html lang="en" class="fullw">
	<head>
		<meta charset="UTF-8">
		<title>Vivienne</title>
		<?= $head ?>
		<link rel="stylesheet" href="../style.css">
		<link rel="stylesheet" href="../css/vivienne.css">
	</head>
	<body class="main-p-vivienne fullw">
        <div class="windowRef" id="windowRef"></div>
        <div class="values" id="values"></div>

        <div id="comboTracker"></div>
        <div id="attributeContainer"></div>

        <h1 class="ily" style="top: 10vh">i love you</h1>
        <img src="../files/img/vivienne/vivienne_1.webp" class="cutie" alt="an incredibly beautiful girl with amazing eyes">
        <h1 class="ily" style="bottom: 10vh">Vivienne</h1>
        <script src="../js/vivienne.js"></script>
    </body>
</html>