<?php
$navbar = file_get_contents ("../../html/navBar.html");
$copyright = file_get_contents("../../html/copyright.html");
$fader = file_get_contents("../../html/pageFader.html");
?>
<!DOCTYPE html>
<html lang="en" class="fullw">
<head>
	<meta charset="UTF-8">
	<title>Jens</title>
	<link rel="stylesheet" href="/css/style.css">
	<script src="/js/script.js"></script>
</head>
<body class="main-p fullw">
<?= $navbar ?>

<h1>
	Jens
</h1>

<div class="fullw sect">
	<section>
		<h2>What the actwaw fweek is dis??</h2>
		<p>

		</p>
	</section>
</div>

<div class="fullw sect spacing">
	<section class="fullw">
		<h2>Projects</h2>
		<p class="fullw">

		</p>
	</section>
</div>

<?= $copyright ?>
</body>
</html>
