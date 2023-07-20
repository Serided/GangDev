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
		<h2>Put title here</h2>
		<p>
			Put reg text here
		</p>
	</section>
</div>

<div class="fullw sect spacing">
	<div>
		<section>
			<h2>

			</h2>
			<p>

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
