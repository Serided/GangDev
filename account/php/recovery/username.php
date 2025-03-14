<?php
require_once 'https://shared.gangdev.co/php/init.php';
session_start();
$head = file_get_contents("https://shared.gangdev.co/html/repetitive.html");
?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Recovery</title>
		<link href="recovery.css" rel="stylesheet" >
		<?= $head ?>
	</head>
	<body>
		<div class="recoveryContainer">
			<div>
				<h2>Recover</h2>
				<h1>Username</h1>
			</div>
			<p class="mTop">
				We will send you the username associated with your email.
			</p>
			<form action="/submit" method="post" class="mTop">
				<label for="email">Email: </label>
				<input type="email" id="email" name="email" required>
				<button type="submit" class="submit">Ya</button>
			</form>
		</div>
	</body>
</html>