<?php require_once '/var/www/gangdev/shared/php/init.php'; ?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Username Recovery</title>
		<link href="recovery.css" rel="stylesheet" >
		<?= $head ?>
	</head>
	<body>
		<?= $navbar ?>
        <div class="bgWrapper"></div>

        <div class="recoveryContainer">
			<div>
				<h2>Recover</h2>
				<h1>Username</h1>
			</div>
			<p class="mTop">
				We will send you the username associated with your email.
			</p>
			<form action="recover_username.php" method="post" class="mTop">
				<label for="email">Email: </label>
                <div style="display: flex;">
                    <div class="inputContainer">
                        <input type="email" id="email" name="email" required>
                    </div>
                    <button type="submit" class="submit">Ya</button>
                </div>
			</form>
		</div>
        <script src="https://shared.gangdev.co/js/script.js"></script>
    </body>
</html>