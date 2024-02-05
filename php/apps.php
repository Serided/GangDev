<?php
$navbar = file_get_contents ("../html/navBar.html");
$copyright = file_get_contents("../../html/copyright.html");
$fader = file_get_contents("../../html/pageFader.html");
?>
<!DOCTYPE html>
<html lang="en" class="fullw">
	<head>
		<meta charset="UTF-8">
		<title>Apps</title>
		<link rel="stylesheet" href="/css/style.css">
		<script src="/js/script.js"></script>
	</head>
	<body class="main-p fullw">
	<?= $fader ?>
	<?= $navbar ?>

		<h1>
			Apps
		</h1>

		<div class="fullw sect">
			<section class="fullw">
				<h2>
					<a href="/php/apps/minecraftForceloadGenerator.php">Minecraft Forceload Generator</a>
				</h2>
				<p class="fullw">
					Used to generate mass forceload commands, snapping to biggest chunk area possible, enabling for big
					Minecraft construction projects.<br>
					<br>
					<b>Takes in two sets of coordinates</b>
				</p>
			</section>
		</div>

		<div class="fullw sect spacing">
			<section class="fullw">
				<h2>
					<a href="">IN PROGRESS</a>
				</h2>
				<p class="fullw">
					Coming soon...<br>
					<br>
					<b>UNKNOWN</b>
				</p>
			</section>
		</div>

		<div class="fullw sect spacing">
			<section class="fullw">
				<h2 style="color:red">
					<b>Note:</b>
				</h2>
				<p class="fullw">
					In development.
				</p>
			</section>
		</div>

	<?= $copyright ?>
	</body>
</html>
