<?php
$navbar = file_get_contents ("../../html/navBar.html");
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
	Minecraft
</h1>

<div class="fullw sect">
	<section>
		<h2>Datapacks</h2>
		<p>
			Nothing here for now.<br>
		</p>
	</section>
</div>

<div class="fullw sect spacing">
	<section class="fullw">
		<h2>Resource Packs</h2>
		<p class="fullw">
			FortCraft Resource Pack <a href="/files/FortCraftResourcePack" target="_blank" download>(Download)</a><br>
		</p>
	</section>
</div>

<div class="fullw sect spacing">
	<section class="fullw">
		<h2>Servers</h2>
		<p class="fullw">
			Nothing here for now.<br>
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
