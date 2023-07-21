<?php
$navbar = file_get_contents ("../../html/navBar.html");
?>
<!DOCTYPE html>
<html lang="en" class="fullw">
<head>
	<meta charset="UTF-8">
	<title>Isaac</title>
	<link rel="stylesheet" href="/css/style.css">
	<script src="/js/script.js"></script>
</head>
<body class="main-p fullw">
<?= $navbar ?>

<h1>
	Isaac
</h1>

<div class="fullw sect">
	<section>
		<h2>Isaac</h2>
		<p>
			More about me later u silly billy
		</p>
	</section>
</div>

<div class="fullw sect spacing">
	<div>
		<section>
			<h2>
                Games
			</h2>
            <p class="fullw">
                <a href="/php/games/theBigOne.html" target="_blank">The Big One (Alpha)</a><br>
            </p>
		</section>
	</div>
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
