<?php
session_start();
$head = file_get_contents("https://shared.gangdev.co/html/repetitive.html");
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Recovery</title>
	<link href="../style.css" rel="stylesheet" >
	<?= $head ?>
</head>
<body>
<div class="loginContainer">
	<h1>Recovery</h1>
	<hr>

	<form>
		<label for="username">Username: </label><br>
		<input type="text" id="username" name="username" required><br>
		<a class="forgot">forgot username?</a><br><br>
	</form>

	<form>
		<label for="password">Password: </label><br>
		<input type="text" id="password" name="password" required><br>
		<a class="forgot">forgot password?</a><br><br>
	</form>

	<h2>or</h2><br>
	<a href="signup.php" class="create">Create A New Account</a>
</div>
</body>
</html>