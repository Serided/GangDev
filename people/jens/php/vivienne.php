<?php
$navbar = file_get_contents ("https://shared.gangdev.co/html/navBar.html");
$footer = file_get_contents("https://shared.gangdev.co/html/footer.html");
$head = file_get_contents("https://shared.gangdev.co/html/repetitive.html");
?>
<!DOCTYPE html>
<html lang="en" class="fullw">
	<head>
		<meta charset="UTF-8">
		<title>Jens</title>
		<?= $head ?>
		<link rel="stylesheet" href="../style.css">
		<link rel="stylesheet" href="../css/vivienne.css">
	</head>
	<body class="main-p-vivienne fullw">
        <h1 class="ily">i love you</h1>
        <img src="../files/img/vivienne/vivienne_1.webp" class="cutie">
        <h1 class="ily">Vivienne</h1>
    </body>
</html>